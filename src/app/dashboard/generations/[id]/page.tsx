"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { GenerationRecord } from "@/lib/types";
import { toast } from "sonner";
export default function GenerationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [gen, setGen] = useState<GenerationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  useEffect(() => { loadGeneration(); }, [id]);
  const loadGeneration = async () => {
    const { data } = await supabase.from("generations").select("*").eq("id", id).single();
    if (data) setGen(data as GenerationRecord); else router.push("/dashboard/history");
    setLoading(false);
  };
  const copyToClipboard = async (text: string, label: string) => { await navigator.clipboard.writeText(text); toast.success(`${label} copied`); };
  if (loading) return <div className="text-sm text-[var(--muted-foreground)]">Loading...</div>;
  if (!gen) return null;
  return (
    <div className="space-y-6">
      <div><button onClick={() => router.push("/dashboard/generations")} className="mb-4 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">← Back to history</button>
        <h1 className="text-xl font-bold">{gen.product_name}</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{new Date(gen.created_at).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"})} · {gen.target_platform}</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold text-[var(--muted-foreground)]">Product Title</h2><button onClick={() => copyToClipboard(gen.title_en!, "Title")} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Copy</button></div>
        <p className="text-lg font-medium">{gen.title_en}</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold text-[var(--muted-foreground)]">Bullet Points</h2><button onClick={() => copyToClipboard((gen.bullet_points as string[]).join("\n"), "Bullet points")} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Copy All</button></div>
        <ul className="space-y-2">{(gen.bullet_points as string[]).map((point, i) => (<li key={i} className="flex gap-2 text-sm"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--foreground)]" />{point}</li>))}</ul>
      </div>
      <div className="rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold text-[var(--muted-foreground)]">Product Description</h2><button onClick={() => copyToClipboard(gen.description_en!, "Description")} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Copy</button></div>
        <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: gen.description_en! }} />
      </div>
      <div className="rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold text-[var(--muted-foreground)]">Search Keywords</h2><button onClick={() => copyToClipboard((gen.keywords as string[]).join(", "), "Keywords")} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Copy</button></div>
        <div className="flex flex-wrap gap-2">{(gen.keywords as string[]).map((kw, i) => (<span key={i} className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs">{kw}</span>))}</div>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-6">
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">Original Input</h2>
        <p className="text-sm"><span className="font-medium">Product:</span> {gen.product_name}</p>
        <p className="mt-1 text-sm"><span className="font-medium">Features:</span> {gen.features}</p>
      </div>
    </div>
  );
}
