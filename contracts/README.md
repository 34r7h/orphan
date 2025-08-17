# Orphan Platform Smart Contracts

This folder contains the smart contracts for the Orphan Platform, which enables innovators to create idea NFTs, executors to build projects, and investors to fund them.

## Contract Overview

### 1. IdeaNFT.sol
- **Purpose**: ERC-721 NFT contract for representing innovative ideas
- **Features**: 
  - Minting new idea NFTs
  - 5% royalty mechanism for innovators
  - Metadata storage on-chain
  - Transfer restrictions and ownership management

### 2. ProjectNFT.sol
- **Purpose**: ERC-721 NFT contract for representing active projects
- **Features**:
  - Links to parent IdeaNFT
  - Milestone tracking
  - Equity distribution (95% executor, 5% innovator)
  - Project status management

### 3. InvestmentNFT.sol
- **Purpose**: ERC-721 NFT contract for representing investments
- **Features**:
  - Investment amount and equity tracking
  - Escrow mechanism
  - Payout scheduling
  - Investment terms enforcement

### 4. OrphanPlatform.sol
- **Purpose**: Main platform contract that orchestrates all operations
- **Features**:
  - User role management
  - Proposal handling
  - Payment processing
  - Platform fee collection

## Testnet Configuration

### Base Sepolia Testnet
- **Network**: Base Sepolia (Chain ID: 84532)
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Currency**: ETH (testnet)

### Contract Deployment
1. Deploy contracts to Base Sepolia testnet
2. Update contract addresses in frontend configuration
3. Fund testnet wallets for testing

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Hardhat or Foundry
- MetaMask or Coinbase Wallet

### Installation
```bash
npm install
npm run compile
npm run test
npm run deploy:testnet
```

### Testing
```bash
npm run test
npm run test:coverage
```

## Contract Addresses (Testnet)

**Note**: These addresses will be updated after deployment

- IdeaNFT: `0x...`
- ProjectNFT: `0x...`
- InvestmentNFT: `0x...`
- OrphanPlatform: `0x...`

## Security Features

- Access control with OpenZeppelin
- Reentrancy protection
- Input validation
- Emergency pause functionality
- Upgradeable contracts (where applicable)

## Gas Optimization

- Batch operations for multiple NFTs
- Efficient storage patterns
- Minimal on-chain data storage
- Use of events for off-chain indexing

## License

MIT License - see LICENSE file for details
