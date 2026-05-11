import Link from "next/link";

const features = [
  {
    title: "Chinese Input, English Output",
    desc: "Type your product details in Chinese. Our AI generates professional English listings optimized for Amazon and Shopify.",
  },
  {
    title: "Amazon & Shopify Ready",
    desc: "Each listing is tailored to the platform's style — keyword-rich for Amazon, conversion-focused for Shopify.",
  },
  {
    title: "Streaming Generation",
    desc: "See your listing being written in real-time. No waiting — results appear as the AI creates them.",
  },
  {
    title: "One-Click Copy",
    desc: "Copy title, bullet points, description, or keywords individually. Ready to paste into your seller dashboard.",
  },
  {
    title: "Generation History",
    desc: "All your past listings are saved. Browse, search, and reuse them anytime.",
  },
  {
    title: "10 Free Credits",
    desc: "Start with 10 free generations. No credit card required. Upgrade when you need more.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="border-b sticky top-0 bg-[var(--background)]/80 backdrop-blur-md z-50">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="text-lg font-bold tracking-tight">ListingAI</span>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Pricing</Link>
            <Link href="/login" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Log in</Link>
            <Link href="/register" className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-[var(--secondary)] px-4 py-1.5 text-xs font-medium mb-8">AI-Powered · Cross-Border E-Commerce</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Chinese Product Info to
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--foreground)] to-[var(--muted-foreground)]">
              Professional English Listings
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-[var(--muted-foreground)]">
            Enter your product details in Chinese. Get optimized Amazon and Shopify listings — titles, bullet points, descriptions, and keywords — in seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto rounded-lg bg-[var(--primary)] px-8 py-3 font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity text-center">
              Start Free — 10 Credits
            </Link>
            <Link href="#features" className="w-full sm:w-auto rounded-lg border px-8 py-3 font-medium hover:bg-[var(--secondary)] transition-colors text-center">
              See Features
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto border-t pt-8">
            <div className="text-center"><div className="text-2xl font-bold">10</div><div className="text-xs text-[var(--muted-foreground)] mt-1">Free Credits</div></div>
            <div className="text-center"><div className="text-2xl font-bold">2</div><div className="text-xs text-[var(--muted-foreground)] mt-1">Platforms</div></div>
            <div className="text-center"><div className="text-2xl font-bold">~5s</div><div className="text-xs text-[var(--muted-foreground)] mt-1">Generation</div></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">Everything You Need</h2>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">Designed for cross-border sellers who want to list faster.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border p-5 card-hover">
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t py-16 sm:py-24 bg-[var(--secondary)]/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">How It Works</h2>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">Three simple steps to go from Chinese product info to a professional English listing.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { n: "01", title: "Enter Product Info", desc: "Type your product name and key features in Chinese. No English needed on your end." },
              { n: "02", title: "AI Generates", desc: "Our AI creates an Amazon or Shopify optimized listing with title, bullets, description, and keywords." },
              { n: "03", title: "Copy & Sell", desc: "Review the result, copy what you need with one click, and publish to your store." },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border bg-[var(--background)] p-6 card-hover text-center">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)]">{s.n}</span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to List Faster?</h2>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">Join sellers who use ListingAI to create professional product listings in seconds.</p>
          <Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-8 py-3 font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity">
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]">
          <span className="font-medium text-[var(--foreground)]">ListingAI</span>
          <span>&copy; {new Date().getFullYear()} ListingAI. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
