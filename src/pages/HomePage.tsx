import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import {
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  Lightbulb,
  Rocket,
  Target,
  ArrowRight
} from 'lucide-react'
import ConnectWalletButton from '@/components/ConnectWalletButton'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const features = [
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'All transactions and agreements are recorded on-chain with smart contracts'
    },
    {
      icon: Zap,
      title: 'AI-Powered Tools',
      description: 'Executors get access to cutting-edge AI agents for development and marketing'
    },
    {
      icon: TrendingUp,
      title: 'Fair Equity Model',
      description: 'Clear royalty and equity distribution with milestone-based payouts'
    }
  ]

  const userRoles = [
    {
      role: UserRole.INNOVATOR,
      icon: Lightbulb,
      title: 'Innovators',
      description: 'Turn your ideas into NFTs and earn 5% lifetime royalties',
      benefits: [
        'Create idea NFTs for just $1 USDC',
        'Receive executor proposals',
        'Earn 5% lifetime royalties',
        'Track project progress'
      ],
      color: 'purple'
    },
    {
      role: UserRole.EXECUTOR,
      icon: Rocket,
      title: 'Executors',
      description: 'Build ideas into successful projects and earn 95% equity',
      benefits: [
        'Browse and propose on ideas',
        'Access AI development tools',
        'Manage project milestones',
        'Earn 95% project equity'
      ],
      color: 'blue'
    },
    {
      role: UserRole.INVESTOR,
      icon: Target,
      title: 'Investors',
      description: 'Fund promising projects with milestone-based investments',
      benefits: [
        'Browse fundable projects',
        'Set investment terms',
        'Track milestone progress',
        'Automated escrow payouts'
      ],
      color: 'green'
    }
  ]

  const stats = [
    { label: 'Ideas Created', value: '1,234' },
    { label: 'Active Projects', value: '456' },
    { label: 'Total Funded', value: '$2.3M' },
    { label: 'Success Rate', value: '78%' }
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Submit an Idea',
      description: 'Innovators create NFTs detailing their ideas with automatic 5% royalty rights'
    },
    {
      step: 2,
      title: 'Find an Executor',
      description: 'Executors browse ideas and submit proposals to turn them into projects'
    },
    {
      step: 3,
      title: 'Build the Project',
      description: 'Accepted executors use AI tools to develop, market, and prepare for funding'
    },
    {
      step: 4,
      title: 'Secure Funding',
      description: 'Investors browse projects and provide milestone-based funding through escrow'
    }
  ]

  const handleRoleSelect = (role: UserRole) => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      // Store intended role in session storage for after login
      sessionStorage.setItem('intendedRole', role)
      // Trigger wallet connection
      document.getElementById('connect-wallet-trigger')?.click()
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Turn Ideas into
              <span className="block gradient-text">Funded Reality</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The decentralized platform where innovators, executors, and investors collaborate
              to bring groundbreaking ideas to life through blockchain-powered agreements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="button-primary inline-flex items-center justify-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <ConnectWalletButton size="large" />
                  <Link
                    to="/marketplace"
                    className="button-secondary inline-flex items-center justify-center space-x-2"
                  >
                    <span>Browse Marketplace</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
            <div id="connect-wallet-trigger" className="hidden">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Built on Coinbase Developer Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Leveraging cutting-edge blockchain technology for secure, transparent collaboration
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Role
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join our ecosystem in the role that suits you best
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {userRoles.map((role, index) => (
              <div
                key={index}
                className={`rounded-xl border-2 border-${role.color}-200 dark:border-${role.color}-800 overflow-hidden hover:shadow-xl transition-all`}
              >
                <div className={`bg-${role.color}-50 dark:bg-${role.color}-900/20 p-6`}>
                  <div className={`w-16 h-16 bg-${role.color}-100 dark:bg-${role.color}-900/40 rounded-full flex items-center justify-center mb-4`}>
                    <role.icon className={`w-8 h-8 text-${role.color}-600 dark:text-${role.color}-400`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{role.description}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {role.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className={`w-5 h-5 text-${role.color}-600 dark:text-${role.color}-400 mr-2 flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleRoleSelect(role.role)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors
                      bg-${role.color}-600 hover:bg-${role.color}-700 text-white`}
                  >
                    Get Started as {role.title.slice(0, -1)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              From idea to funded project in four simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 dark:bg-gray-700 -translate-x-4"></div>
                )}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Ideas?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of innovators, executors, and investors building the future together
          </p>
          {!isAuthenticated && (
            <ConnectWalletButton size="large" variant="secondary" />
          )}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center space-x-2 bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
