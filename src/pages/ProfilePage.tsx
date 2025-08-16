import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import {
  Edit,
  Save,
  X,
  User,
  MapPin,
  Globe,
  Twitter,
  Linkedin,
  Github,
  Calendar,
  Plus,
  Lightbulb,
  Briefcase,
  DollarSign,
  Eye,
  Settings
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ProfilePage() {
  const { address } = useParams()
  const navigate = useNavigate()
  const { user: currentUser, updateProfile, clearAllUserData } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [activeTab, setActiveTab] = useState('overview')

  // Determine if viewing own profile or someone else's
  const isOwnProfile = !address || address === currentUser?.address

  // Use current user data or create profile data from user
  const profileData = currentUser || {
    address: address || '0x...',
    role: UserRole.INNOVATOR,
    name: 'Anonymous User',
    bio: 'No bio available',
    avatar: '',
    location: '',
    website: '',
    twitter: '',
    linkedin: '',
    github: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  useEffect(() => {
    // Initialize edit form with current profile data
    setEditForm({
      name: profileData.name || '',
      bio: profileData.bio || '',
      location: profileData.location || '',
      website: profileData.website || '',
      twitter: profileData.twitter || '',
      linkedin: profileData.linkedin || '',
      github: profileData.github || ''
    })
  }, [profileData])

  const handleEditSave = async () => {
    try {
      setIsLoading(true)
      
      // Update profile using AuthContext
      await updateProfile(editForm)
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
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
      {/* Profile Information */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <p className="text-gray-900 dark:text-white">{profileData.name || 'Not set'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <span className={`status-badge ${getRoleBadgeColor()}`}>
              {profileData.role}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <p className="text-gray-900 dark:text-white">{profileData.location || 'Not set'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Member Since
            </label>
            <p className="text-gray-900 dark:text-white">
              {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <p className="text-gray-900 dark:text-white">
              {profileData.bio || 'No bio available'}
            </p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {(profileData.website || profileData.twitter || profileData.linkedin || profileData.github) && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData.website && (
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <a
                  href={profileData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {profileData.website}
                </a>
              </div>
            )}
            
            {profileData.twitter && (
              <div className="flex items-center space-x-3">
                <Twitter className="w-5 h-5 text-gray-400" />
                <a
                  href={`https://twitter.com/${profileData.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {profileData.twitter}
                </a>
              </div>
            )}
            
            {profileData.linkedin && (
              <div className="flex items-center space-x-3">
                <Linkedin className="w-5 h-5 text-gray-400" />
                <a
                  href={`https://linkedin.com/in/${profileData.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {profileData.linkedin}
                </a>
              </div>
            )}
            
            {profileData.github && (
              <div className="flex items-center space-x-3">
                <Github className="w-5 h-5 text-gray-400" />
                <a
                  href={`https://github.com/${profileData.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {profileData.github}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
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
      
      <div className="glass-card rounded-xl p-8 text-center">
        <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No ideas yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {isOwnProfile 
            ? "Start by creating your first idea and finding executors to build it."
            : "This user hasn't created any ideas yet."
          }
        </p>
        {isOwnProfile && profileData.role === UserRole.INNOVATOR && (
          <button
            onClick={() => navigate('/ideas/create')}
            className="button-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Idea</span>
          </button>
        )}
      </div>
    </div>
  )

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-8 text-center">
        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No projects yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {isOwnProfile 
            ? "Projects will appear here once you start executing ideas or get hired as an executor."
            : "This user hasn't been involved in any projects yet."
          }
        </p>
        {isOwnProfile && profileData.role === UserRole.EXECUTOR && (
          <button
            onClick={() => navigate('/marketplace/ideas')}
            className="button-primary inline-flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Browse Ideas to Execute</span>
          </button>
        )}
      </div>
    </div>
  )

  const renderInvestmentsTab = () => (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-8 text-center">
        <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No investments yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {isOwnProfile 
            ? "Investments will appear here once you start funding projects as an investor."
            : "This user hasn't made any investments yet."
          }
        </p>
        {isOwnProfile && profileData.role === UserRole.INVESTOR && (
          <button
            onClick={() => navigate('/marketplace/projects')}
            className="button-primary inline-flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Browse Projects to Invest In</span>
          </button>
        )}
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
                    Member since {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Unknown'}
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
                <button
                  onClick={clearAllUserData}
                  className="button-secondary inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  <span>Clear All Data</span>
                </button>
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
