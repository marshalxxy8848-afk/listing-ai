import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ListingAI — AI-Powered Product Listings for Amazon & Shopify",
    template: "%s | ListingAI",
  },
  description:
    "Generate professional Amazon & Shopify product listings with AI. Enter Chinese product info, get optimized English titles, bullet points, and descriptions in seconds.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "ListingAI — AI-Powered Product Listings",
    description:
      "Turn Chinese product info into professional English listings for Amazon & Shopify.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
