import { useAuth } from '@/contexts/AuthContext'
import { UserRole, IdeaStatus, FundingStatus } from '@/types'
import {
  Plus,
  Lightbulb,
  Briefcase,
  DollarSign,
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  Target,
  Zap,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  User
} from 'lucide-react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DashboardPage() {
  const { user } = useAuth()

  // Early return if no user or role
  if (!user || !user.role) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const { role } = user

  // TODO: DEVELOPMENT ONLY - Replace with real API calls when backend is implemented
  // For now, we'll show empty states to demonstrate the UI structure
  const dashboardData = {
    ideas: [],
    executorProposals: [],
    activeProjects: [],
    totalRoyaltiesEarned: '0',
    acceptedProjects: [],
    investorProposals: [],
    activeMilestones: [],
    totalEquityValue: '0',
    investments: [],
    portfolioValue: '0',
    completedMilestones: 0,
    pendingPayouts: []
  }

  const renderInnovatorDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Ideas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.ideas?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Proposals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData.executorProposals?.filter((p: any) => p.status === 'pending').length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.activeProjects?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Royalties Earned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${dashboardData.totalRoyaltiesEarned || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/ideas/create"
            className="button-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Idea</span>
          </Link>
          <Link
            to="/marketplace/ideas"
            className="button-secondary inline-flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Browse Ideas</span>
          </Link>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Ideas</h3>
          <Link
            to="/ideas/create"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
          >
            Create New
          </Link>
        </div>
        
        {dashboardData.ideas?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.ideas.map((idea: any) => (
              <div key={idea.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                  {idea.imageUri && (
                    <img
                      src={idea.imageUri}
                      alt={idea.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`status-badge status-badge-${idea.status === IdeaStatus.OPEN ? 'idea' : 'project'}`}>
                      {idea.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {idea.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {idea.viewCount}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {idea.proposalCount}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {idea.createdAt.toLocaleDateString()}
                    </span>
                    <Link
                      to={`/idea/${idea.id}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No ideas yet</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start by creating your first idea and finding executors to build it.
            </p>
            <Link
              to="/ideas/create"
              className="button-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Idea</span>
            </Link>
          </div>
        )}
      </div>

      {/* Executor Proposals */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Pending Proposals</h3>
        {dashboardData.executorProposals?.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.executorProposals
              .filter((proposal: any) => proposal.status === 'pending')
              .map((proposal: any) => (
                <div key={proposal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {proposal.proposalTitle}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        For: {proposal.ideaTitle}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>By: {proposal.executorName}</span>
                        <span>Timeline: {proposal.estimatedTimeline} days</span>
                        <span>Equity: {proposal.requestedEquity}%</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="button-primary text-sm px-3 py-1">Accept</button>
                      <button className="button-secondary text-sm px-3 py-1">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No proposals yet</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Proposals from executors will appear here once you create ideas.
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const renderExecutorDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.acceptedProjects?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Proposals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData.investorProposals?.filter((p: any) => p.status === 'pending').length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Milestones</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.activeMilestones?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Equity Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${dashboardData.totalEquityValue || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Tools Access */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Agent Tools</h3>
          <Link
            to="/ai-tools"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
          >
            Manage Tools
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Development</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered coding assistance</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Marketing</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI marketing strategy tools</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Fundraising</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI investment pitch assistance</p>
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Your Projects</h3>
        <div className="space-y-4">
          {dashboardData.acceptedProjects?.map((project: any) => (
            <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
                  {project.imageUri && (
                    <img
                      src={project.imageUri}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {project.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Innovator: {project.innovatorName}
                  </p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                    </div>
                    <div className="milestone-progress">
                      <div
                        className="milestone-progress-bar"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Next: {project.nextMilestone}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Due: {project.nextMilestoneDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {project.equityPercentage}% Equity
                  </span>
                  <Link
                    to={`/project/${project.id}`}
                    className="button-primary text-sm px-3 py-1"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderInvestorDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Investments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.investments?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${dashboardData.portfolioValue || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed Milestones</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.completedMilestones || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payouts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${dashboardData.pendingPayouts?.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0) || '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/marketplace/projects"
            className="button-primary inline-flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Browse Projects</span>
          </Link>
          <Link
            to="/portfolio"
            className="button-secondary inline-flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Portfolio Analytics</span>
          </Link>
        </div>
      </div>

      {/* Active Investments */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Active Investments</h3>
        <div className="space-y-4">
          {dashboardData.investments?.map((investment: any) => (
            <div key={investment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {investment.projectTitle}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Executor: {investment.executorName}
                  </p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">{investment.progress}%</span>
                    </div>
                    <div className="milestone-progress">
                      <div
                        className="milestone-progress-bar"
                        style={{ width: `${investment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Investment: ${parseInt(investment.investmentAmount).toLocaleString()}</span>
                    <span>Equity: {investment.equityPercentage}%</span>
                    <span>Next Payout: ${investment.nextPayout}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`status-badge status-badge-${investment.status === FundingStatus.FUNDED ? 'funded' : 'project'}`}>
                    {investment.status}
                  </span>
                  <Link
                    to={`/investment/${investment.id}`}
                    className="button-primary text-sm px-3 py-1"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Payouts */}
      {dashboardData.pendingPayouts?.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Pending Payouts</h3>
          <div className="space-y-4">
            {dashboardData.pendingPayouts.map((payout: any) => (
              <div key={payout.milestoneId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      ${payout.amount} ({payout.percentage}%)
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Conditions: {payout.conditions.join(', ')}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Due: {payout.nextPayoutDate?.toLocaleDateString() || 'TBD'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {role === UserRole.INNOVATOR && 'Innovator Dashboard'}
                {role === UserRole.EXECUTOR && 'Executor Dashboard'}
                {role === UserRole.INVESTOR && 'Investor Dashboard'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {role === UserRole.INNOVATOR && 'Manage your ideas and track executor proposals'}
                {role === UserRole.EXECUTOR && 'Build projects and manage investor proposals'}
                {role === UserRole.INVESTOR && 'Track your investments and portfolio performance'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="button-secondary inline-flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <Link
                to="/settings"
                className="button-secondary inline-flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {role === UserRole.INNOVATOR && renderInnovatorDashboard()}
        {role === UserRole.EXECUTOR && renderExecutorDashboard()}
        {role === UserRole.INVESTOR && renderInvestorDashboard()}
      </div>
    </div>
  )
}
