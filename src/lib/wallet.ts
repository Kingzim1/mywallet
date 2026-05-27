import { ethers } from "ethers";
import * as bip39 from "bip39";
import CryptoJS from "crypto-js";

export interface WalletInfo {
  address: string;
  privateKey: string;
  seedPhrase: string;
  recoverySeed: string;
  chain: string;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  chain: string;
  logo?: string;
}

export const SUPPORTED_CHAINS = [
  { id: "ethereum", name: "Ethereum", rpc: "https://eth.llamarpc.com" },
  { id: "bsc", name: "BSC", rpc: "https://bsc-dataseed.binance.org" },
  { id: "polygon", name: "Polygon", rpc: "https://polygon-rpc.com" },
  { id: "arbitrum", name: "Arbitrum", rpc: "https://arb1.arbitrum.io/rpc" },
  { id: "optimism", name: "Optimism", rpc: "https://mainnet.optimism.io" },
];

export const TOKENS: TokenInfo[] = [
  { symbol: "ETH", name: "Ethereum", address: "0x0000000000000000000000000000000000000000", decimals: 18, chain: "ethereum", logo: "🔷" },
  { symbol: "BNB", name: "BNB", address: "0x0000000000000000000000000000000000000000", decimals: 18, chain: "bsc", logo: "🟡" },
  { symbol: "MATIC", name: "Polygon", address: "0x0000000000000000000000000000000000000000", decimals: 18, chain: "polygon", logo: "🟣" },
  { symbol: "BTC", name: "Bitcoin", address: "", decimals: 8, chain: "bitcoin", logo: "₿" },
  { symbol: "USDT", name: "Tether", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6, chain: "ethereum", logo: "🟢" },
  { symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6, chain: "ethereum", logo: "🔵" },
  { symbol: "DAI", name: "Dai", address: "0x6B175474E89094C44Da98b954EesddFD691dD3CA8", decimals: 18, chain: "ethereum", logo: "🟡" },
  { symbol: "SOL", name: "Solana", address: "", decimals: 9, chain: "solana", logo: "◎" },
];

export function generateSeedPhrase(): string {
  return bip39.generateMnemonic(128);
}

export function generateWallet(seedPhrase: string, chain: string = "ethereum"): WalletInfo {
  const wallet = ethers.Wallet.fromPhrase(seedPhrase);
  const recoverySeed = CryptoJS.SHA256(seedPhrase).toString(CryptoJS.enc.Hex).slice(0, 32);
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    seedPhrase,
    recoverySeed,
    chain,
  };
}

export function encryptWallet(wallet: WalletInfo, password: string): string {
  return CryptoJS.AES.encrypt(
    JSON.stringify(wallet),
    password
  ).toString();
}

export function decryptWallet(encryptedData: string, password: string): WalletInfo | null {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, password).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

export function importWalletFromPrivateKey(privateKey: string, chain: string = "ethereum"): WalletInfo {
  const wallet = new ethers.Wallet(privateKey);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    seedPhrase: "",
    recoverySeed: CryptoJS.SHA256(privateKey).toString(CryptoJS.enc.Hex).slice(0, 32),
    chain,
  };
}

export function importWalletFromSeedPhrase(seedPhrase: string, chain: string = "ethereum"): WalletInfo {
  if (!bip39.validateMnemonic(seedPhrase)) {
    throw new Error("Invalid seed phrase");
  }
  return generateWallet(seedPhrase, chain);
}