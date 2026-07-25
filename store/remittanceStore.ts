import { create } from "zustand";
import { ContractRemittance } from "@/lib/contracts";

export interface RemittanceState {
  remittances: ContractRemittance[];
  isLoading: boolean;
  addRemittance: (remittance: Omit<ContractRemittance, "id" | "createdAt" | "status">) => Promise<ContractRemittance>;
  claimRemittance: (id: string) => Promise<void>;
  cancelRemittance: (id: string) => Promise<void>;
}

export const INITIAL_REMITTANCES: ContractRemittance[] = [
  {
    id: "rem_1",
    sender: "GDSFFHT4YTWUFV4GI7KROZPPLN5LEEJPUR24HTO4BDJPGZVPV3PPKIOG",
    recipient: "GBUX3IHQTAIRN3BXVBWZMKFW2CF6FE4QKQWYEDHYGQXL6OQ3YFMN5R3N",
    amountUSD: 250.0,
    sourceCurrency: "USDC",
    destCurrency: "INR",
    payoutAmount: 20862.5,
    memo: "Family Monthly Allowance",
    status: "Pending",
    createdAt: "2026-07-25 14:10:00",
    txHash: "8a1f3c5b7e9d2a4f6c8b0e2a4f6c8b0e2a4f6c8b0e2a4f6c8b0e2a4f6c8b0e2a",
  },
  {
    id: "rem_2",
    sender: "GBUX3IHQTAIRN3BXVBWZMKFW2CF6FE4QKQWYEDHYGQXL6OQ3YFMN5R3N",
    recipient: "GDSFFHT4YTWUFV4GI7KROZPPLN5LEEJPUR24HTO4BDJPGZVPV3PPKIOG",
    amountUSD: 500.0,
    sourceCurrency: "USDC",
    destCurrency: "NGN",
    payoutAmount: 742750.0,
    memo: "Education Tuition Fee",
    status: "Claimed",
    createdAt: "2026-07-24 16:30:00",
    txHash: "1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
  },
];

export const useRemittanceStore = create<RemittanceState>((set, get) => ({
  remittances: INITIAL_REMITTANCES,
  isLoading: false,

  addRemittance: async (data) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newRemittance: ContractRemittance = {
      ...data,
      id: `rem_${Date.now()}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      status: "Pending",
    };

    set({
      remittances: [newRemittance, ...get().remittances],
      isLoading: false,
    });

    return newRemittance;
  },

  claimRemittance: async (id) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 600));

    set({
      remittances: get().remittances.map((r) =>
        r.id === id ? { ...r, status: "Claimed" } : r
      ),
      isLoading: false,
    });
  },

  cancelRemittance: async (id) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 600));

    set({
      remittances: get().remittances.map((r) =>
        r.id === id ? { ...r, status: "Cancelled" } : r
      ),
      isLoading: false,
    });
  },
}));
