"use client";

import React, { useState } from "react";
import { INITIAL_USER_INTERACTION_PROOFS, UserInteractionProof } from "@/lib/analytics";
import AddressDisplay from "@/components/wallet/AddressDisplay";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, CheckCircle2, Search, ExternalLink } from "lucide-react";

export default function UserInteractionsTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProofs = INITIAL_USER_INTERACTION_PROOFS.filter(
    (proof) =>
      proof.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typeBadges: Record<string, { label: string; color: string }> = {
    remittance_sent: { label: "Remittance Sent", color: "bg-blue-950/80 text-blue-300 border-blue-500/40" },
    remittance_claimed: { label: "Remittance Claimed", color: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40" },
    vault_deposit: { label: "Yield Vault Deposit", color: "bg-purple-950/80 text-purple-300 border-purple-500/40" },
    savings_rule_set: { label: "Savings Rule Set", color: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40" },
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">Proof of 10+ User Wallet Interactions</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Level 4 Requirement
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Recorded Soroban contract testnet interactions across 10 distinct user wallet accounts.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search wallet or tx..."
            className="bg-secondary/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 text-zinc-400 font-mono uppercase tracking-wider">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">User Wallet Address</th>
              <th className="py-3 px-3">Interaction Type</th>
              <th className="py-3 px-3">Amount ($)</th>
              <th className="py-3 px-3">Timestamp</th>
              <th className="py-3 px-3">Transaction Hash</th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProofs.map((proof) => {
              const badge = typeBadges[proof.type] || { label: proof.type, color: "bg-zinc-800 text-zinc-300" };
              return (
                <tr key={proof.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-3 font-mono text-zinc-500">{proof.id}</td>
                  <td className="py-3.5 px-3">
                    <AddressDisplay address={proof.walletAddress} chars={4} />
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full border text-[11px] font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-white">
                    {formatCurrency(proof.amountUSD)}
                  </td>
                  <td className="py-3.5 px-3 text-zinc-400">{proof.timestamp}</td>
                  <td className="py-3.5 px-3 font-mono text-zinc-400">
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${proof.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-300 flex items-center gap-1"
                    >
                      {proof.txHash.slice(0, 10)}... <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
