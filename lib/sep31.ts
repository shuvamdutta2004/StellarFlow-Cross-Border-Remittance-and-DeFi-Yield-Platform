export interface SEP31TransferRequest {
  senderAddress: string;
  receiverAddress: string;
  sourceAmount: number;
  sourceCurrency: string;
  destCurrency: string;
  receiverBankDetails: {
    accountName: string;
    accountNumber: string;
    bankCode: string;
  };
}

export interface SEP31TransferResult {
  transactionId: string;
  status: "pending" | "completed" | "processing";
  estimatedCompletion: string;
  exchangeRate: number;
  payoutAmount: number;
  anchorReference: string;
}

export async function processSEP31Remittance(
  request: SEP31TransferRequest
): Promise<SEP31TransferResult> {
  await new Promise((res) => setTimeout(res, 1200));

  const rates: Record<string, number> = {
    INR: 83.45,
    NGN: 1485.5,
    PHP: 58.2,
    EURC: 0.92,
  };

  const rate = rates[request.destCurrency] || 1.0;
  const payoutAmount = request.sourceAmount * rate;
  const txId = `sep31_${Math.random().toString(36).substring(2, 9)}`;

  return {
    transactionId: txId,
    status: "completed",
    estimatedCompletion: "Immediate (< 5 seconds)",
    exchangeRate: rate,
    payoutAmount,
    anchorReference: `MGRAM-REF-${Math.floor(100000 + Math.random() * 900000)}`,
  };
}
