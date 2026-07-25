"use client";

import React from "react";
import { ContractRemittance } from "@/lib/contracts";
import { formatCurrency } from "@/lib/utils";
import AddressDisplay from "@/components/wallet/AddressDisplay";
import { useRemittanceStore } from "@/store/remittanceStore";
import { useVaultStore } from "@/store/vaultStore";
import { Clock, CheckCircle2, XCircle, ArrowUpRight, PiggyBank } from "lucide-react";
import { toast } from "sonner";

interface RemittanceCardProps {
  remittance: ContractRemittance;
}

export default function RemittanceCard({ remittance }: RemittanceCardProps) {
  const { claimRemittance, cancelRemittance, isLoading } = useRemittanceStore();
  const { depositToVault } = useVaultStore();

  const handleClaim = async () => {
    try {
      await claimRemittance(remittance.id);
      toast.success("Remittance claimed and released to wallet!");
    } catch {
      toast.error("Failed to claim remittance");
    }
  };

  const handleClaimAndInvest = async () => {
    try {
      await claimRemittance(remittance.id);
      await depositToVault(remittance.amountUSD);
      toast.success(`Claimed & auto-deposited ${formatCurrency(remittance.amountUSD)} into Soroban Yield Vault!`);
    } catch {
      toast.error("Failed to process yield deposit");
    }
  };

  const handleCancel = async () => {
    try {
      await cancelRemittance(remittance.id);
      toast.info("Remittance cancelled and funds refunded to sender.");
    } catch {
      toast.error("Failed to cancel remittance");
    }
  };

  const statusBadges = {
    Pending: {
      bg: "bg-amber-950/60 border-amber-500/40 text-amber-300",
      icon: Clock,
      label: "Pending Claim",
    },
    Claimed: {
      bg: "bg-emerald-950/60 border-emerald-500/40 text-emerald-300",
      icon: CheckCircle2,
      label: "Claimed & Settled",
    },
    Cancelled: {
      bg: "bg-red-950/60 border-red-500/40 text-red-300",
      icon: XCircle,
      label: "Cancelled & Refunded",
    },
  };

  const BadgeInfo = statusBadges[remittance.status];
  const StatusIcon = BadgeInfo.icon;

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 hover:border-blue-500/30 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">ID: #{remittance.id}</span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border font-medium ${BadgeInfo.bg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {BadgeInfo.label}
          </span>
        </div>
        <span className="text-xs text-zinc-400">{remittance.createdAt}</span>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="text-2xl font-bold text-white font-mono">
            {formatCurrency(remittance.payoutAmount, remittance.destCurrency)}
          </div>
          <div className="text-xs text-zinc-400">
            Original: {formatCurrency(remittance.amountUSD, "USDC")}
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="text-xs text-zinc-400">Recipient</div>
          <AddressDisplay address={remittance.recipient} chars={4} />
        </div>
      </div>

      {remittance.memo && (
        <div className="text-xs text-zinc-300 bg-secondary/60 p-2.5 rounded-lg border border-white/5 italic">
          &quot;{remittance.memo}&quot;
        </div>
      )}

      {/* Action Buttons for Pending Status */}
      {remittance.status === "Pending" && (
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <button
            onClick={handleClaim}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs py-2 px-3 rounded-xl transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Claim to Wallet
          </button>

          <button
            onClick={handleClaimAndInvest}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs py-2 px-3 rounded-xl shadow-md"
          >
            <PiggyBank className="w-4 h-4 text-purple-200" />
            Claim & Deposit (8.4% APY)
          </button>

          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-3 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/40 text-xs font-medium"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
