"use client";

import Link from "next/link";
import { ArrowRightOnRectangleIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Multi-Chain Wallet</h1>
          <p className="text-neutral-400">Secure multi-chain wallet with swap, send, and receive</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/create-wallet"
            className="flex items-center justify-center w-full p-4 bg-blue-600 rounded-lg font-semibold text-lg"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create New Wallet
          </Link>

          <Link
            href="/import-wallet"
            className="flex items-center justify-center w-full p-4 bg-neutral-800 rounded-lg font-semibold text-lg"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
            Import Wallet
          </Link>
        </div>

        <div className="text-center text-sm text-neutral-500">
          <p>Supports Ethereum, BSC, Polygon, Arbitrum, Optimism</p>
        </div>
      </div>
    </main>
  );
}