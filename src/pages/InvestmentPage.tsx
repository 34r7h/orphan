import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FundingStatus } from '@/types'
import {
  DollarSign,
  Calendar,
  Target,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  Share2,
  ExternalLink,
  MapPin
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function InvestmentPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [investment, setInvestment] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const loadInvestmentData = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const mockInvestment = {
          id: id,
          tokenId: '1',
          contractAddress: '0x9876543210fedcba...',
          projectNFTId: '1',
          investorAddress: '0x456...',
          executorAddress: '0x789...',
          investmentAmount: '15000',
          equityPercentage: 10,
          terms: {
            payoutSchedule: [
              {
                milestoneId: '1',
                amount: '7500',
                percentage: 50,
                conditions: ['MVP completion', 'User testing validation'],
                status: 'completed',
                completedDate: new Date('2024-02-15'),
                payoutDate: new Date('2024-02-20')
              },
              {
                milestoneId: '2',
                amount: '7500',
                percentage: 50,
                conditions: ['Security audit completion', 'External validation'],
                status: 'pending',
                completedDate: null,
                payoutDate: null
              }
            ],
            milestoneRequirements: [
              'MVP must be functional and tested',
              'Security audit must pass external validation',
              'User feedback must be positive (>4.0/5 rating)'
            ],
            exitStrategy: 'IPO or acquisition within 3 years, or buyback option',
            additionalTerms: 'Monthly progress reports, quarterly investor calls'
          },
          escrowAddress: '0xescrow1234567890...',
          status: FundingStatus.FUNDED,
          metadataUri: 'ipfs://Qm...',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-02-20'),
          project: {
            title: 'Decentralized Task Management Platform',
            description: 'A blockchain-based platform for managing tasks and projects with built-in payments and reputation system.',
            imageUri: 'https://via.placeholder.com/800x400',
            status: 'active',
            progress: 45,
            nextMilestone: 'Security audit completion',
            nextMilestoneDate: new Date('2024-03-15')
          },
          executor: {
            name: 'Charlie Dev',
            avatar: 'https://via.placeholder.com/150',
            bio: 'Experienced full-stack developer with 5+ years in DeFi',
            location: 'Seattle, WA',
            website: 'https://charliedev.dev'
          },
          innovator: {
            name: 'Alice Chen',
            avatar: 'https://via.placeholder.com/150',
            bio: 'Passionate innovator building the future of decentralized applications'
          },
          stats: {
            totalInvested: '15000',
            currentValue: '16500',
            roi: 10,
            payoutsReceived: '7500',
            pendingPayouts: '7500'
          }
        }

        setInvestment(mockInvestment)
        setIsLoading(false)
      }, 1000)
    }

    loadInvestmentData()
  }, [id])

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Investment in ${investment.project.title}`,
        text: `I invested $${parseInt(investment.investmentAmount).toLocaleString()} in this project`,
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
    await navigator.clipboard.writeText(investment.contractAddress)
    // Show toast notification
    alert('Contract address copied!')
  }

  const getProgressPercentage = () => {
    const completedPayouts = investment.terms.payoutSchedule.filter((p: any) => p.status === 'completed').length
    return Math.round((completedPayouts / investment.terms.payoutSchedule.length) * 100)
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Investment Summary */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${parseInt(investment.investmentAmount).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Invested</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {investment.equityPercentage}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Equity Owned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {investment.stats.roi}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">ROI</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              ${parseInt(investment.stats.currentValue).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Value</p>
          </div>
        </div>
      </div>

      {/* Project Progress */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Progress</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">{investment.project.progress}%</span>
          </div>
          <div className="milestone-progress">
            <div
              className="milestone-progress-bar"
              style={{ width: `${investment.project.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Next Milestone</h4>
            <p className="text-gray-600 dark:text-gray-400">{investment.project.nextMilestone}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Target Date</h4>
            <p className="text-gray-600 dark:text-gray-400">
              {investment.project.nextMilestoneDate.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Payout Progress */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payout Progress</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Payout Progress</span>
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
              ${parseInt(investment.stats.payoutsReceived).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Received</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              ${parseInt(investment.stats.pendingPayouts).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {investment.terms.payoutSchedule.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Payouts</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPayoutsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payout Schedule</h3>
      
      <div className="space-y-4">
        {investment.terms.payoutSchedule.map((payout: any, index: number) => (
          <div key={payout.milestoneId} className="glass-card rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  payout.status === 'completed' 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : 'bg-yellow-100 dark:bg-yellow-900/20'
                }`}>
                  {payout.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Payout {index + 1}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {payout.percentage}% of total investment
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`status-badge ${
                  payout.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {payout.status}
                </span>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  ${parseInt(payout.amount).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Conditions</h5>
              <ul className="space-y-1">
                {payout.conditions.map((condition: string, idx: number) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      payout.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                    }`}></div>
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
            
            {payout.status === 'completed' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Completed: {payout.completedDate.toLocaleDateString()}</span>
                <span>Paid: {payout.payoutDate.toLocaleDateString()}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderTermsTab = () => (
    <div className="space-y-6">
      {/* Investment Terms */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment Terms</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Milestone Requirements</h4>
            <ul className="space-y-2">
              {investment.terms.milestoneRequirements.map((requirement: string, index: number) => (
                <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Exit Strategy</h4>
            <p className="text-gray-600 dark:text-gray-400">{investment.terms.exitStrategy}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Additional Terms</h4>
            <p className="text-gray-600 dark:text-gray-400">{investment.terms.additionalTerms}</p>
          </div>
        </div>
      </div>

      {/* Escrow Information */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Escrow Information</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Escrow Address</p>
            <div className="flex items-center space-x-2">
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1 truncate">
                {investment.escrowAddress}
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Escrow Status</p>
            <span className="status-badge bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Active
            </span>
          </div>
        </div>
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
            {investment.executor.avatar && (
              <img
                src={investment.executor.avatar}
                alt={investment.executor.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {investment.executor.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {investment.executor.bio}
            </p>
            
            <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              {investment.executor.location && (
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {investment.executor.location}
                </span>
              )}
              {investment.executor.website && (
                <a
                  href={investment.executor.website}
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
        </div>
      </div>

      {/* Innovator */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Original Innovator</h3>
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
            {investment.innovator.avatar && (
              <img
                src={investment.innovator.avatar}
                alt={investment.innovator.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {investment.innovator.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {investment.innovator.bio}
            </p>
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

  if (!investment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Investment Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The investment you're looking for doesn't exist or has been removed.
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
                Investment in {investment.project.title}
              </h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Invested {investment.createdAt.toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  ${parseInt(investment.investmentAmount).toLocaleString()}
                </span>
                <span className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  {investment.equityPercentage}% equity
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Project Image */}
            <div className="glass-card rounded-xl overflow-hidden mb-8">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                {investment.project.imageUri && (
                  <img
                    src={investment.project.imageUri}
                    alt={investment.project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="flex space-x-8">
                {['overview', 'payouts', 'terms', 'team'].map((tab) => (
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
            {activeTab === 'payouts' && renderPayoutsTab()}
            {activeTab === 'terms' && renderTermsTab()}
            {activeTab === 'team' && renderTeamTab()}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Investment Status */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Status</h3>
                  <span className={`status-badge status-badge-${investment.status === FundingStatus.FUNDED ? 'funded' : 'project'}`}>
                    {investment.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Investment Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {investment.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Project Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{investment.project.progress}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Payout Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{getProgressPercentage()}%</span>
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
                      {investment.contractAddress}
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
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{investment.tokenId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Metadata URI</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 break-all">{investment.metadataUri}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleShare}
                  className="w-full button-secondary"
                >
                  Share Investment
                </button>
                <button
                  onClick={() => navigate(`/project/${investment.projectNFTId}`)}
                  className="w-full button-secondary"
                >
                  View Project
                </button>
                <button
                  onClick={() => navigate(`/profile/${investment.executorAddress}`)}
                  className="w-full button-secondary"
                >
                  View Executor Profile
                </button>
                <button
                  onClick={() => navigate(`/profile/${investment.innovatorAddress}`)}
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
