import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole, IdeaStatus, ProjectStatus, FundingStatus } from '@/types'
import {
  User,
  Edit,
  Save,
  X,
  Lightbulb,
  Briefcase,
  DollarSign,
  Calendar,
  MapPin,
  TrendingUp,
  Eye,
  MessageSquare,
  Plus,
  Settings
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ProfilePage() {
  const { address } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<any>({})
  const [editForm, setEditForm] = useState<any>({})
  const [activeTab, setActiveTab] = useState('overview')

  // Determine if viewing own profile or someone else's
  const isOwnProfile = !address || address === currentUser?.address

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const mockProfile = {
          address: address || currentUser?.address || '0x123...',
          role: UserRole.INNOVATOR,
          name: 'Alice Chen',
          bio: 'Passionate innovator building the future of decentralized applications. Focused on DeFi and social impact projects.',
          avatar: 'https://via.placeholder.com/150',
          location: 'San Francisco, CA',
          website: 'https://alicechen.dev',
          twitter: '@alicechen',
          linkedin: 'alicechen',
          github: 'alicechen',
          createdAt: new Date('2024-01-01'),
          stats: {
            ideasCreated: 5,
            projectsExecuted: 2,
            investmentsMade: 3,
            totalValue: '125000'
          },
          ideas: [
            {
              id: '1',
              title: 'Decentralized Task Management Platform',
              status: IdeaStatus.OPEN,
              proposalCount: 5,
              viewCount: 234,
              createdAt: new Date('2024-01-15'),
              imageUri: 'https://via.placeholder.com/400'
            },
            {
              id: '2',
              title: 'AI-Powered Smart Contract Auditor',
              status: IdeaStatus.IN_PROGRESS,
              proposalCount: 3,
              viewCount: 456,
              createdAt: new Date('2024-01-10'),
              imageUri: 'https://via.placeholder.com/400'
            }
          ],
          projects: [
            {
              id: '1',
              title: 'AI-Powered Smart Contract Auditor',
              status: ProjectStatus.ACTIVE,
              progress: 65,
              equityPercentage: 95,
              nextMilestone: 'Security audit completion',
              nextMilestoneDate: new Date('2024-03-15'),
              imageUri: 'https://via.placeholder.com/400'
            }
          ],
          investments: [
            {
              id: '1',
              projectTitle: 'Decentralized Task Management Platform',
              executorName: 'Charlie Dev',
              investmentAmount: '15000',
              equityPercentage: 10,
              status: FundingStatus.FUNDED,
              progress: 45,
              nextPayout: '7500',
              nextPayoutDate: new Date('2024-04-01')
            }
          ],
          activity: [
            {
              id: '1',
              type: 'idea_created',
              title: 'Created new idea: Decentralized Task Management Platform',
              timestamp: new Date('2024-01-15'),
              details: 'Idea NFT minted with 5% royalty rights'
            },
            {
              id: '2',
              type: 'proposal_received',
              title: 'Received executor proposal from Charlie Dev',
              timestamp: new Date('2024-01-20'),
              details: 'Proposal for 95% equity over 90 days'
            },
            {
              id: '3',
              type: 'proposal_accepted',
              title: 'Accepted executor proposal for AI Auditor',
              timestamp: new Date('2024-01-25'),
              details: 'Project NFT minted, development started'
            }
          ]
        }

        setProfileData(mockProfile)
        setEditForm({
          name: mockProfile.name,
          bio: mockProfile.bio,
          location: mockProfile.location,
          website: mockProfile.website,
          twitter: mockProfile.twitter,
          linkedin: mockProfile.linkedin,
          github: mockProfile.github
        })
        setIsLoading(false)
      }, 1000)
    }

    loadProfileData()
  }, [address, currentUser?.address])

  const handleEditSave = async () => {
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProfileData((prev: any) => ({
        ...prev,
        ...editForm
      }))
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleEditCancel = () => {
    setEditForm({
      name: profileData.name,
      bio: profileData.bio,
      location: profileData.location,
      website: profileData.website,
      twitter: profileData.twitter,
      linkedin: profileData.linkedin,
      github: profileData.github
    })
    setIsEditing(false)
  }



  const getRoleBadgeColor = () => {
    switch (profileData.role) {
      case UserRole.INNOVATOR:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case UserRole.EXECUTOR:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case UserRole.INVESTOR:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.stats?.ideasCreated || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ideas Created</p>
        </div>
        
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.stats?.projectsExecuted || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Projects Executed</p>
        </div>
        
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.stats?.investmentsMade || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Investments Made</p>
        </div>
        
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${profileData.stats?.totalValue || '0'}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {profileData.activity?.slice(0, 5).map((activity: any) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {activity.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {activity.details}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {activity.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderIdeasTab = () => (
    <div className="space-y-6">
      {isOwnProfile && profileData.role === UserRole.INNOVATOR && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/ideas/create')}
            className="button-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Idea</span>
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profileData.ideas?.map((idea: any) => (
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
                <button
                  onClick={() => navigate(`/idea/${idea.id}`)}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profileData.projects?.map((project: any) => (
          <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
              {project.imageUri && (
                <img
                  src={project.imageUri}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 right-2">
                <span className="status-badge status-badge-project">
                  {project.status}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {project.title}
              </h4>
              
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
              
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {project.equityPercentage}% Equity
                </span>
                <button
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="button-primary text-sm px-3 py-1"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderInvestmentsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profileData.investments?.map((investment: any) => (
          <div key={investment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {investment.projectTitle}
              </h4>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
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
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>Investment: ${parseInt(investment.investmentAmount).toLocaleString()}</span>
                <span>Equity: {investment.equityPercentage}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Next Payout: ${investment.nextPayout}
                </span>
                <button
                  onClick={() => navigate(`/investment/${investment.id}`)}
                  className="button-primary text-sm px-3 py-1"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
            {/* Profile Info */}
            <div className="flex items-start space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                {isOwnProfile && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center">
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {profileData.name}
                  </h1>
                  <span className={`status-badge ${getRoleBadgeColor()}`}>
                    {profileData.role}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                  {profileData.bio}
                </p>
                
                <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  {profileData.location && (
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profileData.location}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Member since {profileData.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="flex flex-col space-y-3">
                {isEditing ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleEditSave}
                      className="button-primary inline-flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="button-secondary inline-flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="button-secondary inline-flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
                <Link
                  to="/settings"
                  className="button-secondary inline-flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'ideas', 'projects', 'investments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'ideas' && renderIdeasTab()}
        {activeTab === 'projects' && renderProjectsTab()}
        {activeTab === 'investments' && renderInvestmentsTab()}
      </div>
    </div>
  )
}
