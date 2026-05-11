import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-lg sm:text-xl font-bold tracking-tight">ListingAI</span>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[var(--primary)] px-3.5 sm:px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center">
        <div className="mx-auto max-w-6xl px-6 pt-16 sm:pt-24 pb-16 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Turn Chinese Product Info Into
            <span className="block mt-1 sm:mt-2 text-[var(--muted-foreground)]">
              Professional English Listings
            </span>
          </h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-lg text-[var(--muted-foreground)]">
            AI-powered listing generator for Amazon and Shopify sellers. Enter your
            product details in Chinese, get optimized English titles, bullet points,
            and descriptions in seconds.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-lg bg-[var(--primary)] px-8 py-3 text-sm sm:text-base font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity text-center"
            >
              Start Free — 10 Credits
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto rounded-lg border border-[var(--border)] px-8 py-3 text-sm sm:text-base font-medium hover:bg-[var(--secondary)] transition-colors text-center"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-[var(--border)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl sm:text-3xl font-bold">
            How It Works
          </h2>
          <div className="mt-10 sm:mt-12 grid gap-6 sm:gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Enter Product Details",
                desc: "Type your product name and key features in Chinese. No English needed.",
              },
              {
                step: "02",
                title: "AI Generates Listing",
                desc: "Our AI creates Amazon/Shopify-optimized title, bullet points, and description.",
              },
              {
                step: "03",
                title: "Copy & Publish",
                desc: "Review and copy your listing with one click. Ready to publish on Amazon or Shopify.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-[var(--border)] p-6 hover:bg-[var(--secondary)]/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-xs font-bold text-[var(--primary-foreground)]">
                    {item.step}
                  </span>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="border-t border-[var(--border)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Start for Free</h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--muted-foreground)]">
            Get 10 free generations when you sign up. No credit card required.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-[var(--primary)] px-8 py-3 text-sm sm:text-base font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-[var(--muted-foreground)]">
          &copy; {new Date().getFullYear()} ListingAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
