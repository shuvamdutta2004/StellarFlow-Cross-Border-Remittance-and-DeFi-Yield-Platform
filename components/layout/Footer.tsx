"use client";

import React from "react";
import AddressDisplay from "@/components/wallet/AddressDisplay";
import { Sparkles, Shield, Cpu, Github, ExternalLink } from "lucide-react";

export default function Footer() {
  const adminAddress = process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS || "GDSFFHT4YTWUFV4GI7KROZPPLN5LEEJPUR24HTO4BDJPGZVPV3PPKIOG";

  return (
    <footer className="border-t border-white/10 bg-background/90 text-zinc-400 py-8 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white tracking-wide">StellarFlow</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300">
              Level 4 Green Belt
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-md">
            Decentralized Cross-Border Micro-Remittances & Soroban Yield Vaults powered by Stellar testnet.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1.5 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Wallet:</span>
            <AddressDisplay address={adminAddress} chars={4} />
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <a
              href="https://github.com/shuvamdutta2004/StellarFlow-Cross-Border-Remittance-and-DeFi-Yield-Platform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub Repository
            </a>
            <span>•</span>
            <a
              href="https://stellar.expert/explorer/testnet"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Stellar Expert Explorer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
