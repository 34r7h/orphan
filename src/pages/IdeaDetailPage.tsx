import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole, IdeaStatus } from '@/types'
import {
  Lightbulb,
  Calendar,
  MapPin,
  Eye,
  MessageSquare,
  ArrowLeft,
  Plus,
  AlertCircle,
  ExternalLink,
  Copy,
  Share2,
  Globe
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function IdeaDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [idea, setIdea] = useState<any>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const loadIdeaData = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const mockIdea = {
          id: id,
          tokenId: '1',
          contractAddress: '0x1234567890abcdef...',
          innovatorAddress: '0x123...',
          title: 'Decentralized Task Management Platform',
          description: 'A blockchain-based platform for managing tasks and projects with built-in payments and reputation system. This platform will revolutionize how teams collaborate by providing transparent, trustless task management with automatic payments upon completion.',
          category: 'defi',
          tags: ['productivity', 'payments', 'dao', 'collaboration', 'blockchain'],
          imageUri: 'https://via.placeholder.com/800x400',
          metadataUri: 'ipfs://Qm...',
          royaltyPercentage: 5,
          status: IdeaStatus.OPEN,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          innovator: {
            name: 'Alice Chen',
            avatar: 'https://via.placeholder.com/150',
            bio: 'Passionate innovator building the future of decentralized applications',
            location: 'San Francisco, CA',
            website: 'https://alicechen.dev',
            twitter: '@alicechen',
            linkedin: 'alicechen'
          },
          stats: {
            viewCount: 1234,
            proposalCount: 5,
            shareCount: 89,
            bookmarkCount: 156
          }
        }

        const mockProposals = [
          {
            id: '1',
            executorName: 'Charlie Dev',
            executorAvatar: 'https://via.placeholder.com/150',
            proposalTitle: 'Full-stack development with React and Solidity',
            proposalDescription: 'I will build a complete MVP including frontend, smart contracts, and basic payment system. My team has 5+ years experience in DeFi development.',
            estimatedTimeline: 90,
            requestedEquity: 95,
            additionalTerms: 'Will provide weekly progress updates and milestone demos',
            status: 'pending',
            createdAt: new Date('2024-01-20'),
            portfolio: {
              completedProjects: 12,
              totalValue: '450000',
              rating: 4.8
            }
          },
          {
            id: '2',
            executorName: 'Bob Builder',
            executorAvatar: 'https://via.placeholder.com/150',
            proposalTitle: 'Rapid MVP development with modern tech stack',
            proposalDescription: 'Specialized in rapid prototyping and MVP development. Will use Next.js, Solidity, and deploy on Polygon for low gas costs.',
            estimatedTimeline: 60,
            requestedEquity: 90,
            additionalTerms: 'Can start immediately, will provide daily updates',
            status: 'pending',
            createdAt: new Date('2024-01-18'),
            portfolio: {
              completedProjects: 8,
              totalValue: '280000',
              rating: 4.6
            }
          }
        ]

        setIdea(mockIdea)
        setProposals(mockProposals)
        setIsLoading(false)
      }, 1000)
    }

    loadIdeaData()
  }, [id])

  const handlePropose = () => {
    if (!isAuthenticated) {
      // Trigger wallet connection
      document.getElementById('connect-wallet-trigger')?.click()
      return
    }

    if (user?.role === UserRole.EXECUTOR) {
      navigate(`/proposal/executor/${id}`)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: idea.title,
        text: idea.description,
        url: window.location.href
      })
    } catch (error) {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href)
      // Show toast notification
      alert('Link copied to clipboard!')
    }
  }

  const copyAddress = async () => {
    await navigator.clipboard.writeText(idea.contractAddress)
    // Show toast notification
    alert('Contract address copied!')
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Description */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {idea.description}
        </p>
      </div>

      {/* Tags */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {idea.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Innovation Details */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Innovation Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Royalty Structure</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Innovator receives <span className="font-semibold text-purple-600 dark:text-purple-400">{idea.royaltyPercentage}%</span> lifetime royalties on all future revenue
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Blockchain Network</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Built on <span className="font-semibold text-blue-600 dark:text-blue-400">Ethereum</span> with IPFS metadata storage
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProposalsTab = () => (
    <div className="space-y-6">
      {/* Proposals Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Executor Proposals ({proposals.length})
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Review proposals from executors interested in building this idea
          </p>
        </div>
        
        {user?.role === UserRole.EXECUTOR && (
          <button
            onClick={handlePropose}
            className="button-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Proposal</span>
          </button>
        )}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="glass-card rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
                {proposal.executorAvatar && (
                  <img
                    src={proposal.executorAvatar}
                    alt={proposal.executorName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {proposal.proposalTitle}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      By {proposal.executorName}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`status-badge ${
                      proposal.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : proposal.status === 'accepted'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {proposal.proposalDescription}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Timeline</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{proposal.estimatedTimeline} days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Equity Requested</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{proposal.requestedEquity}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{proposal.portfolio.rating}/5.0</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Portfolio: {proposal.portfolio.completedProjects} projects</span>
                    <span>Total Value: ${parseInt(proposal.portfolio.totalValue).toLocaleString()}</span>
                  </div>
                  
                  {user?.role === UserRole.INNOVATOR && proposal.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button className="button-primary text-sm px-3 py-1">Accept</button>
                      <button className="button-secondary text-sm px-3 py-1">Reject</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderInnovatorTab = () => (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
            {idea.innovator.avatar && (
              <img
                src={idea.innovator.avatar}
                alt={idea.innovator.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {idea.innovator.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {idea.innovator.bio}
            </p>
            
            <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              {idea.innovator.location && (
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {idea.innovator.location}
                </span>
              )}
              {idea.innovator.website && (
                <a
                  href={idea.innovator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  Website
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
              {idea.innovator.twitter && (
                <a
                  href={`https://twitter.com/${idea.innovator.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.665 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        </div>
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

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Idea Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The idea you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {idea.title}
              </h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {idea.createdAt.toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {idea.stats.viewCount} views
                </span>
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {idea.stats.proposalCount} proposals
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="button-secondary inline-flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              
              {user?.role === UserRole.EXECUTOR && (
                <button
                  onClick={handlePropose}
                  className="button-primary inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit Proposal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="glass-card rounded-xl overflow-hidden mb-8">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                {idea.imageUri && (
                  <img
                    src={idea.imageUri}
                    alt={idea.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="flex space-x-8">
                {['overview', 'proposals', 'innovator'].map((tab) => (
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
            {activeTab === 'proposals' && renderProposalsTab()}
            {activeTab === 'innovator' && renderInnovatorTab()}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Status</h3>
                  <span className={`status-badge status-badge-${idea.status === IdeaStatus.OPEN ? 'idea' : 'project'}`}>
                    {idea.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Category</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{idea.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Royalty</span>
                  <span className="font-medium text-gray-900 dark:text-white">{idea.royaltyPercentage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Proposals</span>
                  <span className="font-medium text-gray-900 dark:text-white">{idea.stats.proposalCount}</span>
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contract Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Contract Address</p>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1 truncate">
                      {idea.contractAddress}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Token ID</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{idea.tokenId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Metadata URI</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 break-all">{idea.metadataUri}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {user?.role === UserRole.EXECUTOR && (
                  <button
                    onClick={handlePropose}
                    className="w-full button-primary"
                  >
                    Submit Proposal
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="w-full button-secondary"
                >
                  Share Idea
                </button>
                <button
                  onClick={() => navigate(`/profile/${idea.innovatorAddress}`)}
                  className="w-full button-secondary"
                >
                  View Innovator Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
