"use client";

import React from "react";
import SendRemittanceForm from "@/components/remittance/SendRemittanceForm";
import { Send, ShieldCheck, Zap } from "lucide-react";

export default function SendPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Send International Remittance</h1>
        <p className="text-sm text-zinc-400">
          Sub-5s finality cross-border payment escrow backed by Soroban RemittanceRouter smart contract.
        </p>
      </div>

      <SendRemittanceForm />
    </div>
  );
}
