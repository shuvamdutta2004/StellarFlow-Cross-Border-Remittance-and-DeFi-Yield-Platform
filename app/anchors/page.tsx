"use client";

import React from "react";
import { SUPPORTED_ANCHORS } from "@/lib/sep24";
import AnchorCard from "@/components/anchors/AnchorCard";
import { Landmark, ShieldCheck, Zap } from "lucide-react";

export default function AnchorsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Stellar SEP-24 / SEP-31 Anchor Hub</h1>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
          Bridge cash and bank accounts with Stellar digital assets (USDC, EURC, NGN, KES). Standardized SEP-24 interactive deposit & withdrawal protocol.
        </p>
      </div>

      {/* Anchor Protocol Specs Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="text-xs text-zinc-400">Standardized Handoff</div>
          <div className="text-base font-bold text-white font-mono">SEP-24 Interactive</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-zinc-400">Direct Bank Remittance</div>
          <div className="text-base font-bold text-cyan-300 font-mono">SEP-31 Cross-Border</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-zinc-400">KYC Handoff</div>
          <div className="text-base font-bold text-emerald-400 font-mono">Anchor Handled</div>
        </div>
      </div>

      {/* Anchor List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUPPORTED_ANCHORS.map((anchor) => (
          <AnchorCard key={anchor.domain} anchor={anchor} />
        ))}
      </div>
    </div>
  );
}
