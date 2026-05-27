"use client";

import Link from "next/link";
import { useState } from "react";
import { importWalletFromSeedPhrase, importWalletFromPrivateKey, encryptWallet, SUPPORTED_CHAINS, importToken, ImportedToken } from "@/lib/wallet";

export default function ImportWalletPage() {
  const [importType, setImportType] = useState<"seed" | "key" | "token">("seed");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [error, setError] = useState("");
  
  // Token import fields
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenContract, setTokenContract] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState("18");
  const [importedTokens, setImportedTokens] = useState<ImportedToken[]>([]);

  const handleImport = () => {
    try {
      let wallet;
      if (importType === "token") {
        const token = importToken(
          tokenSymbol,
          tokenName,
          tokenContract,
          parseInt(tokenDecimals),
          selectedChain
        );
        const existing = JSON.parse(localStorage.getItem("importedTokens") || "[]");
        const updated = [...existing, token];
        localStorage.setItem("importedTokens", JSON.stringify(updated));
        setImportedTokens(updated);
        setInput("");
        setTokenSymbol("");
        setTokenName("");
        setTokenContract("");
      } else {
        wallet = importType === "seed" 
          ? importWalletFromSeedPhrase(input, selectedChain)
          : importWalletFromPrivateKey(input, selectedChain);
        
        const encrypted = encryptWallet(wallet, password);
        localStorage.setItem("encryptedWallet", encrypted);
        localStorage.setItem("walletChain", selectedChain);
        window.location.href = "/wallet";
      }
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
            className={`flex-1 p-2 ${importType === "key" ? "bg-blue-600" : "bg-neutral-800"}`}
          >
            Private Key
          </button>
          <button
            onClick={() => setImportType("token")}
            className={`flex-1 p-2 ${importType === "token" ? "bg-blue-600" : "bg-neutral-800"} rounded-r-lg`}
          >
            Token
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

        {importType === "token" && (
          <div className="space-y-4 mb-4">
            <input
              type="text"
              placeholder="Token Symbol (e.g., WETH)"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              className="w-full p-3 bg-neutral-800 rounded-lg"
            />
            <input
              type="text"
              placeholder="Token Name (e.g., Wrapped Ether)"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className="w-full p-3 bg-neutral-800 rounded-lg"
            />
            <input
              type="text"
              placeholder="Contract Address (0x...)"
              value={tokenContract}
              onChange={(e) => setTokenContract(e.target.value)}
              className="w-full p-3 bg-neutral-800 rounded-lg"
            />
            <input
              type="number"
              placeholder="Decimals"
              value={tokenDecimals}
              onChange={(e) => setTokenDecimals(e.target.value)}
              className="w-full p-3 bg-neutral-800 rounded-lg"
            />
          </div>
        )}

        {importType !== "token" && (
          <textarea
            placeholder={importType === "seed" ? "Enter 12-word seed phrase" : "Enter private key"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 bg-neutral-800 rounded-lg mb-4 h-24"
          />
        )}

        {importType !== "token" && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-neutral-800 rounded-lg mb-4"
          />
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleImport}
          disabled={importType === "token" 
            ? !tokenSymbol || !tokenName || !tokenContract || !tokenDecimals
            : !input || !password
          }
          className="w-full p-3 bg-blue-600 rounded-lg font-semibold disabled:opacity-50"
        >
          {importType === "token" ? "Import Token" : "Import Wallet"}
        </button>

        {importType === "token" && importedTokens.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Imported Tokens</h3>
            <div className="space-y-2">
              {importedTokens.map((t, i) => (
                <div key={i} className="bg-neutral-800 p-2 rounded-lg">
                  <p className="font-semibold">{t.symbol}</p>
                  <p className="text-xs text-neutral-400">{t.name}</p>
                  <p className="text-xs font-mono truncate">{t.contractAddress}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link href="/" className="block text-center mt-4 text-neutral-400">
          Back
        </Link>
      </div>
    </div>
  );
}