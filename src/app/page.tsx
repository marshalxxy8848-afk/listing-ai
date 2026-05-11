import Link from "next/link";

const features = [
  {
    title: "Chinese Input, English Output",
    desc: "Type your product details in Chinese. Our AI generates professional English listings optimized for Amazon, Shopify, Temu, and TikTok Shop.",
  },
  {
    title: "6 Platforms Supported",
    desc: "Amazon, Shopify, eBay, AliExpress, Temu, and TikTok Shop. Each listing is tailored to the platform's unique style and requirements.",
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
          <div className="mt-12 grid grid-cols-4 gap-6 max-w-xl mx-auto border-t pt-8">
            <div className="text-center"><div className="text-2xl font-bold">10</div><div className="text-xs text-[var(--muted-foreground)] mt-1">Free Credits</div></div>
            <div className="text-center"><div className="text-2xl font-bold">6</div><div className="text-xs text-[var(--muted-foreground)] mt-1">Platforms</div></div>
            <div className="text-center"><div className="text-2xl font-bold">~5s</div><div className="text-xs text-[var(--muted-foreground)] mt-1">Generation</div></div>
            <div className="text-center"><div className="text-2xl font-bold">1</div><div className="text-xs text-[var(--muted-foreground)] mt-1">Click Copy</div></div>
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

      {/* Use Cases */}
      <section className="border-t py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">Who Is It For</h2>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">Built for cross-border sellers who struggle with listing translations.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto text-center">
            {[
              { emoji: "🇨🇳", title: "Chinese Sellers", desc: "Have Chinese product info but need English Amazon listings? Our AI handles the translation and optimization for you." },
              { emoji: "🌏", title: "Cross-Border Teams", desc: "Managing products from Chinese factories? Generate consistent English listings across your entire catalog." },
              { emoji: "📱", title: "Temu & TikTok Sellers", desc: "Selling on Temu or TikTok Shop? Get mobile-optimized, trend-aware listings that convert in the fast-paced social commerce world." },
            ].map((u) => (
              <div key={u.title} className="rounded-xl border p-6 card-hover">
                <div className="text-3xl mb-3">{u.emoji}</div>
                <h3 className="font-semibold text-sm">{u.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ListingAI */}
      <section className="border-t py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">Why ListingAI</h2>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">Built for Chinese sellers who need English listings — fast.</p>
          </div>
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[var(--secondary)]">
                  <th className="p-4 text-left font-medium"></th>
                  <th className="p-4 text-center font-medium text-[var(--primary)]">ListingAI</th>
                  <th className="p-4 text-center font-medium text-[var(--muted-foreground)]">Doing It Manually</th>
                  <th className="p-4 text-center font-medium text-[var(--muted-foreground)]">Amazon AI Tool</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Chinese Input", us: "✅ Yes", manual: "❌ Must know English", amazon: "❌ English only" },
                  { label: "Platforms", us: "✅ 6 platforms", manual: "❌ One at a time", amazon: "❌ Amazon only" },
                  { label: "Time per Listing", us: "~5 seconds", manual: "30-60 minutes", amazon: "10-15 minutes" },
                  { label: "Shopify / eBay Support", us: "✅ Yes", manual: "✅ Yes", amazon: "❌ No" },
                  { label: "AliExpress / Temu / TikTok", us: "✅ Yes", manual: "✅ Yes", amazon: "❌ No" },
                  { label: "Free to Start", us: "✅ 10 free credits", manual: "✅ Yes", amazon: "✅ Yes" },
                ].map((row, i) => (
                  <tr key={row.label} className={i < 5 ? "border-b" : ""}>
                    <td className="p-4 font-medium">{row.label}</td>
                    <td className="p-4 text-center text-green-600">{row.us}</td>
                    <td className="p-4 text-center text-[var(--muted-foreground)]">{row.manual}</td>
                    <td className="p-4 text-center text-[var(--muted-foreground)]">{row.amazon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t py-16 sm:py-24 bg-[var(--secondary)]/50">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Do I need to speak English to use ListingAI?", a: "No. Enter your product details in Chinese, and our AI generates professional English listings automatically." },
              { q: "Which platforms do you support?", a: "Amazon, Shopify, Temu, and TikTok Shop. Each listing is tailored to the platform's specific format and style." },
              { q: "Is it really free?", a: "Yes, you get 10 free generations when you sign up. No credit card required." },
              { q: "How accurate is the AI-generated listing?", a: "The AI is trained on successful cross-border listing patterns. You can review and edit the output before publishing." },
              { q: "Can I use my own API key?", a: "Not yet, but we're working on it for the Pro and Unlimited plans." },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-xl border bg-[var(--background)]">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium">
                  {faq.q}
                  <svg className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </summary>
                <p className="border-t px-4 py-3 text-sm text-[var(--muted-foreground)] leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">How It Works</h2>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">Three simple steps to go from Chinese product info to a professional English listing.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { n: "01", title: "Paste Product Info", desc: "Type your product name and key features in Chinese. No English needed on your end." },
              { n: "02", title: "AI Generates Listing", desc: "Our AI creates an Amazon or Shopify optimized listing with title, bullets, description, and keywords." },
              { n: "03", title: "Copy & Publish", desc: "Review the result, copy any section with one click, and paste into your seller dashboard." },
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
