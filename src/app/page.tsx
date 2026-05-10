import Link from "next/link";
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-xl font-bold tracking-tight">ListingAI</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Log in</Link>
            <Link href="/register" className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity">Get Started</Link>
          </div>
        </div>
      </header>
      <section className="flex-1">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-16 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Turn Chinese Product Info Into <span className="block mt-2 text-[var(--muted-foreground)]">Professional English Listings</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted-foreground)]">AI-powered listing generator for Amazon and Shopify sellers. Enter your product details in Chinese, get optimized English titles, bullet points, and descriptions in seconds.</p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register" className="rounded-lg bg-[var(--primary)] px-8 py-3 text-base font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity">Start Free</Link>
            <Link href="#how-it-works" className="rounded-lg border border-[var(--border)] px-8 py-3 text-base font-medium hover:bg-[var(--secondary)] transition-colors">How It Works</Link>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[{ step: "01", title: "Enter Product Details", desc: "Type your product name and key features in Chinese. No English needed." },
              { step: "02", title: "AI Generates Listing", desc: "Our AI creates Amazon/Shopify-optimized title, bullet points, and description." },
              { step: "03", title: "Copy & Use", desc: "Review, edit, and copy your listing. Ready to publish in one click." }].map((item) => (
              <div key={item.step} className="rounded-xl border border-[var(--border)] p-6">
                <span className="text-sm font-semibold text-[var(--muted-foreground)]">{item.step}</span>
                <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-[var(--muted-foreground)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-[var(--border)] py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-[var(--muted-foreground)]">&copy; {new Date().getFullYear()} ListingAI. All rights reserved.</div>
      </footer>
    </div>
  );
}
