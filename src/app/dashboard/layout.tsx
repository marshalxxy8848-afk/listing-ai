"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      supabase.from("profiles").select("credits").eq("id", user.id).single().then(({ data }) => { if (data) setCredits(data.credits); });
    });
  }, []);
  const handleSignOut = async () => { await supabase.auth.signOut(); router.push("/"); router.refresh(); };
  const navItems = [
    { href: "/dashboard", label: "New Generation" },
    { href: "/dashboard/generations", label: "History" },
    { href: "/dashboard/projects", label: "Projects" },
  ];
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r border-[var(--border)]">
        <div className="flex h-16 items-center border-b border-[var(--border)] px-6">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">ListingAI</Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === item.href ? "bg-[var(--secondary)] text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-[var(--border)] p-4">
          <div className="mb-3 flex items-center justify-between rounded-lg bg-[var(--secondary)] px-3 py-2">
            <span className="text-xs text-[var(--muted-foreground)]">Credits</span>
            <span className="text-sm font-semibold">{credits ?? "..."}</span>
          </div>
          <button onClick={handleSignOut} className="w-full rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors text-left">Sign out</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><div className="mx-auto max-w-4xl px-8 py-8">{children}</div></main>
    </div>
  );
}
