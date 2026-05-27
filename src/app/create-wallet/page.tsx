"use client";

import { useState } from "react";
import { generateSeedPhrase, generateWallet, encryptWallet, SUPPORTED_CHAINS, WalletInfo } from "@/lib/wallet";

export default function CreateWalletPage() {
  const [step, setStep] = useState(1);
  const [seedPhrase, setSeedPhrase] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [agreed, setAgreed] = useState(false);

  const handleGenerateSeed = () => {
    const phrase = generateSeedPhrase();
    setSeedPhrase(phrase);
    setStep(2);
  };

  const handleCreateWallet = () => {
    const newWallet = generateWallet(seedPhrase, selectedChain);
    setWallet(newWallet);
    setStep(3);
  };

  const handleSaveWallet = () => {
    if (!wallet || !password || password !== confirmPassword) return;
    const encrypted = encryptWallet(wallet, password);
    localStorage.setItem("encryptedWallet", encrypted);
    localStorage.setItem("walletChain", selectedChain);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Wallet</h1>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-center">Generate a new 12-word seed phrase</p>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="w-full p-3 bg-neutral-800 rounded-lg"
            >
              {SUPPORTED_CHAINS.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleGenerateSeed}
              className="w-full p-3 bg-blue-600 rounded-lg font-semibold"
            >
              Generate Seed Phrase
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm">Write down these 12 words:</p>
            <div className="grid grid-cols-3 gap-2 p-4 bg-neutral-800 rounded-lg">
              {seedPhrase.split(" ").map((word, i) => (
                <div key={i} className="flex items-center">
                  <span className="text-neutral-400 mr-1">{i + 1}.</span>
                  <span className="font-mono">{word}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="agree" className="text-sm">
                I have saved my seed phrase
              </label>
            </div>
            <button
              onClick={handleCreateWallet}
              disabled={!agreed}
              className="w-full p-3 bg-blue-600 rounded-lg font-semibold disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && wallet && (
          <div className="space-y-4">
            <p className="text-sm">Set a password to secure your wallet</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-neutral-800 rounded-lg"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-neutral-800 rounded-lg"
            />
            <div className="p-3 bg-neutral-800 rounded-lg">
              <p className="text-xs text-neutral-400">Address:</p>
              <p className="font-mono text-sm break-all">{wallet.address}</p>
            </div>
            <button
              onClick={handleSaveWallet}
              disabled={!password || password !== confirmPassword}
              className="w-full p-3 bg-green-600 rounded-lg font-semibold disabled:opacity-50"
            >
              Save Wallet
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-center">
            <p className="text-green-400 text-lg">Wallet Created Successfully!</p>
            <a href="/wallet" className="block w-full p-3 bg-blue-600 rounded-lg font-semibold">
              Go to Wallet
            </a>
          </div>
        )}
      </div>
    </div>
  );
}