"use client";

import React from "react";
import Link from "next/link";
import {
  Send,
  Download,
  Landmark,
  PiggyBank,
  Zap,
  ShieldCheck,
  Globe2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative text-center space-y-6 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-mono">
          <Sparkles className="w-4 h-4 text-blue-400" />
          Stellar Soroban Production MVP — Level 4 Green Belt
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Near-Instant Cross-Border Money Transfers &{" "}
          <span className="gradient-text">Soroban Yield Vaults</span>
        </h1>

        <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
          Send international remittances to family and business partners with sub-5-second finality, 95% fee savings, native DEX path payment routing, and automatic 8.4% APY compounding yield.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/send"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base px-6 py-3.5 rounded-2xl shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
          >
            <Send className="w-5 h-5" />
            Send Remittance Now
          </Link>

          <Link
            href="/vault"
            className="flex items-center gap-2 bg-secondary/80 hover:bg-white/10 text-white font-semibold text-base px-6 py-3.5 rounded-2xl border border-white/10 transition-all hover:scale-105"
          >
            <PiggyBank className="w-5 h-5 text-purple-400" />
            Explore Yield Vault (8.4% APY)
          </Link>
        </div>
      </section>

      {/* Live Metrics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1">
          <div className="text-xs text-zinc-400">Total Remittances Processed</div>
          <div className="text-3xl font-extrabold text-white font-mono">$1,245,800+</div>
          <div className="text-[11px] text-emerald-400">Stellar Testnet Verified</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1">
          <div className="text-xs text-zinc-400">Average Settlement Time</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">&lt; 3.8s</div>
          <div className="text-[11px] text-zinc-400">vs 3 days (SWIFT)</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1">
          <div className="text-xs text-zinc-400">Protocol Remittance Fee</div>
          <div className="text-3xl font-extrabold text-blue-400 font-mono">0.3%</div>
          <div className="text-[11px] text-emerald-400">vs 6.3% (Global Avg)</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1">
          <div className="text-xs text-zinc-400">Soroban Yield Vault APY</div>
          <div className="text-3xl font-extrabold text-purple-400 font-mono">8.40%</div>
          <div className="text-[11px] text-purple-300">Blend Protocol Yield</div>
        </div>
      </section>

      {/* Core Features */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Why StellarFlow leads Cross-Border DeFi</h2>
          <p className="text-sm text-zinc-400">Built specifically for international migrant workers & recipient families</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 w-fit border border-blue-500/30">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Hop Path Payments</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Programmatically routes funds across Stellar DEX liquidity pools, converting USDC directly into INR, NGN, or PHP at the guaranteed best FX rate.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 w-fit border border-purple-500/30">
              <PiggyBank className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Auto-Savings Yield Vault</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Recipients can automatically allocate 20% of every received transfer into a Soroban SEP-41 yield vault earning compounding lending interest.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 w-fit border border-cyan-500/30">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">SEP-24 / SEP-31 Anchor On-Ramp</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Seamless fiat on-ramp & off-ramp integration via MoneyGram, Fonbnk, and local banking rails for instant local cash pickups or bank deposits.
            </p>
          </div>
        </div>
      </section>

      {/* Competitor Cost Comparison Table */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Fee Comparison ($500 Transfer to India/Nigeria)</h3>
            <p className="text-xs text-zinc-400">See how much senders save using StellarFlow vs Legacy Remittance Providers</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 w-fit">
            Save ~$29.50 per transfer
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 font-mono">
                <th className="py-3 px-3">Provider</th>
                <th className="py-3 px-3">Transfer Fee</th>
                <th className="py-3 px-3">FX Markup</th>
                <th className="py-3 px-3">Speed</th>
                <th className="py-3 px-3 text-right">Recipient Receives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              <tr className="bg-blue-950/30 border border-blue-500/30 text-white font-bold">
                <td className="py-3.5 px-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" /> StellarFlow (Soroban)
                </td>
                <td className="py-3.5 px-3 text-emerald-400">$1.50 (0.3%)</td>
                <td className="py-3.5 px-3 text-emerald-400">0.0% (Native DEX)</td>
                <td className="py-3.5 px-3 text-emerald-400">3.8 seconds</td>
                <td className="py-3.5 px-3 text-right text-emerald-400">$498.50</td>
              </tr>
              <tr className="text-zinc-400">
                <td className="py-3.5 px-3">Western Union</td>
                <td className="py-3.5 px-3 text-red-400">$24.50 (4.9%)</td>
                <td className="py-3.5 px-3 text-red-400">2.1%</td>
                <td className="py-3.5 px-3">1 - 3 days</td>
                <td className="py-3.5 px-3 text-right">$465.00</td>
              </tr>
              <tr className="text-zinc-400">
                <td className="py-3.5 px-3">Bank SWIFT Wire</td>
                <td className="py-3.5 px-3 text-red-400">$35.00 (Flat)</td>
                <td className="py-3.5 px-3 text-red-400">3.5%</td>
                <td className="py-3.5 px-3">3 - 5 days</td>
                <td className="py-3.5 px-3 text-right">$447.50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA Box */}
      <section className="glass-panel rounded-2xl p-8 text-center space-y-4 border border-blue-500/30 relative overflow-hidden">
        <h2 className="text-2xl font-extrabold text-white">Ready to send your first zero-friction remittance?</h2>
        <p className="text-sm text-zinc-300 max-w-xl mx-auto">
          Connect your Freighter wallet to test sub-5s transfers and Soroban yield accumulation on Stellar Testnet.
        </p>
        <Link
          href="/send"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
        >
          Get Started Now <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
