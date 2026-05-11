"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { GenerationRecord } from "@/lib/types";
import { toast } from "sonner";

function DetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="mb-4 h-3 w-24 rounded bg-[var(--secondary)]" />
        <div className="h-6 w-3/4 rounded bg-[var(--secondary)]" />
        <div className="mt-2 h-3 w-1/3 rounded bg-[var(--secondary)]" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl border border-[var(--border)] p-6 space-y-3">
          <div className="h-3 w-24 rounded bg-[var(--secondary)]" />
          <div className="h-4 w-full rounded bg-[var(--secondary)]" />
          <div className="h-4 w-2/3 rounded bg-[var(--secondary)]" />
        </div>
      ))}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied`);
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

export default function GenerationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [gen, setGen] = useState<GenerationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadGeneration();
  }, [id]);

  const loadGeneration = async () => {
    const { data } = await supabase
      .from("generations")
      .select("*")
      .eq("id", id)
      .single();
    if (data) setGen(data as GenerationRecord);
    else router.push("/dashboard/generations");
    setLoading(false);
  };

  if (loading) return <DetailLoading />;
  if (!gen) return null;

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => router.push("/dashboard/generations")}
          className="mb-4 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          ← Back to history
        </button>
        <h1 className="text-xl font-bold">{gen.product_name}</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {new Date(gen.created_at).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          · {gen.target_platform}
        </p>
      </div>

      {/* Title */}
      <div className="rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
            Product Title
          </h2>
          <CopyButton text={gen.title_en!} label="Title" />
        </div>
        <p className="text-lg font-medium">{gen.title_en}</p>
      </div>

      {/* Bullet Points */}
      <div className="rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
            Bullet Points
          </h2>
          <CopyButton
            text={(gen.bullet_points as string[]).join("\n")}
            label="Bullet points"
          />
        </div>
        <ul className="space-y-2">
          {(gen.bullet_points as string[]).map((point, i) => (
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
          <CopyButton text={gen.description_en!} label="Description" />
        </div>
        <div
          className="text-sm leading-relaxed prose-headings:font-semibold prose-p:my-2 prose-strong:font-semibold"
          dangerouslySetInnerHTML={{ __html: gen.description_en! }}
        />
      </div>

      {/* Keywords */}
      <div className="rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
            Search Keywords
          </h2>
          <CopyButton
            text={(gen.keywords as string[]).join(", ")}
            label="Keywords"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(gen.keywords as string[]).map((kw, i) => (
            <span
              key={i}
              className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Original Input */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-6">
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
          Original Input
        </h2>
        <p className="text-sm">
          <span className="font-medium">Product:</span> {gen.product_name}
        </p>
        <p className="mt-1 text-sm">
          <span className="font-medium">Features:</span> {gen.features}
        </p>
      </div>
    </div>
  );
}
