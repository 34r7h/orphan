/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_PROJECT_ID: string
  readonly VITE_ENABLE_TESTNETS: string
  readonly VITE_BASE_RPC_URL: string
  readonly VITE_BASE_SEPOLIA_RPC_URL: string
  readonly VITE_MAINNET_RPC_URL: string
  readonly VITE_ONCHAINKIT_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
