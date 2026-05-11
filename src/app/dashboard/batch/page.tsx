"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import type { Platform, GenerationResult } from "@/lib/types";

export default function BatchPage() {
  const [platform, setPlatform] = useState<Platform>("amazon");
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{ name: string; result?: GenerationResult; error?: string }[]>([]);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    const lines = input.trim().split("\n").filter(Boolean);
    if (lines.length === 0) { toast.error("Paste at least one product"); return; }
    if (lines.length > 10) { toast.error("Maximum 10 products per batch"); return; }

    setGenerating(true);
    setResults([]);

    const batchResults: { name: string; result?: GenerationResult; error?: string }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const sep = line.includes("|") ? "|" : line.includes(",") ? "," : "\t";
      const parts = line.split(sep).map((p) => p.trim());
      const name = parts[0] || `Product ${i + 1}`;
      const features = parts.slice(1).join(", ") || name;

      batchResults.push({ name, error: "Generating..." });
      setResults([...batchResults]);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName: name, features, platform }),
        });

        if (res.status === 403) {
          const err = await res.json().catch(() => ({}));
          batchResults[i] = { name, error: err.error || "Out of credits" };
          setResults([...batchResults]);
          break;
        }

        if (!res.ok) {
          batchResults[i] = { name, error: "Generation failed" };
          setResults([...batchResults]);
          continue;
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
        }

        const clean = accumulated.replace(/__DONE__|__PARSE_FAILED__/g, "").trim();
        const jsonMatch = clean.match(/\{[\s\S]*"title"[\s\S]*"bullet_points"[\s\S]*"description"[\s\S]*"keywords"[\s\S]*\}/);

        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]) as GenerationResult;
            batchResults[i] = { name, result: parsed };
          } catch {
            batchResults[i] = { name, error: "Parse error" };
          }
        } else {
          batchResults[i] = { name, error: "Unexpected format" };
        }
        setResults([...batchResults]);
      } catch {
        batchResults[i] = { name, error: "Request failed" };
        setResults([...batchResults]);
      }
    }

    setGenerating(false);
    toast.success(`Generated ${batchResults.filter((r) => r.result).length}/${lines.length} listings`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Batch Generate</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Generate multiple listings at once. One product per line.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Platform</label>
          <div className="flex gap-2 flex-wrap">
            {(["amazon", "shopify", "ebay", "aliexpress", "temu", "tiktok"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  platform === p
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border-[var(--border)] hover:bg-[var(--secondary)]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Products{" "}
            <span className="text-xs text-[var(--muted-foreground)]">
              (one per line: ProductName | Features or ProductName, Features)
            </span>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Wireless Bluetooth Headphones 5.3 | Bluetooth 5.3 chip, 40hr battery, IPX7 waterproof, Touch control, Noise cancelling\nPortable Power Bank 20000mAh | 20000mAh, Fast charge, USB-C, LED display, Lightweight`}
            rows={6}
            className="block w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none"
            disabled={generating}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating || !input.trim()}
            className="rounded-lg bg-[var(--primary)] px-6 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {generating ? "Generating..." : `Generate (${input.trim().split("\n").filter(Boolean).length} products)`}
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Results</h2>
          {results.map((item, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] p-4 animate-fade-in">
              <h3 className="text-sm font-medium mb-2">
                {i + 1}. {item.name}
              </h3>
              {item.error ? (
                <p className="text-xs text-red-500">{item.error}</p>
              ) : item.result ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{item.result.title}</p>
                  <details>
                    <summary className="cursor-pointer text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                      View details
                    </summary>
                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-[var(--muted-foreground)]">Bullet Points</p>
                        <ul className="mt-1 space-y-1">
                          {item.result.bullet_points.map((bp, j) => (
                            <li key={j} className="flex gap-2 text-xs"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[var(--foreground)]" />{bp}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--muted-foreground)]">Keywords</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.result.keywords.map((kw) => (
                            <span key={kw} className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-xs">{kw}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              ) : null}
            </div>
          ))}
          <div className="text-center text-xs text-[var(--muted-foreground)]">
            {results.filter((r) => r.result).length}/{results.length} successful
          </div>
        </div>
      )}
    </div>
  );
}
