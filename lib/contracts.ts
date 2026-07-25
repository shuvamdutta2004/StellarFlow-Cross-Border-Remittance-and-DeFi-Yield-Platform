export const REMITTANCE_ROUTER_CONTRACT_ID =
  process.env.NEXT_PUBLIC_REMITTANCE_ROUTER_CONTRACT_ID ||
  "CCCOM4GDC6VFLEPG2AN7NSSUMVYXUDEWSNL5DNFZZOCNBWN3XU3AURYC";

export const YIELD_VAULT_CONTRACT_ID =
  process.env.NEXT_PUBLIC_YIELD_VAULT_CONTRACT_ID ||
  "CBMFYE434L3XK4XSTFDXRPABU3KOFRFOKABEUOGTCGTPGLASYB2GF4LA";

export const SAVINGS_GOAL_CONTRACT_ID =
  process.env.NEXT_PUBLIC_SAVINGS_GOAL_CONTRACT_ID ||
  "CAGIFCUOWD3W4QMWMK2ZLZNYJOLF6HHNQ4K2UGFQGB7MXUSLOWDVWVS2";

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
