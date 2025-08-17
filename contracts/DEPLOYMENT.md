# Contract Deployment Guide

This guide will walk you through deploying the Orphan Platform smart contracts to Base Sepolia testnet.

## Prerequisites

1. **Node.js 18+** installed
2. **npm** or **yarn** package manager
3. **MetaMask** or **Coinbase Wallet** browser extension
4. **Base Sepolia testnet ETH** (get from [Coinbase Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet))

## Setup

### 1. Install Dependencies

```bash
cd contracts
npm install
```

### 2. Environment Configuration

Create a `.env` file in the contracts folder:

```bash
cp env.example .env
```

Edit `.env` and add your configuration:

```env
# Base Sepolia Testnet Configuration
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org

# Private key for deployment (DO NOT commit this to version control)
PRIVATE_KEY=your_private_key_here

# BaseScan API key for contract verification
BASESCAN_API_KEY=your_basescan_api_key_here

# Gas reporting
REPORT_GAS=true
```

**⚠️ Security Warning**: Never commit your private key to version control!

### 3. Get Your Private Key

1. Open MetaMask/Coinbase Wallet
2. Go to Account Details
3. Click "Export Private Key"
4. Enter your password
5. Copy the private key to your `.env` file

### 4. Get Base Sepolia ETH

1. Visit [Coinbase Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Connect your wallet
3. Request testnet ETH (you'll need at least 0.1 ETH for deployment)

### 5. Get BaseScan API Key (Optional)

1. Visit [BaseScan](https://basescan.org)
2. Create an account
3. Go to API Keys section
4. Generate a new API key
5. Add it to your `.env` file

## Deployment

### 1. Compile Contracts

```bash
npm run compile
```

This will create the contract artifacts in the `artifacts/` folder.

### 2. Deploy to Base Sepolia

```bash
npm run deploy:testnet
```

The deployment script will:
- Deploy the IdeaNFT contract
- Deploy the OrphanPlatform contract
- Link the contracts together
- Display deployment information

### 3. Verify Deployment

After successful deployment, you should see output like:

```
🚀 Starting deployment to Base Sepolia testnet...
📝 Deploying contracts with account: 0x...
💰 Account balance: 0.1...
📋 Deploying IdeaNFT contract...
✅ IdeaNFT deployed to: 0x1234...
🏗️ Deploying OrphanPlatform contract...
✅ OrphanPlatform deployed to: 0x5678...
🔍 Verifying deployment...
📊 Contract addresses:
   IdeaNFT: 0x1234...
   OrphanPlatform: 0x5678...
👑 Contract ownership:
   IdeaNFT owner: 0x...
   OrphanPlatform owner: 0x...
🔗 Contract linking:
   OrphanPlatform -> IdeaNFT: 0x1234...
✅ Contract linking verified successfully!
🎉 Deployment completed successfully!
```

## Post-Deployment

### 1. Update Frontend Configuration

After deployment, update the contract addresses in `src/config/contracts.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  baseSepolia: {
    ideaNFT: '0x1234...', // Your deployed IdeaNFT address
    orphanPlatform: '0x5678...', // Your deployed OrphanPlatform address
  },
  // ... rest of config
};
```

### 2. Verify Contracts on BaseScan

1. Visit [Base Sepolia Explorer](https://sepolia.basescan.org)
2. Search for your contract addresses
3. Click "Contract" tab
4. Click "Verify and Publish"
5. Use the ABI paths from `src/config/contracts.ts`

### 3. Test the Contracts

1. Start your frontend application
2. Connect your wallet to Base Sepolia testnet
3. Try creating an idea NFT
4. Check the transaction on BaseScan

## Troubleshooting

### Common Issues

#### 1. Insufficient Balance
```
Error: insufficient funds for gas * price + value
```
**Solution**: Get more Base Sepolia ETH from the faucet.

#### 2. Wrong Network
```
Error: MetaMask Tx Signature: User rejected message
```
**Solution**: Make sure your wallet is connected to Base Sepolia testnet (Chain ID: 84532).

#### 3. Compilation Errors
```
Error: Compilation failed
```
**Solution**: Check that you have Node.js 18+ and all dependencies installed.

#### 4. Gas Estimation Failed
```
Error: gas estimation failed
```
**Solution**: Check your RPC URL and ensure the network is accessible.

### Getting Help

If you encounter issues:

1. Check the [Base documentation](https://docs.base.org/)
2. Visit [Base Discord](https://discord.gg/base)
3. Check [BaseScan support](https://basescan.org/support)

## Next Steps

After successful deployment:

1. **Test the platform** with your deployed contracts
2. **Deploy to mainnet** when ready (update addresses and fees)
3. **Monitor contract activity** on BaseScan
4. **Set up monitoring** for contract events
5. **Implement additional features** like project NFTs and investment contracts

## Security Notes

- **Never share your private key**
- **Test thoroughly on testnet before mainnet**
- **Use hardware wallets for mainnet deployment**
- **Regularly audit your contracts**
- **Keep dependencies updated**

## Cost Estimation

### Testnet Deployment (Base Sepolia)
- **IdeaNFT**: ~0.01 ETH
- **OrphanPlatform**: ~0.02 ETH
- **Total**: ~0.03 ETH

### Mainnet Deployment (Base)
- **IdeaNFT**: ~0.001 ETH
- **OrphanPlatform**: ~0.002 ETH
- **Total**: ~0.003 ETH

*Note: Gas costs vary based on network congestion*
