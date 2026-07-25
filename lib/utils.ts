import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string | null | undefined, chars: number = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 1)}...${address.slice(-chars)}`;
}

export function formatCurrency(
  amount: number | string,
  currency: string = "USD",
  decimals: number = 2
): string {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return `$0.00`;

  const symbols: Record<string, string> = {
    USD: "$",
    USDC: "$",
    XLM: "XLM ",
    INR: "₹",
    NGN: "₦",
    PHP: "₱",
    EURC: "€",
    EUR: "€",
  };

  const symbol = symbols[currency] || `${currency} `;
  const formatted = numericAmount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${symbol}${formatted}`;
}

export function calculateFee(amount: number, feeBps: number = 30): { fee: number; net: number } {
  const fee = (amount * feeBps) / 10000;
  const net = amount - fee;
  return { fee, net };
}

export function calculateExchange(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): { rate: number; convertedAmount: number } {
  const rates: Record<string, number> = {
    USDC_INR: 83.45,
    USDC_NGN: 1485.5,
    USDC_PHP: 58.2,
    USDC_EURC: 0.92,
    USDC_XLM: 9.12,
    XLM_USDC: 0.109,
    XLM_INR: 9.12,
    XLM_NGN: 162.5,
    XLM_PHP: 6.38,
  };

  const pairKey = `${fromCurrency}_${toCurrency}`;
  const inversePairKey = `${toCurrency}_${fromCurrency}`;

  let rate = rates[pairKey];
  if (!rate && rates[inversePairKey]) {
    rate = 1 / rates[inversePairKey];
  }
  if (!rate) {
    rate = 1.0;
  }

  const convertedAmount = amount * rate;
  return { rate, convertedAmount };
}

export function calculateCompetitorSavings(amountUSD: number): {
  stellarFee: number;
  westernUnionFee: number;
  swiftFee: number;
  savings: number;
} {
  const stellarFee = Math.max(0.0001, amountUSD * 0.003); // 0.3% protocol fee
  const westernUnionFee = Math.max(4.99, amountUSD * 0.063); // 6.3% avg global fee
  const swiftFee = Math.max(15.0, amountUSD * 0.05); // SWIFT fees + FX markup
  const savings = westernUnionFee - stellarFee;

  return {
    stellarFee,
    westernUnionFee,
    swiftFee,
    savings,
  };
}
