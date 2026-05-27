"use client";

import { useState } from "react";
import { decryptWallet, WalletInfo, TOKENS } from "@/lib/wallet";
import { getTokenPrices, TokenPrice } from "@/lib/price";

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"assets" | "swap" | "send" | "receive">("assets");
  const [prices, setPrices] = useState<Record<string, TokenPrice>>({});
  const [swapAmount, setSwapAmount] = useState("");
  const [receiveAddress, setReceiveAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  const loadPrices = async () => {
    const tokenSymbols = TOKENS.map(t => t.symbol);
    const tokenPrices = await getTokenPrices(tokenSymbols);
    setPrices(tokenPrices);
  };

  const handleUnlock = () => {
    const encrypted = localStorage.getItem("encryptedWallet");
    if (encrypted && password) {
      const decrypted = decryptWallet(encrypted, password);
      if (decrypted) {
        setWallet(decrypted);
        setIsUnlocked(true);
        loadPrices();
      }
    }
  };

  if (!wallet || !isUnlocked) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Unlock Wallet</h1>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-neutral-800 rounded-lg mb-4"
            onKeyPress={(e) => e.key === "Enter" && handleUnlock()}
          />
          <button
            onClick={handleUnlock}
            className="w-full p-3 bg-blue-600 rounded-lg font-semibold"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Multi-Chain Wallet</h1>
          <button
            onClick={() => {
              localStorage.removeItem("encryptedWallet");
              window.location.href = "/";
            }}
            className="text-red-400"
          >
            Lock
          </button>
        </div>

        <div className="bg-neutral-800 p-4 rounded-lg mb-4">
          <p className="text-xs text-neutral-400">Address</p>
          <p className="font-mono text-sm break-all">{wallet.address}</p>
        </div>

        <div className="flex mb-4 bg-neutral-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("assets")}
            className={`flex-1 py-2 ${activeTab === "assets" ? "bg-blue-600" : ""}`}
          >
            Assets
          </button>
          <button
            onClick={() => setActiveTab("swap")}
            className={`flex-1 py-2 ${activeTab === "swap" ? "bg-blue-600" : ""}`}
          >
            Swap
          </button>
          <button
            onClick={() => setActiveTab("send")}
            className={`flex-1 py-2 ${activeTab === "send" ? "bg-blue-600" : ""}`}
          >
            Send
          </button>
          <button
            onClick={() => setActiveTab("receive")}
            className={`flex-1 py-2 ${activeTab === "receive" ? "bg-blue-600" : ""}`}
          >
            Receive
          </button>
        </div>

        {activeTab === "assets" && (
          <div className="space-y-3">
            {TOKENS.map((token) => {
              const price = prices[token.symbol];
              return (
                <div key={token.symbol} className="flex justify-between items-center bg-neutral-800 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{token.logo}</span>
                    <div>
                      <p className="font-semibold">{token.symbol}</p>
                      <p className="text-xs text-neutral-400">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${price ? price.price.toFixed(2) : "0.00"}</p>
                    {price && (
                      <p className={`text-xs ${price.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {price.change24h >= 0 ? "+" : ""}{price.change24h.toFixed(2)}%
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "swap" && (
          <div className="space-y-4">
            <select className="w-full p-3 bg-neutral-800 rounded-lg">
              <option>From: ETH</option>
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
            </select>
            <select className="w-full p-3 bg-neutral-800 rounded-lg">
              <option>To: USDT</option>
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={swapAmount}
              onChange={(e) => setSwapAmount(e.target.value)}
              className="w-full p-3 bg-neutral-800 rounded-lg"
            />
            <button className="w-full p-3 bg-blue-600 rounded-lg font-semibold">
              Swap
            </button>
          </div>
        )}

        {activeTab === "send" && (
          <div className="space-y-4">
            <select className="w-full p-3 bg-neutral-800 rounded-lg">
              <option>ETH</option>
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Recipient Address"
              value={sendAddress}
              onChange={(e) => setSendAddress(e.target.value)}
              className="w-full p-3 bg-neutral-800 rounded-lg"
            />
            <input
              type="number"
              placeholder="Amount"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              className="w-full p-3 bg-neutral-800 rounded-lg"
            />
            <button className="w-full p-3 bg-blue-600 rounded-lg font-semibold">
              Send
            </button>

            <div className="border-t border-neutral-700 pt-4 mt-4">
              <h2 className="text-lg font-semibold mb-2">Naira Withdrawal</h2>
              <input
                type="text"
                placeholder="Bank Account Number"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full p-3 bg-neutral-800 rounded-lg mb-2"
              />
              <input
                type="number"
                placeholder="Amount (NGN)"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                className="w-full p-3 bg-neutral-800 rounded-lg mb-2"
              />
              <button className="w-full p-3 bg-green-600 rounded-lg font-semibold">
                Withdraw to Bank
              </button>
            </div>
          </div>
        )}

        {activeTab === "receive" && (
          <div className="space-y-4 text-center">
            <div className="bg-neutral-800 p-6 rounded-lg">
              <div className="w-48 h-48 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center">
                <span className="text-neutral-900">QR Code</span>
              </div>
              <p className="text-xs text-neutral-400 mb-2">Your {wallet.chain.toUpperCase()} Address</p>
              <p className="font-mono text-sm break-all">{wallet.address}</p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(wallet.address)}
              className="w-full p-3 bg-blue-600 rounded-lg font-semibold"
            >
              Copy Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}