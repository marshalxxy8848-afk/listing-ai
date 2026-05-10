import { streamText } from "ai";
import { model } from"@/lib/ai";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { productName, features, platform } = await req.json();

    if (!productName || !features) {
      return NextResponse.json(
        { error: "productName and features are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - please sign in again" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (!profile || profile.credits <= 0) {
      return NextResponse.json(
        { error: "No credits remaining" },
        { status: 403 }
      );
    }

    const targetPlatform = platform || "amazon";
    const startTime = Date.now();

    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(productName, features, targetPlatform),
        },
      ],
      temperature: 0.7,
      maxTokens: 4096,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullText = "";

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    const aiResponse = result.toDataStreamResponse();
    const aiBody = aiResponse.body;
    if (!aiBody) throw new Error("No response body from AI");

    const reader = aiBody.getReader();

    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          await writer.write(encoder.encode(chunk));
        }

        const jsonMatch = fullText.match(
          /\{[\s\S]*"title"[\s\S]*"keywords"[\s\S]*\}/
        );
        let parsedResult: Record<string, unknown> | null = null;

        if (jsonMatch) {
          try {
            parsedResult = JSON.parse(jsonMatch[0]);
          } catch {
            const dataLines = fullText
              .split("\n")
              .filter((l) => l.startsWith("data: "))
              .map((l) => l.replace(/^data: /, "").trim())
              .filter((l) => l && l !== "[DONE]");

            let accumulated = "";
            for (const line of dataLines) {
              try {
                const parsed = JSON.parse(line);
                const content = parsed.choices?.[0]?.delta?.content || "";
                accumulated += content;
              } catch {}
            }

            const extractedJson = accumulated.match(
              /\{[\s\S]*"title"[\s\S]*"keywords"[\s\S]*\}/
            );
            if (extractedJson) {
              try {
                parsedResult = JSON.parse(extractedJson[0]);
              } catch {}
            }
          }
        }

        const endTime = Date.now();
        const tokensUsed = Math.round(fullText.length / 4);

        if (parsedResult) {
          await supabase.from("generations").insert({
            user_id: user.id,
            product_name: productName,
            features: features,
            target_platform: targetPlatform,
            title_en: parsedResult.title || "",
            bullet_points: parsedResult.bullet_points || [],
            description_en: parsedResult.description || "",
            keywords: parsedResult.keywords || [],
            model_used: "deepseek-chat",
            tokens_used: tokensUsed,
            latency_ms: endTime - startTime,
          });
        }

        await supabase
          .from("profiles")
          .update({ credits: profile.credits - 1 })
          .eq("id", user.id);

        await writer.close();
      } catch (err) {
        await writer.abort(err);
      }
    })();

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
