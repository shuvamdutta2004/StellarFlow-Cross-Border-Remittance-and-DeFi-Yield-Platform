import { describe, it, expect } from "vitest";
import { useVaultStore } from "@/store/vaultStore";

describe("Vault Store Tests", () => {
  it("should initialize with default yield APY and balances", () => {
    const state = useVaultStore.getState();
    expect(state.apyPercent).toBe(8.4);
    expect(state.depositedBalanceUSD).toBeGreaterThan(0);
  });

  it("should deposit to vault and increase balance", async () => {
    const initial = useVaultStore.getState().depositedBalanceUSD;
    await useVaultStore.getState().depositToVault(100);
    const updated = useVaultStore.getState().depositedBalanceUSD;
    expect(updated).toBe(initial + 100);
  });

  it("should withdraw from vault and decrease balance", async () => {
    const initial = useVaultStore.getState().depositedBalanceUSD;
    await useVaultStore.getState().withdrawFromVault(50);
    const updated = useVaultStore.getState().depositedBalanceUSD;
    expect(updated).toBe(initial - 50);
  });
});
