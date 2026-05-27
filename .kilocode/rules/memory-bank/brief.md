# Project Brief: Multi-Chain Wallet

## Purpose

A secure multi-chain cryptocurrency wallet application built on Next.js that allows users to manage digital assets across multiple blockchain networks.

## Target Users

- Cryptocurrency users managing assets across multiple chains
- Users needing secure wallet creation with seed phrases
- Users requiring swap functionality between tokens
- Users in Nigeria needing Naira fiat withdrawal

## Core Use Case

Users can:

1. Create a new wallet with a 12-word seed phrase
2. Import existing wallets via seed phrase or private key
3. Secure their wallet with password encryption
4. View assets with live token prices
5. Swap between supported tokens
6. Send/receive tokens
7. Withdraw Naira to bank accounts

## Key Requirements

### Must Have

- 12-word seed phrase generation using BIP39
- Private/public key derivation
- Wallet encryption with password (AES)
- Multi-chain support (Ethereum, BSC, Polygon, Arbitrum, Optimism)
- Token swap functionality
- Send/Receive transactions
- Naira bank withdrawal
- Live token price feeds

### Nice to Have

- QR code for receiving
- Transaction history
- Wallet connect integration

## Supported Tokens

ETH, BNB, MATIC, BTC, USDT, USDC, DAI, SOL

## Success Metrics

- All wallet operations working correctly
- Secure encryption implementation
- Live price data loading
- Clean, responsive UI