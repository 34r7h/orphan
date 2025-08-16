import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import { User, UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: () => Promise<void>
  logout: () => Promise<void>
  selectRole: (role: UserRole) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [wallet, setWallet] = useState<CoinbaseWalletSDK | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // Check if user exists in local storage or database
  const fetchUser = useCallback(async (walletAddress: string) => {
    try {
      // In a real app, this would be an API call to your backend
      const storedUser = localStorage.getItem(`user_${walletAddress}`)
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        return userData
      }
      return null
    } catch (err) {
      console.error('Error fetching user:', err)
      return null
    }
  }, [])

  // Create or update user
  const createOrUpdateUser = useCallback(async (walletAddress: string, role?: UserRole) => {
    try {
      const userData: User = {
        id: walletAddress.toLowerCase(),
        address: walletAddress,
        role: role || UserRole.INNOVATOR,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // In a real app, this would be an API call to your backend
      localStorage.setItem(`user_${walletAddress}`, JSON.stringify(userData))
      setUser(userData)
      return userData
    } catch (err) {
      console.error('Error creating user:', err)
      throw err
    }
  }, [])

  // Login flow
  const login = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!wallet) {
        // Initialize Coinbase Wallet SDK with CDP-compliant config
        const newWallet = new CoinbaseWalletSDK({
          appName: import.meta.env.VITE_APP_NAME || 'Orphan Platform',
          appLogoUrl: 'https://via.placeholder.com/150',
          appChainIds: [import.meta.env.VITE_BASE_CHAIN_ID || 8453], // Base mainnet
        })
        setWallet(newWallet)
      }

      if (wallet && !isConnected) {
        // Connect to wallet using CDP SDK
        const provider = wallet.makeWeb3Provider()
        const accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[]
        const accountAddress = accounts[0]
        setAddress(accountAddress)
        setIsConnected(true)



        // Sign message to verify ownership using CDP provider
        const message = `Sign this message to authenticate with Orphan Platform\n\nAddress: ${accountAddress}\nTimestamp: ${Date.now()}`
        const signature = await provider.request({
          method: 'personal_sign',
          params: [message, accountAddress],
        })

        console.log('CDP Wallet Signature:', signature)

        // Fetch or create user
        let userData = await fetchUser(accountAddress)
        if (!userData) {
          userData = await createOrUpdateUser(accountAddress)
        }

        setUser(userData)
      }
    } catch (err) {
      console.error('CDP Login error:', err)
      setError(err instanceof Error ? err.message : 'Failed to login with CDP')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [wallet, isConnected, fetchUser, createOrUpdateUser])

  // Logout flow
  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Disconnect CDP wallet
      if (wallet) {
        // Coinbase Wallet SDK doesn't have a disconnect method, just clear state
        setWallet(null)
      }
      
      setAddress(null)
      setIsConnected(false)
      setUser(null)

      // Clear any cached data
      if (address) {
        localStorage.removeItem(`user_${address}`)
      }
    } catch (err) {
      console.error('CDP Logout error:', err)
      setError(err instanceof Error ? err.message : 'Failed to logout from CDP')
    } finally {
      setIsLoading(false)
    }
  }, [wallet, address])

  // Select user role
  const selectRole = useCallback(async (role: UserRole) => {
    if (!user || !address) {
      throw new Error('No user connected')
    }

    try {
      setIsLoading(true)
      const updatedUser = {
        ...user,
        role,
        updatedAt: new Date(),
      }

      // In a real app, this would be an API call
      localStorage.setItem(`user_${address}`, JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (err) {
      console.error('Role selection error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update role')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [user, address])

  // Update user profile
  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user || !address) {
      throw new Error('No user connected')
    }

    try {
      setIsLoading(true)
      const updatedUser = {
        ...user,
        ...data,
        updatedAt: new Date(),
      }

      // In a real app, this would be an API call
      localStorage.setItem(`user_${address}`, JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [user, address])

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!address) return

    try {
      setIsLoading(true)
      const userData = await fetchUser(address)
      if (userData) {
        setUser(userData)
      }
    } catch (err) {
      console.error('Refresh user error:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh user')
    } finally {
      setIsLoading(false)
    }
  }, [address, fetchUser])

  // Initialize CDP wallet and auto-connect on mount
  useEffect(() => {
    const initCDPWallet = async () => {
      try {
        setIsLoading(true)

        // Check if wallet is already connected
        if (wallet && isConnected && address) {
          const userData = await fetchUser(address)
          if (userData) {
            setUser(userData)
          }
        }
      } catch (err) {
        console.error('CDP Auth initialization error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initCDPWallet()
  }, [wallet, isConnected, address, fetchUser])

  // Monitor CDP account changes
  useEffect(() => {
    if (!isConnected || !address || !wallet) {
      setUser(null)
    }
  }, [isConnected, address, wallet])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && isConnected,
    error,
    login,
    logout,
    selectRole,
    updateProfile,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
