"use client";

import React, { useState } from "react";
import { AnchorInfo, initiateSEP24Deposit, initiateSEP24Withdraw } from "@/lib/sep24";
import { useWalletStore } from "@/store/walletStore";
import { Landmark, ArrowDownLeft, ArrowUpRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface AnchorCardProps {
  anchor: AnchorInfo;
}

export default function AnchorCard({ anchor }: AnchorCardProps) {
  const { address, isConnected } = useWalletStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState<string>("100");
  const [selectedCurrency, setSelectedCurrency] = useState<string>(anchor.currencies[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    try {
      if (mode === "deposit") {
        const res = await initiateSEP24Deposit({
          account: address,
          amount,
          asset_code: selectedCurrency,
          anchor: anchor.domain,
        });
        setSessionUrl(res.url);
        toast.success(`SEP-24 Interactive Deposit session launched with ${anchor.name}`);
      } else {
        const res = await initiateSEP24Withdraw({
          account: address,
          amount,
          asset_code: selectedCurrency,
          anchor: anchor.domain,
        });
        setSessionUrl(res.url);
        toast.success(`SEP-24 Interactive Withdraw session launched with ${anchor.name}`);
      }
    } catch {
      toast.error("Failed to establish anchor session");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary/80 flex items-center justify-center text-2xl border border-white/10">
            {anchor.icon}
          </div>
          <div>
            <h3 className="font-bold text-white text-base">{anchor.name}</h3>
            <p className="text-xs text-zinc-400 font-mono">{anchor.domain}</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
          SEP-24 / SEP-31
        </span>
      </div>

      <div className="space-y-2 pt-2 text-xs text-zinc-300">
        <div className="flex justify-between">
          <span className="text-zinc-400">Supported Currencies:</span>
          <span className="font-bold text-white font-mono">{anchor.currencies.join(", ")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Deposit Fee:</span>
          <span className="font-mono text-emerald-400">
            {anchor.depositFeeBps === 0 ? "0% (Free)" : `${anchor.depositFeeBps / 100}%`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={() => {
            setMode("deposit");
            setModalOpen(true);
            setSessionUrl(null);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2.5 rounded-xl transition-colors"
        >
          <ArrowDownLeft className="w-4 h-4" /> Deposit Fiat
        </button>

        <button
          onClick={() => {
            setMode("withdraw");
            setModalOpen(true);
            setSessionUrl(null);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 bg-secondary hover:bg-white/10 text-white font-medium text-xs py-2.5 rounded-xl border border-white/10 transition-colors"
        >
          <ArrowUpRight className="w-4 h-4" /> Withdraw Fiat
        </button>
      </div>

      {/* Interactive Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-5 border border-white/10 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{anchor.icon}</span>
                <h3 className="font-bold text-white">
                  {anchor.name} ({mode === "deposit" ? "Fiat On-Ramp" : "Fiat Off-Ramp"})
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {sessionUrl ? (
              <div className="space-y-4 py-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white text-lg">Anchor Webview Handoff Ready</h4>
                <p className="text-xs text-zinc-300">
                  SEP-24 Interactive Session created for wallet {address?.slice(0, 6)}...
                </p>
                <div className="p-3 bg-secondary rounded-xl text-xs font-mono text-cyan-300 break-all border border-white/10">
                  {sessionUrl}
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-full bg-primary text-primary-foreground font-bold text-sm py-2.5 rounded-xl"
                >
                  Close & Return to Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleStartSession} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300">Select Currency</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full bg-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm"
                  >
                    {anchor.currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300">Amount ({selectedCurrency})</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono text-sm"
                    required
                  />
                </div>

                <div className="p-3 bg-secondary/60 rounded-xl border border-white/10 text-xs text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Protocol standard:</span>
                    <span className="font-mono text-cyan-300">Stellar SEP-24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>KYC Handoff:</span>
                    <span className="text-emerald-400">Anchor Managed</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm py-3 rounded-xl shadow-lg"
                >
                  {isProcessing ? "Connecting Anchor..." : `Initiate ${mode === "deposit" ? "Deposit" : "Withdrawal"}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
