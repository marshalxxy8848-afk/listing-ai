import Link from "next/link";
const plans = [
  { name: "Free", price: "$0", credits: "10 generations", features: ["Amazon & Shopify listings", "English title, bullets, description", "Basic support"], popular: false },
  { name: "Pro", price: "$9", credits: "100 generations/month", features: ["Everything in Free", "Priority generation speed", "Keyword suggestions", "Email support"], popular: true },
  { name: "Unlimited", price: "$29", credits: "Unlimited", features: ["Everything in Pro", "Priority support", "Team sharing (coming soon)", "API access"], popular: false },
];
export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)]"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"><Link href="/" className="text-xl font-bold tracking-tight">ListingAI</Link><Link href="/login" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Log in</Link></div></header>
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <div className="text-center"><h1 className="text-4xl font-bold">Simple Pricing</h1><p className="mt-3 text-lg text-[var(--muted-foreground)]">Start for free, upgrade when you need more.</p></div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">{plans.map((plan) => (
          <div key={plan.name} className={`relative rounded-xl border p-8 ${plan.popular ? "border-[var(--primary)] shadow-lg" : "border-[var(--border)]"}`}>
            {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-4 py-1 text-xs font-medium text-[var(--primary-foreground)]">Most Popular</span>}
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="mt-4"><span className="text-4xl font-bold">{plan.price}</span>{plan.name !== "Unlimited" && <span className="ml-1 text-sm text-[var(--muted-foreground)]">/month</span>}</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{plan.credits}</p>
            <ul className="mt-6 space-y-3">{plan.features.map((f) => (<li key={f} className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span>{f}</li>))}</ul>
            <Link href="/register" className={`mt-8 block w-full rounded-lg py-2.5 text-center text-sm font-medium ${plan.popular ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "border border-[var(--border)] hover:bg-[var(--secondary)]"} transition-colors`}>{plan.name === "Free" ? "Start Free" : "Coming Soon"}</Link>
          </div>
        ))}</div>
      </div>
    </div>
  );
}
