"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import type { GenerationResult } from "@/lib/types";

function SkeletonBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-[var(--secondary)]"
          style={{ width: `${70 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-xs transition-all ${
        copied
          ? "text-green-500"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      }`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function UpgradeModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--background)] p-8 shadow-2xl">
        <h2 className="text-xl font-bold">Out of Credits</h2>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          You&apos;ve used all your free credits. Upgrade to Pro or Unlimited to
          continue generating listings.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/pricing"
            className="flex-1 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-center text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
          >
            View Plans
          </Link>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--secondary)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewGenerationPage() {
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [platform, setPlatform] = useState<"amazon" | "shopify">("amazon");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const [parseFailed, setParseFailed] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim() || !features.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    setLoading(true);
    setResult(null);
    setStreamingText("");
    setParseFailed(false);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, features, platform }),
        signal: controller.signal,
      });

      if (res.status === 403) {
        const err = await res.json().catch(() => ({}));
        if (err.upgrade) {
          setShowUpgrade(true);
        } else {
          toast.error(err.error || "No credits remaining");
        }
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Generation failed");
        setLoading(false);
        return;
      }

      // Handle streaming response
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        accumulated += text;
        setStreamingText(accumulated);
      }

      // Check for error markers from server
      if (accumulated.includes("__PARSE_FAILED__")) {
        const cleanText = accumulated.replace("__PARSE_FAILED__", "").trim();
        setStreamingText(cleanText);
        setParseFailed(true);
        setLoading(false);
        return;
      }

      // Clean the done marker
      const cleanAccumulated = accumulated.replace("__DONE__", "").trim();

      // Try to parse JSON from accumulated text
      const jsonMatch = cleanAccumulated.match(
        /\{[\s\S]*"title"[\s\S]*"bullet_points"[\s\S]*"description"[\s\S]*"keywords"[\s\S]*\}/
      );

      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]) as GenerationResult;
          setResult(parsed);
          setStreamingText("");
          toast.success("Listing generated!");
        } catch {
          setParseFailed(true);
        }
      } else {
        setParseFailed(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        toast.info("Cancelled");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  // Scroll to result when streaming
  useEffect(() => {
    if (streamingText && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [streamingText]);

  return (
    <div className="space-y-8">
      <UpgradeModal show={showUpgrade} onClose={() => setShowUpgrade(false)} />

      <div>
        <h1 className="text-2xl font-bold">New Listing</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Enter your product information in Chinese, get professional English
          listings.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium">Platform</label>
          <div className="mt-1 flex gap-2">
            {(["amazon", "shopify"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors ${
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
          <label className="block text-sm font-medium">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. 无线蓝牙耳机 5.3 降噪"
            className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Features & Selling Points <span className="text-red-500">*</span>
          </label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="List the key features in Chinese or English, e.g. 蓝牙5.3芯片, 40小时续航, IPX7防水, 触控操作..."
            rows={4}
            className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none"
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[var(--primary)] px-6 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Listing"}
          </button>
          {loading && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-[var(--border)] px-6 py-2 text-sm font-medium hover:bg-[var(--secondary)] transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Loading Skeleton */}
      {loading && !streamingText && (
        <div
          ref={resultRef}
          className="space-y-6 rounded-xl border border-[var(--border)] p-8"
        >
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="text-sm font-medium text-[var(--muted-foreground)]">
              AI is creating your listing...
            </span>
          </div>
          <div className="space-y-6">
            <div>
              <div className="mb-2 h-3 w-24 rounded bg-[var(--secondary)]" />
              <SkeletonBlock lines={2} />
            </div>
            <div>
              <div className="mb-2 h-3 w-28 rounded bg-[var(--secondary)]" />
              <SkeletonBlock lines={4} />
            </div>
            <div>
              <div className="mb-2 h-3 w-32 rounded bg-[var(--secondary)]" />
              <SkeletonBlock lines={3} />
            </div>
          </div>
        </div>
      )}

      {/* Generating indicator (no raw JSON shown) */}
      {streamingText && !result && !parseFailed && (
        <div ref={resultRef} className="rounded-xl border border-[var(--border)] p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm text-[var(--muted-foreground)]">
              Generating your listing...
            </span>
          </div>
        </div>
      )}

      {/* Parse Failed - show retry */}
      {parseFailed && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h2 className="mb-2 text-sm font-semibold text-red-500">
            Generation Issue
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            The AI returned an unexpected format. You can try again.
          </p>
          {streamingText && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                View raw output
              </summary>
              <pre className="mt-2 whitespace-pre-wrap rounded bg-[var(--secondary)] p-3 text-xs">
                {streamingText}
              </pre>
            </details>
          )}
          <button
            onClick={handleSubmit}
            className="mt-4 rounded-lg bg-[var(--primary)] px-6 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6 stagger-children">
          {/* Title */}
          <div className="rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
                Product Title
              </h2>
              <CopyButton text={result.title} label="Title" />
            </div>
            <p className="text-lg font-medium">{result.title}</p>
          </div>

          {/* Bullet Points */}
          <div className="rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
                Bullet Points
              </h2>
              <CopyButton text={result.bullet_points.join("\n")} label="Bullet points" />
            </div>
            <ul className="space-y-2">
              {result.bullet_points.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--foreground)]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
                Product Description
              </h2>
              <CopyButton text={result.description} label="Description" />
            </div>
            <div
              className="text-sm leading-relaxed prose"
              dangerouslySetInnerHTML={{ __html: result.description }}
            />
          </div>

          {/* Keywords */}
          <div className="rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
                Search Keywords
              </h2>
              <CopyButton text={result.keywords.join(", ")} label="Keywords" />
            </div>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((kw, i) => (
                <span key={i} className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Generate Another */}
          <button
            onClick={() => {
              setResult(null);
              setStreamingText("");
              setParseFailed(false);
            }}
            className="w-full rounded-lg border border-[var(--border)] py-3 text-sm font-medium hover:bg-[var(--secondary)] transition-colors"
          >
            Generate Another Listing
          </button>
        </div>
      )}
    </div>
  );
}
