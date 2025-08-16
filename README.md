# Orphan Platform

A decentralized platform built on Coinbase Developer Platform (CDP) that connects innovators, executors, and investors through blockchain-powered NFT agreements.

## 🚀 Overview

The Orphan Platform transforms ideas into funded reality by creating a transparent, fair ecosystem where:
- **Innovators** submit ideas as NFTs and earn 5% lifetime royalties
- **Executors** build ideas into projects and earn 95% equity upon milestone completion
- **Investors** fund promising projects with milestone-based investments through smart escrow

## ✨ Features

### For Innovators
- Create idea NFTs for just $1 USDC + gas
- Automatic 5% royalty on all project revenue
- Track executor proposals and project progress
- Maintain ownership rights throughout the journey

### For Executors
- Browse and propose on innovative ideas
- Access AI-powered development tools (CDP Agents)
- Manage project milestones and deliverables
- Earn 95% project equity upon successful completion

### For Investors
- Discover vetted projects ready for funding
- Milestone-based investment protection
- Automated escrow and payout system
- Track portfolio performance in real-time

## 🛠 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Blockchain Integration**: 
  - Wagmi v2 for Ethereum interactions
  - Coinbase OnchainKit for CDP integration
  - Viem for type-safe blockchain calls
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Smart Contracts**: Solidity (contracts not included in this repo)
- **Supported Networks**: Base (mainnet) and Base Sepolia (testnet)

## 📋 Prerequisites

- Node.js v20.15.0 or higher
- npm or yarn package manager
- A wallet that supports Base network (Coinbase Wallet recommended)
- CDP API credentials (get from https://portal.cdp.coinbase.com/)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/cdp-innovation-platform.git
cd cdp-innovation-platform/cute-cdp-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
VITE_ONCHAINKIT_API_KEY=your_cdp_api_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
VITE_ENABLE_TESTNETS=true
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at http://localhost:3000

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main app layout with navigation
│   ├── ConnectWalletButton.tsx
│   ├── LoadingSpinner.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication and user management
├── hooks/              # Custom React hooks
├── lib/                # Library configurations
│   └── wagmi.ts       # Wagmi and blockchain config
├── pages/              # Route components
│   ├── HomePage.tsx
│   ├── MarketplacePage.tsx
│   ├── DashboardPage.tsx
│   └── ...
├── services/           # API and blockchain services
├── types/              # TypeScript type definitions
│   └── index.ts       # All app types
├── utils/              # Utility functions
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## 🔑 Key Components

### Authentication Flow
The app uses wallet-based authentication:
1. User connects wallet (Coinbase Wallet preferred for CDP)
2. Signs a message to verify ownership
3. Selects their role (Innovator, Executor, or Investor)
4. Access role-specific features

### Smart Contract Integration
The platform interacts with several smart contracts:
- **IdeaNFT**: Manages idea creation and royalties
- **ProjectNFT**: Handles project creation and executor equity
- **InvestmentNFT**: Manages investor agreements
- **EscrowFactory**: Creates milestone-based escrow contracts
- **PaymentProcessor**: Handles USDC payments

### CDP Integration
- Uses OnchainKit for seamless wallet connections
- Leverages CDP APIs for blockchain interactions
- Supports Base network for low-cost transactions

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Glass Morphism**: Modern UI with translucent components
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages

## 🔐 Security Considerations

- All smart contract interactions require user approval
- Escrow system protects investor funds
- Milestone verification before payouts
- Role-based access control

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

## 📝 Environment Variables

See `.env.example` for all available configuration options. Key variables:
- `VITE_ONCHAINKIT_API_KEY`: CDP API key
- `VITE_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID
- `VITE_ENABLE_TESTNETS`: Enable/disable testnet support
- Contract addresses for each network

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built on [Coinbase Developer Platform](https://www.coinbase.com/developer-platform)
- Uses [OnchainKit](https://onchainkit.xyz/) for blockchain interactions
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

- Discord: [Join our community](https://discord.gg/cdp)
- Documentation: [View docs](https://docs.cdp-innovation.com)
- Issues: [GitHub Issues](https://github.com/your-username/cdp-innovation-platform/issues)

---

Built with ❤️ on Coinbase Developer Platform