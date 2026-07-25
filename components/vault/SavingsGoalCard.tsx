"use client";

import React, { useState } from "react";
import { useVaultStore } from "@/store/vaultStore";
import { formatCurrency } from "@/lib/utils";
import { Target, Sliders, CheckCircle2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function SavingsGoalCard() {
  const { savingsRule, updateSavingsRule } = useVaultStore();

  const [enabled, setEnabled] = useState(savingsRule.enabled);
  const [percent, setPercent] = useState<number>(savingsRule.autoInvestBps / 100);
  const [goalName, setGoalName] = useState<string>(savingsRule.goalName);
  const [target, setTarget] = useState<string>(savingsRule.targetAmountUSD.toString());

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSavingsRule({
        enabled,
        autoInvestBps: percent * 100,
        goalName,
        targetAmountUSD: parseFloat(target) || 1000,
      });
      toast.success("Auto-savings rule updated in SavingsGoal contract!");
    } catch {
      toast.error("Failed to update savings rule");
    }
  };

  const progressPercent = Math.min(100, (savingsRule.currentSavedUSD / savingsRule.targetAmountUSD) * 100);

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Auto-Savings Rule Engine</h3>
            <p className="text-xs text-zinc-400">Programmable Soroban contract rule for inbound remittances</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            enabled
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
              : "bg-zinc-800 border-zinc-700 text-zinc-400"
          }`}
        >
          {enabled ? "Rule Active" : "Rule Paused"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-300 font-medium">Goal Progress ({savingsRule.goalName})</span>
          <span className="text-cyan-400 font-mono font-bold">
            {formatCurrency(savingsRule.currentSavedUSD)} / {formatCurrency(savingsRule.targetAmountUSD)} ({progressPercent.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full h-3 bg-secondary/80 rounded-full overflow-hidden border border-white/10 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">Goal Name</label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="w-full bg-secondary/80 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">Target Goal Amount ($)</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-secondary/80 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-zinc-300">Auto-Invest Percentage per Remittance</label>
            <span className="text-cyan-400 font-bold font-mono text-sm">{percent}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={percent}
            onChange={(e) => setPercent(parseInt(e.target.value))}
            className="w-full accent-cyan-400 bg-secondary rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>5% (Conservative)</span>
            <span>20% (Recommended)</span>
            <span>50% (Aggressive)</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-secondary hover:bg-white/10 border border-white/10 text-white font-medium text-sm py-2.5 rounded-xl transition-colors"
        >
          Update Savings Rule
        </button>
      </form>
    </div>
  );
}
