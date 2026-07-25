"use client";

import React, { useState } from "react";
import { formatAddress } from "@/lib/utils";
import { Check, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface AddressDisplayProps {
  address: string;
  chars?: number;
  showCopy?: boolean;
  showExplorer?: boolean;
  className?: string;
}

export default function AddressDisplay({
  address,
  chars = 4,
  showCopy = true,
  showExplorer = true,
  className = "",
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy address");
    }
  };

  const explorerUrl = `https://stellar.expert/explorer/testnet/account/${address}`;

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono text-sm ${className}`}>
      <span title={address} className="text-zinc-200">
        {formatAddress(address, chars)}
      </span>

      {showCopy && (
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-white/10 rounded transition-colors text-zinc-400 hover:text-white"
          title="Copy address"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}

      {showExplorer && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 hover:bg-white/10 rounded transition-colors text-zinc-400 hover:text-white"
          title="View on Stellar Expert"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}
