import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
  label?: string
}

export default function LoadingSpinner({
  size = 'medium',
  className = '',
  label = 'Loading...'
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4'
      case 'large':
        return 'w-8 h-8'
      default:
        return 'w-6 h-6'
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2
        className={`${getSizeClasses()} animate-spin text-primary-600 dark:text-primary-400`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
