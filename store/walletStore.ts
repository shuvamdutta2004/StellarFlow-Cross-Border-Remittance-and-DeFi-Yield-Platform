import { create } from "zustand";

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  walletName: string | null;
  xlmBalance: string;
  usdcBalance: string;
  isConnecting: boolean;
  connectWallet: (walletName?: string) => Promise<void>;
  disconnectWallet: () => void;
  setBalances: (xlm: string, usdc: string) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  isConnected: false,
  walletName: null,
  xlmBalance: "0.00",
  usdcBalance: "0.00",
  isConnecting: false,

  connectWallet: async (walletName = "Freighter") => {
    set({ isConnecting: true });
    try {
      // Simulate/Trigger Freighter connection
      await new Promise((resolve) => setTimeout(resolve, 500));
      const demoAddress = "GDSFFHT4YTWUFV4GI7KROZPPLN5LEEJPUR24HTO4BDJPGZVPV3PPKIOG";
      set({
        address: demoAddress,
        isConnected: true,
        walletName,
        xlmBalance: "145.50",
        usdcBalance: "1250.00",
        isConnecting: false,
      });
    } catch (error) {
      console.error("Wallet connect error:", error);
      set({ isConnecting: false });
    }
  },

  disconnectWallet: () => {
    set({
      address: null,
      isConnected: false,
      walletName: null,
      xlmBalance: "0.00",
      usdcBalance: "0.00",
      isConnecting: false,
    });
  },

  setBalances: (xlm, usdc) => set({ xlmBalance: xlm, usdcBalance: usdc }),
}));
