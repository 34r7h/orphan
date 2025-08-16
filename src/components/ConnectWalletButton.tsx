import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Wallet, Loader2, AlertCircle } from 'lucide-react'

interface ConnectWalletButtonProps {
  fullWidth?: boolean
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
}

export default function ConnectWalletButton({
  fullWidth = false,
  variant = 'primary',
  size = 'medium'
}: ConnectWalletButtonProps) {
  const { login, isLoading, error } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [showConnectorList, setShowConnectorList] = useState(false)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      await login()
    } catch (err) {
      console.error('CDP Connection error:', err)
      // Show error or fallback options
      setShowConnectorList(true)
    } finally {
      setIsConnecting(false)
    }
  }



  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-sm'
      case 'large':
        return 'px-6 py-3 text-base'
      default:
        return 'px-4 py-2 text-sm'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
      default:
        return 'bg-primary-600 hover:bg-primary-700 text-white'
    }
  }

  const buttonClasses = `
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${fullWidth ? 'w-full' : ''}
    font-medium rounded-lg transition-colors duration-200
    flex items-center justify-center space-x-2
    disabled:opacity-50 disabled:cursor-not-allowed
    relative
  `

  return (
    <>
      <button
        onClick={handleConnect}
        disabled={isConnecting || isLoading}
        className={buttonClasses}
      >
        {isConnecting || isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span>Connect CDP Wallet</span>
          </>
        )}
      </button>

      {/* CDP Connection Error Modal */}
      {showConnectorList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              CDP Wallet Connection
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error || 'Failed to connect to CDP wallet'}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This platform uses Coinbase Developer Platform (CDP) for secure wallet connections.
                </p>
              </div>
              
              <button
                onClick={() => setShowConnectorList(false)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
