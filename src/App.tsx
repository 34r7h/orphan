import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import ProtectedRoute from '@/components/ProtectedRoute'

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'))
const MarketplacePage = lazy(() => import('@/pages/MarketplacePage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const IdeaDetailPage = lazy(() => import('@/pages/IdeaDetailPage'))
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'))
const CreateIdeaPage = lazy(() => import('@/pages/CreateIdeaPage'))
const ProposalPage = lazy(() => import('@/pages/ProposalPage'))
const InvestmentPage = lazy(() => import('@/pages/InvestmentPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <Layout>
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <LoadingSpinner size="large" />
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/ideas" element={<MarketplacePage defaultTab="ideas" />} />
          <Route path="/marketplace/projects" element={<MarketplacePage defaultTab="projects" />} />

          {/* Idea Routes */}
          <Route path="/idea/:id" element={<IdeaDetailPage />} />
          <Route
            path="/ideas/create"
            element={
              <ProtectedRoute allowedRoles={[UserRole.INNOVATOR]}>
                <CreateIdeaPage />
              </ProtectedRoute>
            }
          />

          {/* Project Routes */}
          <Route path="/project/:id" element={<ProjectDetailPage />} />

          {/* Proposal Routes */}
          <Route
            path="/proposal/executor/:ideaId"
            element={
              <ProtectedRoute allowedRoles={[UserRole.EXECUTOR]}>
                <ProposalPage type="executor" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposal/investor/:projectId"
            element={
              <ProtectedRoute allowedRoles={[UserRole.INVESTOR]}>
                <ProposalPage type="investor" />
              </ProtectedRoute>
            }
          />

          {/* Investment Routes */}
          <Route path="/investment/:id" element={<InvestmentPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.role === UserRole.INNOVATOR && <Navigate to="/dashboard/innovator" replace />}
                {user?.role === UserRole.EXECUTOR && <Navigate to="/dashboard/executor" replace />}
                {user?.role === UserRole.INVESTOR && <Navigate to="/dashboard/investor" replace />}
                {!user?.role && <Navigate to="/profile" replace />}
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/innovator"
            element={
              <ProtectedRoute allowedRoles={[UserRole.INNOVATOR]}>
                <DashboardPage role={UserRole.INNOVATOR} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/executor"
            element={
              <ProtectedRoute allowedRoles={[UserRole.EXECUTOR]}>
                <DashboardPage role={UserRole.EXECUTOR} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/investor"
            element={
              <ProtectedRoute allowedRoles={[UserRole.INVESTOR]}>
                <DashboardPage role={UserRole.INVESTOR} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/profile/:address" element={<ProfilePage />} />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App
