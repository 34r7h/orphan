import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole, IdeaStatus, ProjectStatus, MarketplaceIdea, MarketplaceProject } from '@/types'
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  Users,
  Sparkles,
  Briefcase,
  Eye,
  MessageSquare,
  Target,
  ArrowUpRight
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

interface MarketplacePageProps {
  defaultTab?: 'ideas' | 'projects'
}

export default function MarketplacePage({ defaultTab = 'ideas' }: MarketplacePageProps) {
  const [, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const [activeTab, setActiveTab] = useState(defaultTab)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - in production, this would come from API calls
  const [ideas, setIdeas] = useState<MarketplaceIdea[]>([])
  const [projects, setProjects] = useState<MarketplaceProject[]>([])

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'defi', label: 'DeFi' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'social', label: 'Social' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'nft', label: 'NFT' },
    { value: 'dao', label: 'DAO' },
    { value: 'other', label: 'Other' }
  ]

  const ideaStatuses = [
    { value: 'all', label: 'All Status' },
    { value: IdeaStatus.OPEN, label: 'Open' },
    { value: IdeaStatus.IN_PROGRESS, label: 'In Progress' }
  ]

  const projectStatuses = [
    { value: 'all', label: 'All Status' },
    { value: ProjectStatus.ACTIVE, label: 'Active' },
    { value: ProjectStatus.PAUSED, label: 'Paused' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most_proposals', label: 'Most Proposals' },
    { value: 'trending', label: 'Trending' }
  ]

  const projectSortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most_funded', label: 'Most Funded' },
    { value: 'least_funded', label: 'Least Funded' },
    { value: 'trending', label: 'Trending' }
  ]

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        // Mock ideas data
        setIdeas([
          {
            idea: {
              id: '1',
              tokenId: '1',
              contractAddress: '0x...',
              innovatorAddress: '0x123...',
              title: 'Decentralized Task Management Platform',
              description: 'A blockchain-based platform for managing tasks and projects with built-in payments and reputation system.',
              category: 'defi',
              tags: ['productivity', 'payments', 'dao'],
              imageUri: 'https://via.placeholder.com/400',
              metadataUri: 'ipfs://...',
              royaltyPercentage: 5,
              status: IdeaStatus.OPEN,
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15')
            },
            innovator: {
              id: '1',
              address: '0x123...',
              role: UserRole.INNOVATOR,
              name: 'Alice Chen',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01')
            },
            proposalCount: 5,
            viewCount: 234
          },
          {
            idea: {
              id: '2',
              tokenId: '2',
              contractAddress: '0x...',
              innovatorAddress: '0x456...',
              title: 'AI-Powered Smart Contract Auditor',
              description: 'An AI system that automatically audits smart contracts for vulnerabilities and suggests improvements.',
              category: 'infrastructure',
              tags: ['ai', 'security', 'smart-contracts'],
              imageUri: 'https://via.placeholder.com/400',
              metadataUri: 'ipfs://...',
              royaltyPercentage: 5,
              status: IdeaStatus.IN_PROGRESS,
              createdAt: new Date('2024-01-10'),
              updatedAt: new Date('2024-01-12')
            },
            innovator: {
              id: '2',
              address: '0x456...',
              role: UserRole.INNOVATOR,
              name: 'Bob Smith',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01')
            },
            proposalCount: 3,
            viewCount: 456
          }
        ])

        // Mock projects data
        setProjects([
          {
            project: {
              id: '1',
              tokenId: '1',
              contractAddress: '0x...',
              ideaNFTId: '1',
              executorAddress: '0x789...',
              innovatorAddress: '0x123...',
              title: 'Decentralized Task Management Platform',
              description: 'Building the MVP for a blockchain-based task management system.',
              milestones: [],
              equityPercentage: 95,
              status: ProjectStatus.ACTIVE,
              imageUri: 'https://via.placeholder.com/400',
              metadataUri: 'ipfs://...',
              createdAt: new Date('2024-01-20'),
              updatedAt: new Date('2024-01-25')
            },
            executor: {
              id: '3',
              address: '0x789...',
              role: UserRole.EXECUTOR,
              name: 'Charlie Dev',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01')
            },
            innovator: {
              id: '1',
              address: '0x123...',
              role: UserRole.INNOVATOR,
              name: 'Alice Chen',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01')
            },
            fundingGoal: '50000',
            currentFunding: '15000',
            investorCount: 3
          }
        ])
        setIsLoading(false)
      }, 1000)
    }

    loadData()
  }, [activeTab, searchQuery, selectedCategory, selectedStatus, sortBy])

  const handleTabChange = (tab: 'ideas' | 'projects') => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  const handleIdeaClick = (ideaId: string) => {
    navigate(`/idea/${ideaId}`)
  }

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`)
  }

  const handlePropose = (type: 'idea' | 'project', id: string) => {
    if (!isAuthenticated) {
      // Trigger wallet connection
      document.getElementById('connect-wallet-trigger')?.click()
      return
    }

    if (type === 'idea' && user?.role === UserRole.EXECUTOR) {
      navigate(`/proposal/executor/${id}`)
    } else if (type === 'project' && user?.role === UserRole.INVESTOR) {
      navigate(`/proposal/investor/${id}`)
    }
  }

  const renderIdeaCard = (item: MarketplaceIdea) => {
    const { idea, innovator, proposalCount, viewCount } = item

    return (
      <div key={idea.id} className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all">
        <div
          className="aspect-video bg-gray-200 dark:bg-gray-700 relative cursor-pointer"
          onClick={() => handleIdeaClick(idea.id)}
        >
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

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3
              className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => handleIdeaClick(idea.id)}
            >
              {idea.title}
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {idea.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {viewCount}
              </span>
              <span className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                {proposalCount}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {idea.category}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {innovator.name || `${innovator.address.slice(0, 6)}...`}
              </span>
            </div>

            {user?.role === UserRole.EXECUTOR && (
              <button
                onClick={() => handlePropose('idea', idea.id)}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                Propose
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderProjectCard = (item: MarketplaceProject) => {
    const { project, executor, fundingGoal, currentFunding, investorCount } = item
    const fundingPercentage = (parseFloat(currentFunding) / parseFloat(fundingGoal)) * 100

    return (
      <div key={project.id} className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all">
        <div
          className="aspect-video bg-gray-200 dark:bg-gray-700 relative cursor-pointer"
          onClick={() => handleProjectClick(project.id)}
        >
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

        <div className="p-5">
          <h3
            className="text-lg font-semibold text-gray-900 dark:text-white mb-3 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
            onClick={() => handleProjectClick(project.id)}
          >
            {project.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {project.description}
          </p>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Funding Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${parseInt(currentFunding).toLocaleString()} / ${parseInt(fundingGoal).toLocaleString()}
              </span>
            </div>
            <div className="milestone-progress">
              <div
                className="milestone-progress-bar"
                style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {investorCount} investors
              </span>
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {fundingPercentage.toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {executor.name || `${executor.address.slice(0, 6)}...`}
              </span>
            </div>

            {user?.role === UserRole.INVESTOR && (
              <button
                onClick={() => handlePropose('project', project.id)}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center"
              >
                Invest
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {activeTab === 'ideas'
              ? 'Browse innovative ideas looking for executors'
              : 'Discover projects seeking investment'
            }
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => handleTabChange('ideas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'ideas'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Ideas</span>
              </div>
            </button>
            <button
              onClick={() => handleTabChange('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'projects'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Projects</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="button-secondary flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              {(activeTab === 'ideas' ? sortOptions : projectSortOptions).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                <Grid className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                <List className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              {(activeTab === 'ideas' ? ideaStatuses : projectStatuses).map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}>
            {activeTab === 'ideas'
              ? ideas.map(renderIdeaCard)
              : projects.map(renderProjectCard)
            }
          </div>
        )}

        {/* Empty State */}
        {!isLoading && ((activeTab === 'ideas' && ideas.length === 0) || (activeTab === 'projects' && projects.length === 0)) && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'ideas' ? (
                <Sparkles className="w-8 h-8 text-gray-400" />
              ) : (
                <Briefcase className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No {activeTab} found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
