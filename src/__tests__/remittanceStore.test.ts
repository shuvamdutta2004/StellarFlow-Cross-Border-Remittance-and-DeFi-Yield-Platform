import { describe, it, expect } from "vitest";
import { useRemittanceStore } from "@/store/remittanceStore";

describe("Remittance Store Tests", () => {
  it("should have pre-seeded initial remittances", () => {
    const state = useRemittanceStore.getState();
    expect(state.remittances.length).toBeGreaterThan(0);
  });

  it("should add a new remittance", async () => {
    const store = useRemittanceStore.getState();
    const initialCount = store.remittances.length;

    const created = await store.addRemittance({
      sender: "GDSFFHT4YTWUFV4GI7KROZPPLN5LEEJPUR24HTO4BDJPGZVPV3PPKIOG",
      recipient: "GBUX3IHQTAIRN3BXVBWZMKFW2CF6FE4QKQWYEDHYGQXL6OQ3YFMN5R3N",
      amountUSD: 300,
      sourceCurrency: "USDC",
      destCurrency: "INR",
      payoutAmount: 25035,
      memo: "Test Transfer",
      txHash: "0x123abc",
    });

    const updatedState = useRemittanceStore.getState();
    expect(updatedState.remittances.length).toBe(initialCount + 1);
    expect(created.status).toBe("Pending");
  });

  it("should claim remittance", async () => {
    const store = useRemittanceStore.getState();
    await store.claimRemittance("rem_1");
    const updated = useRemittanceStore.getState().remittances.find((r) => r.id === "rem_1");
    expect(updated?.status).toBe("Claimed");
  });
});
