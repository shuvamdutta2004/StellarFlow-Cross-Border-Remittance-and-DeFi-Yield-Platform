import { create } from "zustand";

export interface SavingsRuleState {
  enabled: boolean;
  autoInvestBps: number; // e.g. 2000 = 20%
  goalName: string;
  targetAmountUSD: number;
  currentSavedUSD: number;
}

export interface VaultStoreState {
  depositedBalanceUSD: number;
  totalYieldEarnedUSD: number;
  apyPercent: number;
  savingsRule: SavingsRuleState;
  depositToVault: (amountUSD: number) => Promise<void>;
  withdrawFromVault: (amountUSD: number) => Promise<void>;
  updateSavingsRule: (rule: Partial<SavingsRuleState>) => Promise<void>;
}

export const useVaultStore = create<VaultStoreState>((set, get) => ({
  depositedBalanceUSD: 350.0,
  totalYieldEarnedUSD: 14.85,
  apyPercent: 8.4,
  savingsRule: {
    enabled: true,
    autoInvestBps: 2000,
    goalName: "Family Emergency Reserve",
    targetAmountUSD: 1000.0,
    currentSavedUSD: 350.0,
  },

  depositToVault: async (amountUSD) => {
    await new Promise((res) => setTimeout(res, 800));
    set({
      depositedBalanceUSD: get().depositedBalanceUSD + amountUSD,
      savingsRule: {
        ...get().savingsRule,
        currentSavedUSD: get().savingsRule.currentSavedUSD + amountUSD,
      },
    });
  },

  withdrawFromVault: async (amountUSD) => {
    await new Promise((res) => setTimeout(res, 800));
    set({
      depositedBalanceUSD: Math.max(0, get().depositedBalanceUSD - amountUSD),
    });
  },

  updateSavingsRule: async (ruleUpdate) => {
    await new Promise((res) => setTimeout(res, 500));
    set({
      savingsRule: {
        ...get().savingsRule,
        ...ruleUpdate,
      },
    });
  },
}));
