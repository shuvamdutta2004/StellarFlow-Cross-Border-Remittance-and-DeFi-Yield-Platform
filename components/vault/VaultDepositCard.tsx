"use client";

import React, { useState } from "react";
import { useVaultStore } from "@/store/vaultStore";
import { formatCurrency } from "@/lib/utils";
import { PiggyBank, ArrowDownRight, ArrowUpRight, TrendingUp, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function VaultDepositCard() {
  const { depositedBalanceUSD, totalYieldEarnedUSD, apyPercent, depositToVault, withdrawFromVault } = useVaultStore();
  const [depositAmount, setDepositAmount] = useState<string>("100");
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numAmount = parseFloat(depositAmount) || 0;
  const estimatedAnnualYield = (depositedBalanceUSD * apyPercent) / 100;

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeTab === "deposit") {
        await depositToVault(numAmount);
        toast.success(`Deposited ${formatCurrency(numAmount)} into Soroban Yield Vault!`);
      } else {
        await withdrawFromVault(numAmount);
        toast.success(`Withdrew ${formatCurrency(numAmount)} from Yield Vault`);
      }
      setDepositAmount("");
    } catch {
      toast.error("Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Soroban Yield Vault (Blend Protocol)</h3>
            <p className="text-xs text-zinc-400">Earn compound lending interest on received funds</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          {apyPercent}% APY
        </div>
      </div>

      {/* Yield Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-secondary/60 border border-white/10 p-4 rounded-xl space-y-1">
          <div className="text-xs text-zinc-400">Deposited Balance</div>
          <div className="text-2xl font-bold text-white font-mono">{formatCurrency(depositedBalanceUSD)}</div>
        </div>

        <div className="bg-secondary/60 border border-white/10 p-4 rounded-xl space-y-1">
          <div className="text-xs text-zinc-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Total Yield Accrued
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">+{formatCurrency(totalYieldEarnedUSD)}</div>
        </div>

        <div className="bg-secondary/60 border border-white/10 p-4 rounded-xl space-y-1">
          <div className="text-xs text-zinc-400">Est. 1-Year Earnings</div>
          <div className="text-2xl font-bold text-purple-300 font-mono">+{formatCurrency(estimatedAnnualYield)}</div>
        </div>
      </div>

      {/* Deposit / Withdraw Tabs */}
      <div className="space-y-4">
        <div className="flex bg-secondary/80 p-1 rounded-xl border border-white/10 max-w-xs">
          <button
            type="button"
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "deposit" ? "bg-primary text-primary-foreground shadow" : "text-zinc-400 hover:text-white"
            }`}
          >
            Deposit Funds
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "withdraw" ? "bg-primary text-primary-foreground shadow" : "text-zinc-400 hover:text-white"
            }`}
          >
            Withdraw Principal
          </button>
        </div>

        <form onSubmit={handleAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Amount ({activeTab === "deposit" ? "USDC to Deposit" : "USDC to Withdraw"})
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full bg-secondary/80 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-purple-500/60"
              placeholder="0.00"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg transition-all"
          >
            {activeTab === "deposit" ? (
              <>
                <ArrowDownRight className="w-4 h-4" /> Deposit to Vault & Start Earning
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" /> Withdraw Funds to Wallet
              </>
            )}
          </button>
        </form>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Soroban SEP-41 Token Vault — Non-custodial lending smart contract</span>
      </div>
    </div>
  );
}
