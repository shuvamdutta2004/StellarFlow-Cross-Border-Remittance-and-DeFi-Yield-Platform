"use client";

import React, { useState } from "react";
import { useWalletStore } from "@/store/walletStore";
import { useRemittanceStore } from "@/store/remittanceStore";
import { formatCurrency, calculateFee, calculateExchange, calculateCompetitorSavings } from "@/lib/utils";
import { Send, ArrowRight, DollarSign, RefreshCw, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SendRemittanceForm() {
  const { isConnected, connectWallet, address } = useWalletStore();
  const { addRemittance, isLoading } = useRemittanceStore();

  const [amount, setAmount] = useState<string>("250");
  const [recipient, setRecipient] = useState<string>("GBUX3IHQTAIRN3BXVBWZMKFW2CF6FE4QKQWYEDHYGQXL6OQ3YFMN5R3N");
  const [destCurrency, setDestCurrency] = useState<string>("INR");
  const [memo, setMemo] = useState<string>("Monthly Support Transfer");
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const numAmount = parseFloat(amount) || 0;
  const { fee, net } = calculateFee(numAmount, 30); // 0.3% protocol fee
  const { rate, convertedAmount } = calculateExchange(net, "USDC", destCurrency);
  const savings = calculateCompetitorSavings(numAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      toast.error("Please connect your Freighter wallet first");
      connectWallet("Freighter");
      return;
    }
    if (numAmount <= 0) {
      toast.error("Please enter a valid transfer amount");
      return;
    }
    if (!recipient || recipient.length < 20) {
      toast.error("Please enter a valid recipient Stellar wallet address");
      return;
    }

    try {
      const created = await addRemittance({
        sender: address,
        recipient,
        amountUSD: numAmount,
        sourceCurrency: "USDC",
        destCurrency,
        payoutAmount: convertedAmount,
        memo,
        txHash: `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      });

      setTxHash(created.txHash);
      setIsSuccess(true);
      toast.success(`Remittance dispatched! ${formatCurrency(convertedAmount, destCurrency)} sent via Soroban`);
    } catch {
      toast.error("Failed to execute remittance transaction");
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Send Remittance</h2>
            <p className="text-xs text-zinc-400">Path Payment Escrow via Soroban RemittanceRouter</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          <Zap className="w-3.5 h-3.5" />
          Sub-5s Finality
        </div>
      </div>

      {isSuccess && txHash ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white">Remittance Successfully Dispatched!</h3>
          <p className="text-sm text-zinc-300 max-w-md mx-auto">
            {formatCurrency(numAmount, "USDC")} converted to{" "}
            <span className="font-bold text-emerald-400">{formatCurrency(convertedAmount, destCurrency)}</span> and locked in Soroban Escrow.
          </p>
          <div className="p-3 bg-secondary/80 rounded-xl text-xs font-mono text-zinc-400 max-w-lg mx-auto truncate border border-white/10">
            Tx Hash: {txHash}
          </div>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setIsSuccess(false);
                setAmount("250");
              }}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Send Another Remittance
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Transfer Amount & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-medium text-zinc-300">You Send (USDC / Fiat Equivalent)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-secondary/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-primary/60 transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Destination Currency</label>
              <select
                value={destCurrency}
                onChange={(e) => setDestCurrency(e.target.value)}
                className="w-full bg-secondary/80 border border-white/10 rounded-xl px-3 py-3 text-white font-medium text-sm focus:outline-none focus:border-primary/60 transition-colors"
              >
                <option value="INR">🇮🇳 INR (India)</option>
                <option value="NGN">🇳🇬 NGN (Nigeria)</option>
                <option value="PHP">🇵🇭 PHP (Philippines)</option>
                <option value="EURC">🇪🇺 EURC (Europe)</option>
              </select>
            </div>
          </div>

          {/* Recipient Wallet Address */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">Recipient Stellar Wallet Address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-secondary/80 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary/60 transition-colors"
              placeholder="G..."
              required
            />
          </div>

          {/* Transfer Memo */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">Payment Memo / Note</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full bg-secondary/80 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/60 transition-colors"
              placeholder="e.g., Monthly allowance"
            />
          </div>

          {/* Conversion & Fee Summary Breakdown Card */}
          <div className="p-4 bg-secondary/60 rounded-xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Stellar Path Payment FX Rate:
              </span>
              <span className="font-mono text-white font-medium">
                1 USDC = {rate} {destCurrency}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>StellarFlow Protocol Fee (0.3%):</span>
              <span className="font-mono text-emerald-400 font-medium">${fee.toFixed(2)} USDC</span>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-200">Recipient Receives:</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                {formatCurrency(convertedAmount, destCurrency)}
              </span>
            </div>
          </div>

          {/* Traditional Remittance Savings Callout */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 to-blue-950/40 rounded-xl border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Vs Western Union Fee (~$15.75):</span>
            </div>
            <span className="font-bold text-emerald-400 font-mono">
              You Save ${savings.savings.toFixed(2)} USD!
            </span>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base py-3.5 rounded-xl shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >

            {isLoading ? (
              <>Processing Soroban Escrow...</>
            ) : (
              <>
                Confirm & Dispatch Remittance
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
