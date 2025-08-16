import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole, ProjectStatus, FundingStatus } from '@/types'
import {
  Briefcase,
  Calendar,
  MapPin,
  Eye,
  ArrowLeft,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Copy,
  Share2,
  MessageSquare
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<any>(null)
  const [investorProposals, setInvestorProposals] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const loadProjectData = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const mockProject = {
          id: id,
          tokenId: '1',
          contractAddress: '0xabcdef1234567890...',
          ideaNFTId: '1',
          executorAddress: '0x789...',
          innovatorAddress: '0x123...',
          title: 'AI-Powered Smart Contract Auditor',
          description: 'Building an AI system that automatically audits smart contracts for vulnerabilities and suggests improvements. This project will revolutionize smart contract security by providing automated, comprehensive auditing capabilities.',
          milestones: [
            {
              id: '1',
              title: 'AI Model Development',
              description: 'Develop the core AI model for smart contract analysis',
              targetDate: new Date('2024-03-15'),
              completedDate: new Date('2024-02-28'),
              status: 'completed',
              verificationCriteria: ['Model accuracy > 90%', 'Test coverage > 95%'],
              reward: '25000'
            },
            {
              id: '2',
              title: 'Security Audit Completion',
              description: 'Complete comprehensive security audit of the AI system',
              targetDate: new Date('2024-04-01'),
              completedDate: null,
              status: 'in_progress',
              verificationCriteria: ['External audit completed', 'Vulnerabilities addressed'],
              reward: '30000'
            },
            {
              id: '3',
              title: 'Beta Testing & Launch',
              description: 'Launch beta version and gather user feedback',
              targetDate: new Date('2024-05-01'),
              completedDate: null,
              status: 'pending',
              verificationCriteria: ['Beta users > 100', 'User satisfaction > 4.5/5'],
              reward: '20000'
            }
          ],
          equityPercentage: 95,
          status: ProjectStatus.ACTIVE,
          imageUri: 'https://via.placeholder.com/800x400',
          metadataUri: 'ipfs://Qm...',
          createdAt: new Date('2024-01-25'),
          updatedAt: new Date('2024-02-28'),
          executor: {
            name: 'Bob Builder',
            avatar: 'https://via.placeholder.com/150',
            bio: 'Experienced developer specializing in AI and blockchain security',
            location: 'Austin, TX',
            website: 'https://bobbuilder.dev',
            twitter: '@bobbuilder',
            linkedin: 'bobbuilder'
          },
          innovator: {
            name: 'Alice Chen',
            avatar: 'https://via.placeholder.com/150',
            bio: 'Passionate innovator building the future of decentralized applications'
          },
          funding: {
            goal: '100000',
            current: '25000',
            investorCount: 2,
            status: FundingStatus.SEEKING
          },
          stats: {
            viewCount: 856,
            proposalCount: 3,
            shareCount: 45,
            bookmarkCount: 89
          }
        }

        const mockInvestorProposals = [
          {
            id: '1',
            investorName: 'David Investor',
            investorAvatar: 'https://via.placeholder.com/150',
            proposalTitle: 'Strategic investment for AI security platform',
            investmentAmount: '25000',
            requestedEquity: 15,
            terms: {
              payoutSchedule: [
                {
                  milestoneId: '2',
                  amount: '15000',
                  percentage: 60,
                  conditions: ['Security audit completion', 'External validation']
                },
                {
                  milestoneId: '3',
                  amount: '10000',
                  percentage: 40,
                  conditions: ['Beta launch', 'User feedback collection']
                }
              ],
              exitStrategy: 'IPO or acquisition within 3 years',
              additionalTerms: 'Board observer rights, monthly progress reports'
            },
            status: 'pending',
            createdAt: new Date('2024-02-20'),
            portfolio: {
              completedInvestments: 8,
              totalValue: '450000',
              rating: 4.7
            }
          }
        ]

        setProject(mockProject)
        setInvestorProposals(mockInvestorProposals)
        setIsLoading(false)
      }, 1000)
    }

    loadProjectData()
  }, [id])

  const handleInvest = () => {
    if (!isAuthenticated) {
      // Trigger wallet connection
      document.getElementById('connect-wallet-trigger')?.click()
      return
    }

    if (user?.role === UserRole.INVESTOR) {
      navigate(`/proposal/investor/${id}`)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: project.title,
        text: project.description,
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
    await navigator.clipboard.writeText(project.contractAddress)
    // Show toast notification
    alert('Contract address copied!')
  }

  const getProgressPercentage = () => {
    const completedMilestones = project.milestones.filter((m: any) => m.status === 'completed').length
    return Math.round((completedMilestones / project.milestones.length) * 100)
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Description */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Description</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Progress Overview */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Progress</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">{getProgressPercentage()}%</span>
          </div>
          <div className="milestone-progress">
            <div
              className="milestone-progress-bar"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {project.milestones.filter((m: any) => m.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {project.milestones.filter((m: any) => m.status === 'in_progress').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {project.milestones.filter((m: any) => m.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          </div>
        </div>
      </div>

      {/* Funding Status */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Funding Status</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Funding Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${parseInt(project.funding.current).toLocaleString()} / ${parseInt(project.funding.goal).toLocaleString()}
            </span>
          </div>
          <div className="milestone-progress">
            <div
              className="milestone-progress-bar"
              style={{ width: `${(parseInt(project.funding.current) / parseInt(project.funding.goal)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${parseInt(project.funding.current).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Raised</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {project.funding.investorCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Investors</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {project.equityPercentage}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Executor Equity</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMilestonesTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Milestones</h3>
      
      <div className="space-y-4">
        {project.milestones.map((milestone: any, index: number) => (
          <div key={milestone.id} className="glass-card rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  milestone.status === 'completed' 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : milestone.status === 'in_progress'
                    ? 'bg-blue-100 dark:bg-blue-900/20'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {milestone.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : milestone.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {index + 1}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {milestone.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due: {milestone.targetDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`status-badge ${
                  milestone.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : milestone.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {milestone.status.replace('_', ' ')}
                </span>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  ${parseInt(milestone.reward).toLocaleString()}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {milestone.description}
            </p>
            
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Verification Criteria</h5>
              <ul className="space-y-1">
                {milestone.verificationCriteria.map((criteria: string, idx: number) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    {criteria}
                  </li>
                ))}
              </ul>
            </div>
            
            {milestone.completedDate && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Completed: {milestone.completedDate.toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderInvestorProposalsTab = () => (
    <div className="space-y-6">
      {/* Proposals Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Investor Proposals ({investorProposals.length})
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Review proposals from investors interested in funding this project
          </p>
        </div>
        
        {user?.role === UserRole.INVESTOR && (
          <button
            onClick={handleInvest}
            className="button-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Investment</span>
          </button>
        )}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {investorProposals.map((proposal) => (
          <div key={proposal.id} className="glass-card rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
                {proposal.investorAvatar && (
                  <img
                    src={proposal.investorAvatar}
                    alt={proposal.investorName}
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
                      By {proposal.investorName}
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Investment</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${parseInt(proposal.investmentAmount).toLocaleString()}
                    </p>
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
                
                <div className="mb-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Payout Schedule</h5>
                  <div className="space-y-2">
                    {proposal.terms.payoutSchedule.map((payout: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {payout.percentage}% (${parseInt(payout.amount).toLocaleString()})
                        </span>
                        <span className="text-gray-500 dark:text-gray-500">
                          {payout.conditions.join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Portfolio: {proposal.portfolio.completedInvestments} investments</span>
                    <span>Total Value: ${parseInt(proposal.portfolio.totalValue).toLocaleString()}</span>
                  </div>
                  
                  {user?.role === UserRole.EXECUTOR && proposal.status === 'pending' && (
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

  const renderTeamTab = () => (
    <div className="space-y-6">
      {/* Executor */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Executor</h3>
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
            {project.executor.avatar && (
              <img
                src={project.executor.avatar}
                alt={project.executor.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {project.executor.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {project.executor.bio}
            </p>
            
            <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              {project.executor.location && (
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {project.executor.location}
                </span>
              )}
              {project.executor.website && (
                <a
                  href={project.executor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Website
                </a>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {project.equityPercentage}% Equity
            </span>
          </div>
        </div>
      </div>

      {/* Innovator */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Original Innovator</h3>
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
            {project.innovator.avatar && (
              <img
                src={project.innovator.avatar}
                alt={project.innovator.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {project.innovator.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {project.innovator.bio}
            </p>
          </div>
          
          <div className="text-right">
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              5% Royalties
            </span>
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

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Project Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The project you're looking for doesn't exist or has been removed.
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
                {project.title}
              </h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Started {project.createdAt.toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {project.stats.viewCount} views
                </span>
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {project.stats.proposalCount} proposals
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
              
              {user?.role === UserRole.INVESTOR && (
                <button
                  onClick={handleInvest}
                  className="button-primary inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Invest</span>
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
                {project.imageUri && (
                  <img
                    src={project.imageUri}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="flex space-x-8">
                {['overview', 'milestones', 'investors', 'team'].map((tab) => (
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
            {activeTab === 'milestones' && renderMilestonesTab()}
            {activeTab === 'investors' && renderInvestorProposalsTab()}
            {activeTab === 'team' && renderTeamTab()}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Status</h3>
                  <span className="status-badge status-badge-project">
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{getProgressPercentage()}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Funding</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.funding.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Milestones</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.milestones.length}</span>
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
                      {project.contractAddress}
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
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{project.tokenId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Metadata URI</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 break-all">{project.metadataUri}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {user?.role === UserRole.INVESTOR && (
                  <button
                    onClick={handleInvest}
                    className="w-full button-primary"
                  >
                    Invest in Project
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="w-full button-secondary"
                >
                  Share Project
                </button>
                <button
                  onClick={() => navigate(`/profile/${project.executorAddress}`)}
                  className="w-full button-secondary"
                >
                  View Executor Profile
                </button>
                <button
                  onClick={() => navigate(`/profile/${project.innovatorAddress}`)}
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
