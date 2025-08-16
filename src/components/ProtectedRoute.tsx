import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import LoadingSpinner from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/'
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user?.role || !allowedRoles.includes(user.role)) {
      // User doesn't have the required role
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Access Denied
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
              Required role: {allowedRoles.join(' or ')}
            </p>
            <Navigate to={redirectTo} replace />
          </div>
        </div>
      )
    }
  }

  // User is authenticated and has the required role
  return <>{children}</>
}
