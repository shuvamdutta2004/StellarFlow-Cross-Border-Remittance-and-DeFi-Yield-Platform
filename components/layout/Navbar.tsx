"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWalletStore } from "@/store/walletStore";
import AddressDisplay from "@/components/wallet/AddressDisplay";
import {
  Send,
  Download,
  Landmark,
  PiggyBank,
  BarChart3,
  Wallet,
  Menu,
  X,
  Sparkles,
  Layers,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet } = useWalletStore();

  const navLinks = [
    { href: "/send", label: "Send Money", icon: Send },
    { href: "/receive", label: "Receive & Claim", icon: Download },
    { href: "/anchors", label: "Anchor On-Ramp", icon: Landmark },
    { href: "/vault", label: "Yield Vault", icon: PiggyBank },
    { href: "/analytics", label: "Analytics & Proof", icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background/90">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold gradient-text tracking-tight">StellarFlow</span>
            <span className="text-[10px] font-medium text-zinc-400 -mt-1 flex items-center gap-1">
              Soroban Remittance <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-zinc-400"}`} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Action & Wallet */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Testnet
          </div>

          {isConnected && address ? (
            <div className="flex items-center gap-2 bg-secondary/60 border border-white/10 px-3 py-1.5 rounded-xl">
              <AddressDisplay address={address} chars={4} />
              <button
                onClick={disconnectWallet}
                className="text-xs text-red-400 hover:text-red-300 ml-1 font-medium hover:underline"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => connectWallet("Freighter")}
              disabled={isConnecting}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {isConnected && address && (
            <div className="text-xs font-mono bg-secondary px-2 py-1 rounded border border-white/10">
              <AddressDisplay address={address} chars={3} showCopy={false} showExplorer={false} />
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-secondary/80 border border-white/10 text-zinc-300 hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-red-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-background/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Stellar Testnet Active
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-zinc-400"}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10">
            {isConnected && address ? (
              <button
                onClick={() => {
                  disconnectWallet();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-950/40 border border-red-500/30 text-red-300 font-medium text-sm py-2.5 rounded-xl"
              >
                Disconnect ({address.slice(0, 4)}...{address.slice(-4)})
              </button>
            ) : (
              <button
                onClick={() => {
                  connectWallet("Freighter");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm py-2.5 rounded-xl shadow-lg shadow-blue-500/25"
              >
                <Wallet className="w-4 h-4" />
                Connect Freighter Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
