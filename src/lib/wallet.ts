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

export interface ImportedToken extends TokenInfo {
  contractAddress: string;
  isImported: true;
}

export type TokenType = TokenInfo | ImportedToken;

export const TOKENS: TokenInfo[] = [
  // Ethereum tokens
  { symbol: "ETH", name: "Ethereum", address: "0x0000000000000000000000000000000000000000", decimals: 18, chain: "ethereum", logo: "🔷" },
  { symbol: "WETH", name: "Wrapped ETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18, chain: "ethereum", logo: "🔷" },
  { symbol: "USDT", name: "Tether USD", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6, chain: "ethereum", logo: "🟢" },
  { symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6, chain: "ethereum", logo: "🔵" },
  { symbol: "DAI", name: "Dai Stablecoin", address: "0x6B175474E89094C44Da98b954EddFd691dD3CA8", decimals: 18, chain: "ethereum", logo: "🟡" },
  { symbol: "UNI", name: "Uniswap", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC42C9Fdf4", decimals: 18, chain: "ethereum", logo: "🦄" },
  { symbol: "LINK", name: "Chainlink", address: "0x514910771AF9Ca656E2d21a0324e08F56dF5d58", decimals: 18, chain: "ethereum", logo: "🔗" },

  // BSC tokens
  { symbol: "BNB", name: "BNB", address: "0x0000000000000000000000000000000000000000", decimals: 18, chain: "bsc", logo: "🟡" },
  { symbol: "WBNB", name: "Wrapped BNB", address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", decimals: 18, chain: "bsc", logo: "🟡" },
  { symbol: "BUSD", name: "Binance USD", address: "0xe9e7CEA3Ded9d395326CfAQFe8d79967B6e8C2222", decimals: 18, chain: "bsc", logo: "💛" },
  { symbol: "USDT", name: "Tether USD", address: "0x55d398326f99059fF775485246999027B31903a9", decimals: 6, chain: "bsc", logo: "🟢" },
  { symbol: "CAKE", name: "PancakeSwap", address: "0x0E09FaBB73Bd3Ade0a178495B3409B5E1aE37085", decimals: 18, chain: "bsc", logo: "🍰" },

  // Polygon tokens
  { symbol: "MATIC", name: "Polygon", address: "0x0000000000000000000000000000000000000000", decimals: 18, chain: "polygon", logo: "🟣" },
  { symbol: "WMATIC", name: "Wrapped MATIC", address: "0x0d500B1d8E8eF21E2E8e63F58668d6FeC45dD690", decimals: 18, chain: "polygon", logo: "🟣" },
  { symbol: "USDC", name: "USD Coin", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6, chain: "polygon", logo: "🔵" },
  { symbol: "WETH", name: "Wrapped ETH", address: "0x7ceB25E1c3dcFC7Bd018b6F4A913843D71850d5C", decimals: 18, chain: "polygon", logo: "🔷" },
  { symbol: "QUICK", name: "QuickSwap", address: "0xB38C5c62E9405f8368e82F22816745A735F2FaaB", decimals: 18, chain: "polygon", logo: "⚡" },

  // Arbitrum tokens
  { symbol: "ETH", name: "Ethereum", address: "0x0000000000000000000000000000000000000000", decimals: 18, chain: "arbitrum", logo: "🔷" },
  { symbol: "USDC", name: "USD Coin", address: "0xFF970A61A04b1cA147D5a74F755D7593E0e55B2B", decimals: 6, chain: "arbitrum", logo: "🔵" },
  { symbol: "USDT", name: "Tether USD", address: "0xFd086bC7CD5C4dC507D0F2e5C6F25129132bCdC4", decimals: 6, chain: "arbitrum", logo: "🟢" },
  { symbol: "ARB", name: "Arbitrum", address: "0x912CE556Be5a67e72d09C8C8C659Dd8e657Ca70d", decimals: 18, chain: "arbitrum", logo: "🔵" },
  { symbol: "UNI", name: "Uniswap", address: "0xFa7F8981014a7eF4d76689976eA2e3292992b9A0", decimals: 18, chain: "arbitrum", logo: "🦄" },

  // Optimism tokens
  { symbol: "ETH", name: "Ethereum", address: "0x0000000000000000000000000000000000000000", decimals: 18, chain: "optimism", logo: "🔷" },
  { symbol: "USDC", name: "USD Coin", address: "0x7F5c53b4c94497eB2a2864D5411F2212b7d8a1F9", decimals: 6, chain: "optimism", logo: "🔵" },
  { symbol: "USDT", name: "Tether USD", address: "0x94b008aA00509eEB06D8e5F1Ac2F17C6aD6D2193", decimals: 6, chain: "optimism", logo: "🟢" },
  { symbol: "OP", name: "Optimism", address: "0x4200000000000000000000000000000000000042", decimals: 18, chain: "optimism", logo: "🔴" },
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

export function importToken(
  symbol: string,
  name: string,
  contractAddress: string,
  decimals: number,
  chain: string,
  logo?: string
): ImportedToken {
  if (!ethers.isAddress(contractAddress)) {
    throw new Error("Invalid contract address");
  }
  if (!SUPPORTED_CHAINS.some((c) => c.id === chain)) {
    throw new Error("Unsupported chain");
  }
  return {
    symbol,
    name,
    address: contractAddress,
    decimals,
    chain,
    logo,
    contractAddress,
    isImported: true,
  };
}