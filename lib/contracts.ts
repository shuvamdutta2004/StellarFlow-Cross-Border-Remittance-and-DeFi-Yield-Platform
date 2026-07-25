export const REMITTANCE_ROUTER_CONTRACT_ID =
  process.env.NEXT_PUBLIC_REMITTANCE_ROUTER_CONTRACT_ID ||
  "CB73XRZ6K7O3VJH5G7Y6Y5N2L6A8K4M1N9P2Q5R8S1T4U7V0W3X6Y9Z2";

export const YIELD_VAULT_CONTRACT_ID =
  process.env.NEXT_PUBLIC_YIELD_VAULT_CONTRACT_ID ||
  "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

export const SAVINGS_GOAL_CONTRACT_ID =
  process.env.NEXT_PUBLIC_SAVINGS_GOAL_CONTRACT_ID ||
  "CANWI4UO2NHX3PJD6VDSHTXJHNPRBATL5VRBDCNQATUQW2LUWF4YM4JP";

export interface ContractRemittance {
  id: string;
  sender: string;
  recipient: string;
  amountUSD: number;
  sourceCurrency: string;
  destCurrency: string;
  payoutAmount: number;
  memo: string;
  status: "Pending" | "Claimed" | "Cancelled";
  createdAt: string;
  txHash: string;
}

export interface VaultState {
  totalAssetsUSD: number;
  userSharesUSD: number;
  apyPercent: number;
  earnedYieldUSD: number;
}
