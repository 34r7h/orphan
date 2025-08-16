import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { base } from 'viem/chains'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

// CDP Polyfills for Browser Compatibility
import { Buffer } from 'buffer'
import process from 'process'

// Make Buffer available globally for CDP Wallet SDK
if (typeof window !== 'undefined') {
  window.Buffer = Buffer
  window.global = window
  window.process = process
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <OnchainKitProvider chain={base}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
        </OnchainKitProvider>
      </QueryClientProvider>
    </React.StrictMode>,
)
