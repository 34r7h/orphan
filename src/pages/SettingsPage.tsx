import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      bio: '',
      location: '',
      website: '',
      twitter: '',
      linkedin: '',
      github: ''
    },
    notifications: {
      email: true,
      inApp: true,
      proposalReceived: true,
      proposalAccepted: true,
      milestoneCompleted: true,
      paymentReceived: true,
      investmentReceived: true
    },
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      currency: 'USD'
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 24,
      requirePasswordForChanges: true
    }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          name: user.name || '',
          bio: user.bio || '',
          location: user.location || '',
          website: user.website || '',
          twitter: user.twitter || '',
          linkedin: user.linkedin || '',
          github: user.github || ''
        }
      }))
    }
  }, [user])

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
    
    if (errors[`${section}_${field}`]) {
      setErrors(prev => ({ ...prev, [`${section}_${field}`]: '' }))
    }
  }

  const validateProfile = () => {
    const newErrors: Record<string, string> = {}
    
    if (!settings.profile.name.trim()) {
      newErrors.profile_name = 'Name is required'
    }
    
    if (settings.profile.website && !isValidUrl(settings.profile.website)) {
      newErrors.profile_website = 'Please enter a valid URL'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSave = async (section: string) => {
    if (section === 'profile' && !validateProfile()) {
      return
    }
    
    setIsSaving(true)
    
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setErrors(prev => ({ ...prev, submit: 'Failed to save settings. Please try again.' }))
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
              className={`input-field ${errors.profile_name ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Your full name"
            />
            {errors.profile_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.profile_name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={settings.profile.location}
              onChange={(e) => handleInputChange('profile', 'location', e.target.value)}
              className="input-field"
              placeholder="City, Country"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={settings.profile.bio}
            onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
            rows={4}
            className="input-field"
            placeholder="Tell us about yourself..."
          />
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Social Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                value={settings.profile.website}
                onChange={(e) => handleInputChange('profile', 'website', e.target.value)}
                className={`input-field ${errors.profile_website ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="https://yourwebsite.com"
              />
              {errors.profile_website && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.profile_website}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter
              </label>
              <input
                type="text"
                value={settings.profile.twitter}
                onChange={(e) => handleInputChange('profile', 'twitter', e.target.value)}
                className="input-field"
                placeholder="@username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                LinkedIn
              </label>
              <input
                type="text"
                value={settings.profile.linkedin}
                onChange={(e) => handleInputChange('profile', 'linkedin', e.target.value)}
                className="input-field"
                placeholder="username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub
              </label>
              <input
                type="text"
                value={settings.profile.github}
                onChange={(e) => handleInputChange('profile', 'github', e.target.value)}
                className="input-field"
                placeholder="username"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleSave('profile')}
            disabled={isSaving}
            className="button-primary inline-flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="small" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Notification Channels</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-300">Email notifications</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.inApp}
                  onChange={(e) => handleInputChange('notifications', 'inApp', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-300">In-app notifications</span>
              </label>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Notification Types</h4>
            <div className="space-y-3">
              {Object.entries(settings.notifications)
                .filter(([key]) => !['email', 'inApp'].includes(key))
                .map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleSave('notifications')}
            disabled={isSaving}
            className="button-primary inline-flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="small" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Notifications</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <select
              value={settings.preferences.theme}
              onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
              className="input-field"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={settings.preferences.language}
              onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
              className="input-field"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
              className="input-field"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="GMT">GMT</option>
              <option value="JST">Japan Time</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <select
              value={settings.preferences.currency}
              onChange={(e) => handleInputChange('preferences', 'currency', e.target.value)}
              className="input-field"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleSave('preferences')}
            disabled={isSaving}
            className="button-primary inline-flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="small" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Two-Factor Authentication</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => handleInputChange('security', 'twoFactorEnabled', !settings.security.twoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.security.twoFactorEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Session Management</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Timeout (hours)
                </label>
                <select
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="input-field"
                >
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={168}>1 week</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password for Changes
                </label>
                <button
                  onClick={() => handleInputChange('security', 'requirePasswordForChanges', !settings.security.requirePasswordForChanges)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.security.requirePasswordForChanges ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.security.requirePasswordForChanges ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleSave('security')}
            disabled={isSaving}
            className="button-primary inline-flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="small" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Security</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Management</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Wallet Information</h4>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Connected Wallet</p>
              <p className="font-mono text-sm text-gray-900 dark:text-white">
                {user?.address || 'Not connected'}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Danger Zone</h4>
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-red-800 dark:text-red-200">Delete Account</h5>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button className="button-secondary text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-800">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className="button-secondary text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your account preferences and settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-200">{successMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Error */}
      {errors.submit && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-800 dark:text-red-200">{errors.submit}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'preferences', label: 'Preferences', icon: Palette },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'account', label: 'Account', icon: Key }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content - Tab Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'account' && renderAccountTab()}
          </div>
        </div>
      </div>
    </div>
  )
}
