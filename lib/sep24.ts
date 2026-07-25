export interface AnchorInfo {
  name: string;
  domain: string;
  currencies: string[];
  depositFeeBps: number;
  withdrawFeeBps: number;
  icon: string;
  sep24Supported: boolean;
}

export const SUPPORTED_ANCHORS: AnchorInfo[] = [
  {
    name: "MoneyGram Access",
    domain: "moneygram.stellar.org",
    currencies: ["USDC"],
    depositFeeBps: 0,
    withdrawFeeBps: 0,
    icon: "💵",
    sep24Supported: true,
  },
  {
    name: "Fonbnk Global Ramp",
    domain: "fonbnk.com",
    currencies: ["USDC", "NGN", "KES"],
    depositFeeBps: 15,
    withdrawFeeBps: 15,
    icon: "🌍",
    sep24Supported: true,
  },
  {
    name: "EuroAnchor (SEP-24)",
    domain: "euroanchor.io",
    currencies: ["EURC", "USDC"],
    depositFeeBps: 10,
    withdrawFeeBps: 10,
    icon: "💶",
    sep24Supported: true,
  },
];

export interface SEP24DepositRequest {
  asset_code: string;
  account: string;
  amount: string;
  anchor: string;
  kycDetails?: {
    fullName: string;
    email: string;
    idNumber: string;
  };
}

export interface SEP24SessionResponse {
  id: string;
  type: "interactive_customer_info_needed" | "pending_user_transfer_start" | "completed";
  url: string;
  status: string;
  eta?: number;
}

export async function initiateSEP24Deposit(req: SEP24DepositRequest): Promise<SEP24SessionResponse> {
  // Simulates SEP-24 Interactive Deposit flow endpoint response
  await new Promise((resolve) => setTimeout(resolve, 800));

  const sessionId = `sep24_dep_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return {
    id: sessionId,
    type: "interactive_customer_info_needed",
    url: `https://${req.anchor}/sep24/interactive?session=${sessionId}`,
    status: "pending_user_transfer_start",
    eta: 300,
  };
}

export async function initiateSEP24Withdraw(req: SEP24DepositRequest): Promise<SEP24SessionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const sessionId = `sep24_wdr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return {
    id: sessionId,
    type: "interactive_customer_info_needed",
    url: `https://${req.anchor}/sep24/withdraw?session=${sessionId}`,
    status: "pending_anchor_processing",
    eta: 120,
  };
}
