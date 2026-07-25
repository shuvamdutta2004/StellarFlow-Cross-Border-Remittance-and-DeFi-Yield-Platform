"use client";

import React from "react";
import { useRemittanceStore } from "@/store/remittanceStore";
import RemittanceCard from "@/components/remittance/RemittanceCard";
import { Download, Inbox, Sparkles } from "lucide-react";

export default function ReceivePage() {
  const { remittances } = useRemittanceStore();

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Receive & Claim Remittances</h1>
          <p className="text-sm text-zinc-400">
            View inbound cross-border payments, claim to wallet, or 1-click deposit to Soroban Yield Vault.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Auto-Compound 8.4% APY Available
        </div>
      </div>

      {remittances.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl space-y-3">
          <Inbox className="w-12 h-12 text-zinc-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Inbound Remittances Found</h3>
          <p className="text-xs text-zinc-400">When someone dispatches a remittance to your Stellar address, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
            <span>Inbound Remittance Escrows ({remittances.length})</span>
            <span>Sorted by Most Recent</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {remittances.map((remittance) => (
              <RemittanceCard key={remittance.id} remittance={remittance} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
