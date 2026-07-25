import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "StellarFlow | Cross-Border Remittances & DeFi Yield Platform",
  description:
    "Production-ready, decentralized cross-border remittance and Soroban yield platform built on Stellar testnet. Sub-5s finality, path payments, SEP-24/31 anchors, and 8.4% APY Yield Vaults.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}
