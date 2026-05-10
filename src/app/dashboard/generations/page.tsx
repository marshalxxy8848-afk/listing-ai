"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GenerationRecord } from "@/lib/types";
export default function HistoryPage() {
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  useEffect(() => { loadHistory(); }, []);
  const loadHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("generations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
    if (data) setGenerations(data as GenerationRecord[]);
    setLoading(false);
  };
  const toggleFavorite = async (id: string, current: boolean) => { await supabase.from("generations").update({ is_favorite: !current }).eq("id", id); loadHistory(); };
  const handleDelete = async (id: string) => { await supabase.from("generations").delete().eq("id", id); loadHistory(); };
  if (loading) return <div className="text-sm text-[var(--muted-foreground)]">Loading...</div>;
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">History</h1><p className="mt-1 text-sm text-[var(--muted-foreground)]">Your past generations</p></div>
      {generations.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] p-12 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">No generations yet. <Link href="/dashboard/new" className="font-medium text-[var(--foreground)] hover:underline">Create your first one</Link></p>
        </div>
      ) : (
        <div className="space-y-3">{generations.map((gen) => (
          <div key={gen.id} className="rounded-xl border border-[var(--border)] p-4">
            <div className="flex items-start justify-between gap-4">
              <Link href={`/dashboard/generations/${gen.id}`} className="flex-1 min-w-0">
                <h3 className="truncate text-sm font-medium">{gen.product_name}</h3>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{new Date(gen.created_at).toLocaleDateString("zh-CN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})} · {gen.target_platform}</p>
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleFavorite(gen.id, gen.is_favorite)} className={`text-sm ${gen.is_favorite ? "text-yellow-500" : "text-[var(--muted-foreground)]"} hover:text-yellow-500 transition-colors`}>{gen.is_favorite ? "★" : "☆"}</button>
                <button onClick={() => handleDelete(gen.id)} className="text-xs text-[var(--muted-foreground)] hover:text-red-500 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  );
}
