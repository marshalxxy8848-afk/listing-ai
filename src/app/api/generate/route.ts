import { streamText } from "ai";
import { model } from "@/lib/ai";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const maxDuration = 60;

/**
 * Safely extract JSON from AI output.
 * Handles: ```json fences, markdown wrapping, truncated JSON.
 */
function extractJSON(text: string): Record<string, unknown> | null {
  // 1. Try parsing the whole text as-is
  try {
    return JSON.parse(text);
  } catch {
    // continue
  }

  // 2. Strip markdown code fences first
  let cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // continue
  }

  // 3. Find the first { ... } block with title, bullet_points or keywords
  const patterns = [
    /\{[\s\S]*?"title"[\s\S]*?"bullet_points"[\s\S]*?"description"[\s\S]*?"keywords"[\s\S]*?\}/,
    /\{[\s\S]*?"title"[\s\S]*?"bullet_points"[\s\S]*?"keywords"[\s\S]*?\}/,
    /\{[\s\S]*?"title"[\s\S]*?"keywords"[\s\S]*?\}/,
    /\{[\s\S]*?"title"[\s\S]*?"description"[\s\S]*?\}/,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // continue
      }
    }
  }

  // 4. Try to fix truncated JSON by adding missing closing braces
  if (cleaned.startsWith("{") && cleaned.includes('"title"')) {
    let open = 0;
    let closed = 0;
    for (const ch of cleaned) {
      if (ch === "{") open++;
      if (ch === "}") closed++;
    }
    if (open > closed) {
      cleaned += "}".repeat(open - closed);
      try {
        return JSON.parse(cleaned);
      } catch {}
    }
  }

  return null;
}

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
      .select("credits, plan")
      .eq("id", user.id)
      .single();

    if (!profile || profile.credits <= 0) {
      const msg =
        profile?.plan === "free"
          ? "Out of credits, please upgrade"
          : "No credits remaining";
      return NextResponse.json({ error: msg, upgrade: true }, { status: 403 });
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
    let fullText = "";
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    (async () => {
      try {
        for await (const textChunk of result.textStream) {
          fullText += textChunk;
          await writer.write(encoder.encode(textChunk));
        }

        const parsedResult = extractJSON(fullText);
        const endTime = Date.now();

        if (parsedResult) {
          const tokensUsed = Math.round(fullText.length / 4);
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

          await supabase
            .from("profiles")
            .update({ credits: profile.credits - 1 })
            .eq("id", user.id);

          await writer.write(encoder.encode("\n__DONE__"));
        } else {
          await writer.write(encoder.encode("\n__PARSE_FAILED__"));
        }

        await writer.close();
      } catch (err) {
        await writer.abort(err);
      }
    })();

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
