"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    price: "$0",
    credits: "10 generations",
    features: ["Amazon & Shopify listings", "English title, bullets, description", "Basic support"],
    popular: false,
    href: "/register",
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$9",
    credits: "100 generations/month",
    features: ["Everything in Free", "Priority generation speed", "Keyword suggestions", "Email support"],
    popular: true,
    href: null,
    cta: "Get Notified",
  },
  {
    name: "Unlimited",
    price: "$29",
    credits: "Unlimited",
    features: ["Everything in Pro", "Priority support", "Team sharing (coming soon)", "API access"],
    popular: false,
    href: null,
    cta: "Get Notified",
  },
];

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [sending, setSending] = useState(false);

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Please enter a valid email"); return; }
    setSending(true);
    // In the future, this will call an API. For now, just show success.
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Thanks! We'll notify you when Pro is available.");
    setEmail("");
    setShowWaitlist(false);
    setSending(false);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b sticky top-0 bg-[var(--background)]/80 backdrop-blur-md z-50">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold tracking-tight">ListingAI</Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Log in</Link>
            <Link href="/register" className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90">Get Started</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-16 sm:pt-20 pb-16">
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold">Simple Pricing</h1>
          <p className="mt-3 text-[var(--muted-foreground)]">Start for free. Upgrade when you need more generations.</p>
        </div>

        <div className="mt-10 sm:mt-12 grid gap-6 md:grid-cols-3 max-w-4xl mx-auto stagger-children">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-xl border p-6 sm:p-8 card-hover ${plan.popular ? "border-[var(--primary)] shadow-md" : ""}`}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-4 py-1 text-xs font-medium text-[var(--primary-foreground)]">
                  Most Popular
                </span>
              )}
              <h2 className="text-lg font-bold">{plan.name}</h2>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.name !== "Unlimited" && <span className="ml-1 text-sm text-[var(--muted-foreground)]">/month</span>}
              </div>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{plan.credits}</p>
              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-green-500 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.href ? (
                <Link href={plan.href} className={`mt-6 block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-colors ${plan.popular ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90" : "border border-[var(--border)] hover:bg-[var(--secondary)]"}`}>
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => setShowWaitlist(true)}
                  className="mt-6 block w-full rounded-lg py-2.5 text-center text-sm border border-dashed border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                >
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            All plans include 10 free credits on signup.{" "}
            <Link href="/register" className="font-medium text-[var(--foreground)] hover:underline">Get started now</Link>
          </p>
        </div>
      </div>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-xl border bg-[var(--background)] p-8 shadow-2xl">
            <h2 className="text-lg font-bold">Coming Soon</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Pro and Unlimited plans are not available yet. Leave your email and we&apos;ll notify you when they launch.
            </p>
            <form onSubmit={handleNotify} className="mt-6 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="block w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Notify Me"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowWaitlist(false)}
                  className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--secondary)] transition-colors"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
