"use client";
import { useState, useRef } from "react";
import { toast } from "sonner";
import type { GenerationResult } from "@/lib/types";
export default function NewGenerationPage() {
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [platform, setPlatform] = useState<"amazon" | "shopify">("amazon");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !features.trim()) { toast.error("Please fill in both fields"); return; }
    setLoading(true); setResult(null); setStreamingText("");
    const controller = new AbortController(); abortRef.current = controller;
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productName, features, platform }), signal: controller.signal });
      if (!res.ok) { const err = await res.json().catch(() => ({})); toast.error(err.error || "Generation failed"); setLoading(false); return; }
      const reader = res.body?.getReader(); if (!reader) throw new Error("No response stream");
      const decoder = new TextDecoder(); let accumulated = "";
      while (true) { const { done, value } = await reader.read(); if (done) break; const text = decoder.decode(value, { stream: true }); accumulated += text; setStreamingText(accumulated); }
      const jsonMatch = accumulated.match(/\{[\s\S]*"title"[\s\S]*"bullet_points"[\s\S]*"description"[\s\S]*"keywords"[\s\S]*\}/);
      if (jsonMatch) { try { const parsed = JSON.parse(jsonMatch[0]) as GenerationResult; setResult(parsed); setStreamingText(""); toast.success("Listing generated!"); } catch { toast.error("Failed to parse result"); } }
      else if (accumulated.length > 100) { toast.error("Unexpected response format"); }
    } catch (err: unknown) { if (err instanceof Error && err.name === "AbortError") { toast.info("Cancelled"); } else { toast.error("Something went wrong"); } }
    finally { setLoading(false); abortRef.current = null; }
  };
  const handleCancel = () => { abortRef.current?.abort(); };
  const copyToClipboard = async (text: string, label: string) => { await navigator.clipboard.writeText(text); toast.success(`${label} copied`); };
  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold">New Listing</h1><p className="mt-1 text-sm text-[var(--muted-foreground)]">Enter your product information in Chinese, get professional English listings.</p></div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium">Platform</label>
          <div className="mt-1 flex gap-2">
            {(["amazon", "shopify"] as const).map((p) => (
              <button key={p} type="button" onClick={() => setPlatform(p)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors ${platform === p ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]" : "border-[var(--border)] hover:bg-[var(--secondary)]"}`}>{p}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Product Name <span className="text-red-500">*</span></label>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. 无线蓝牙耳机 5.3 降噪" className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium">Features & Selling Points <span className="text-red-500">*</span></label>
          <textarea value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="List the key features in Chinese or English, e.g. 蓝牙5.3芯片, 40小时续航, IPX7防水, 触控操作..." rows={4} className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none" disabled={loading} />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="rounded-lg bg-[var(--primary)] px-6 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity disabled:opacity-50">{loading ? "Generating..." : "Generate Listing"}</button>
          {loading && <button type="button" onClick={handleCancel} className="rounded-lg border border-[var(--border)] px-6 py-2 text-sm font-medium hover:bg-[var(--secondary)] transition-colors">Cancel</button>}
        </div>
      </form>
      {streamingText && !result && (
        <div className="rounded-xl border border-[var(--border)] p-6">
          <h2 className="mb-3 text-sm font-semibold text-[var(--muted-foreground)]">Generating...</h2>
          <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed break-all">{streamingText}</div>
        </div>
      )}
      {result && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold text-[var(--muted-foreground)]">Product Title</h2><button onClick={() => copyToClipboard(result.title, "Title")} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Copy</button></div>
            <p className="text-lg font-medium">{result.title}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold text-[var(--muted-foreground)]">Bullet Points</h2><button onClick={() => copyToClipboard(result.bullet_points.join("\n"), "Bullet points")} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Copy All</button></div>
            <ul className="space-y-2">{result.bullet_points.map((point, i) => (<li key={i} className="flex gap-2 text-sm"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--foreground)]" />{point}</li>))}</ul>
          </div>
          <div className="rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold text-[var(--muted-foreground)]">Product Description</h2><button onClick={() => copyToClipboard(result.description, "Description")} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Copy</button></div>
            <div className="text-sm leading-relaxed prose" dangerouslySetInnerHTML={{ __html: result.description }} />
          </div>
          <div className="rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold text-[var(--muted-foreground)]">Search Keywords</h2><button onClick={() => copyToClipboard(result.keywords.join(", "), "Keywords")} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Copy</button></div>
            <div className="flex flex-wrap gap-2">{result.keywords.map((kw, i) => (<span key={i} className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs">{kw}</span>))}</div>
          </div>
          <button onClick={() => { setResult(null); setStreamingText(""); }} className="w-full rounded-lg border border-[var(--border)] py-3 text-sm font-medium hover:bg-[var(--secondary)] transition-colors">Generate Another Listing</button>
        </div>
      )}
    </div>
  );
}
