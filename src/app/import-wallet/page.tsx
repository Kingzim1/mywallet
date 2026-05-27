"use client";

import Link from "next/link";
import { useState } from "react";
import { importWalletFromSeedPhrase, importWalletFromPrivateKey, encryptWallet, SUPPORTED_CHAINS } from "@/lib/wallet";

export default function ImportWalletPage() {
  const [importType, setImportType] = useState<"seed" | "key">("seed");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [error, setError] = useState("");

  const handleImport = () => {
    try {
      const wallet = importType === "seed" 
        ? importWalletFromSeedPhrase(input, selectedChain)
        : importWalletFromPrivateKey(input, selectedChain);
      
      const encrypted = encryptWallet(wallet, password);
      localStorage.setItem("encryptedWallet", encrypted);
      localStorage.setItem("walletChain", selectedChain);
      window.location.href = "/wallet";
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Import Wallet</h1>

        <div className="flex mb-4">
          <button
            onClick={() => setImportType("seed")}
            className={`flex-1 p-2 ${importType === "seed" ? "bg-blue-600" : "bg-neutral-800"} rounded-l-lg`}
          >
            Seed Phrase
          </button>
          <button
            onClick={() => setImportType("key")}
            className={`flex-1 p-2 ${importType === "key" ? "bg-blue-600" : "bg-neutral-800"} rounded-r-lg`}
          >
            Private Key
          </button>
        </div>

        <select
          value={selectedChain}
          onChange={(e) => setSelectedChain(e.target.value)}
          className="w-full p-3 bg-neutral-800 rounded-lg mb-4"
        >
          {SUPPORTED_CHAINS.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>

        <textarea
          placeholder={importType === "seed" ? "Enter 12-word seed phrase" : "Enter private key"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 bg-neutral-800 rounded-lg mb-4 h-24"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-neutral-800 rounded-lg mb-4"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleImport}
          disabled={!input || !password}
          className="w-full p-3 bg-blue-600 rounded-lg font-semibold disabled:opacity-50"
        >
          Import Wallet
        </button>

        <Link href="/" className="block text-center mt-4 text-neutral-400">
          Back
        </Link>
      </div>
    </div>
  );
}