"use client";

import React from "react";
import VaultDepositCard from "@/components/vault/VaultDepositCard";
import SavingsGoalCard from "@/components/vault/SavingsGoalCard";
import { PiggyBank, Sparkles } from "lucide-react";

export default function VaultPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Soroban Yield Vault & Auto-Savings Engine</h1>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
          SEP-41 Soroban token vault integrated with Blend lending markets. Earn 8.4% APY compounding yield on received remittances with programmable auto-invest rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VaultDepositCard />
        <SavingsGoalCard />
      </div>
    </div>
  );
}
