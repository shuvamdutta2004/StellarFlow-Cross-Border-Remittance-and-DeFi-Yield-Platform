import { describe, it, expect, beforeEach } from "vitest";
import { useWalletStore } from "@/store/walletStore";

describe("Wallet Store Tests", () => {
  beforeEach(() => {
    useWalletStore.getState().disconnectWallet();
  });

  it("should initialize disconnected", () => {
    const state = useWalletStore.getState();
    expect(state.isConnected).toBe(false);
    expect(state.address).toBeNull();
  });

  it("should connect wallet and set address & balances", async () => {
    await useWalletStore.getState().connectWallet("Freighter");
    const state = useWalletStore.getState();
    expect(state.isConnected).toBe(true);
    expect(state.address).toBe("GDSFFHT4YTWUFV4GI7KROZPPLN5LEEJPUR24HTO4BDJPGZVPV3PPKIOG");
    expect(state.xlmBalance).toBe("145.50");
  });

  it("should disconnect properly", async () => {
    await useWalletStore.getState().connectWallet("Freighter");
    useWalletStore.getState().disconnectWallet();
    const state = useWalletStore.getState();
    expect(state.isConnected).toBe(false);
    expect(state.address).toBeNull();
  });
});
