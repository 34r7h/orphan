import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'


import {
  FileText,
  DollarSign,
  AlertCircle,
  Plus,
  Trash2,
  Send
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

interface ProposalPageProps {
  type: 'executor' | 'investor'
}

export default function ProposalPage({ type }: ProposalPageProps) {
  const { ideaId, projectId } = useParams()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [targetData, setTargetData] = useState<any>({})
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadTargetData = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        if (type === 'executor') {
          // Loading idea data for executor proposal
          setTargetData({
            id: ideaId,
            title: 'Decentralized Task Management Platform',
            description: 'A blockchain-based platform for managing tasks and projects with built-in payments and reputation system.',
            innovatorName: 'Alice Chen',
            category: 'defi',
            imageUri: 'https://via.placeholder.com/400'
          })
          
          setFormData({
            proposalTitle: '',
            proposalDescription: '',
            estimatedTimeline: 90,
            requestedEquity: 95,
            additionalTerms: '',
            milestones: [
              {
                id: '1',
                title: 'MVP Development',
                description: 'Build core functionality including task creation, assignment, and basic payment system',
                targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                verificationCriteria: ['Task creation works', 'Basic payment system functional'],
                reward: '25000'
              }
            ]
          })
        } else {
          // Loading project data for investor proposal
          setTargetData({
            id: projectId,
            title: 'AI-Powered Smart Contract Auditor',
            description: 'Building an AI system that automatically audits smart contracts for vulnerabilities.',
            executorName: 'Bob Builder',
            innovatorName: 'Alice Chen',
            category: 'ai',
            imageUri: 'https://via.placeholder.com/400',
            fundingGoal: '100000',
            currentFunding: '25000'
          })
          
          setFormData({
            proposalTitle: '',
            investmentAmount: '',
            requestedEquity: 15,
            payoutSchedule: [
              {
                id: '1',
                milestoneId: '1',
                amount: '5000',
                percentage: 20,
                conditions: ['MVP completion', 'User testing validation']
              }
            ],
            exitStrategy: '',
            additionalTerms: ''
          })
        }
        setIsLoading(false)
      }, 1000)
    }

    loadTargetData()
  }, [type, ideaId, projectId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }))
    }
  }

  const handleMilestoneChange = (index: number, field: string, value: any) => {
    const newMilestones = [...formData.milestones]
    newMilestones[index] = { ...newMilestones[index], [field]: value }
    setFormData((prev: any) => ({ ...prev, milestones: newMilestones }))
  }

  const addMilestone = () => {
    const newMilestone = {
      id: Date.now().toString(),
      title: '',
      description: '',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      verificationCriteria: [''],
      reward: ''
    }
    setFormData((prev: any) => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }))
  }

  const removeMilestone = (index: number) => {
    const newMilestones = formData.milestones.filter((_: any, i: number) => i !== index)
    setFormData((prev: any) => ({ ...prev, milestones: newMilestones }))
  }

  const handlePayoutScheduleChange = (index: number, field: string, value: any) => {
    const newPayoutSchedule = [...formData.payoutSchedule]
    newPayoutSchedule[index] = { ...newPayoutSchedule[index], [field]: value }
    setFormData((prev: any) => ({ ...prev, payoutSchedule: newPayoutSchedule }))
  }

  const addPayoutSchedule = () => {
    const newPayout = {
      id: Date.now().toString(),
      milestoneId: '',
      amount: '',
      percentage: 0,
      conditions: ['']
    }
    setFormData((prev: any) => ({
      ...prev,
      payoutSchedule: [...prev.payoutSchedule, newPayout]
    }))
  }

  const removePayoutSchedule = (index: number) => {
    const newPayoutSchedule = formData.payoutSchedule.filter((_: any, i: number) => i !== index)
    setFormData((prev: any) => ({ ...prev, payoutSchedule: newPayoutSchedule }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (type === 'executor') {
      if (!formData.proposalTitle.trim()) {
        newErrors.proposalTitle = 'Proposal title is required'
      }
      if (!formData.proposalDescription.trim()) {
        newErrors.proposalDescription = 'Proposal description is required'
      }
      if (formData.estimatedTimeline < 1) {
        newErrors.estimatedTimeline = 'Timeline must be at least 1 day'
      }
      if (formData.requestedEquity < 1 || formData.requestedEquity > 95) {
        newErrors.requestedEquity = 'Equity must be between 1% and 95%'
      }
      
      // Validate milestones
      formData.milestones.forEach((milestone: any, index: number) => {
        if (!milestone.title.trim()) {
          newErrors[`milestone_${index}_title`] = 'Milestone title is required'
        }
        if (!milestone.description.trim()) {
          newErrors[`milestone_${index}_description`] = 'Milestone description is required'
        }
        if (!milestone.reward || parseFloat(milestone.reward) <= 0) {
          newErrors[`milestone_${index}_reward`] = 'Valid reward amount is required'
        }
      })
    } else {
      if (!formData.proposalTitle.trim()) {
        newErrors.proposalTitle = 'Proposal title is required'
      }
      if (!formData.investmentAmount || parseFloat(formData.investmentAmount) <= 0) {
        newErrors.investmentAmount = 'Valid investment amount is required'
      }
      if (formData.requestedEquity < 1 || formData.requestedEquity > 50) {
        newErrors.requestedEquity = 'Equity must be between 1% and 50%'
      }
      
      // Validate payout schedule
      formData.payoutSchedule.forEach((payout: any, index: number) => {
        if (!payout.amount || parseFloat(payout.amount) <= 0) {
          newErrors[`payout_${index}_amount`] = 'Valid payout amount is required'
        }
        if (payout.percentage < 1 || payout.percentage > 100) {
          newErrors[`payout_${index}_percentage`] = 'Percentage must be between 1% and 100%'
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call to submit proposal
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate back to appropriate page
      if (type === 'executor') {
        navigate('/marketplace/ideas')
      } else {
        navigate('/marketplace/projects')
      }
    } catch (error) {
      console.error('Error submitting proposal:', error)
      setErrors(prev => ({ ...prev, submit: 'Failed to submit proposal. Please try again.' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFeeAmount = () => {
    if (type === 'executor') {
      return '5 USDC'
    } else {
      return '50 USDC'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 ${
              type === 'executor' 
                ? 'bg-blue-100 dark:bg-blue-900/20' 
                : 'bg-green-100 dark:bg-green-900/20'
              } rounded-lg flex items-center justify-center`}
            >
              <FileText className={`w-6 h-6 ${
                type === 'executor' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-green-600 dark:text-green-400'
              }`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {type === 'executor' ? 'Submit Executor Proposal' : 'Submit Investment Proposal'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {type === 'executor' 
                  ? 'Propose to turn this idea into a project and earn 95% equity'
                  : 'Propose investment terms and earn equity in this project'
                }
              </p>
            </div>
          </div>
          
          {/* Fee Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                Proposal Fee: {getFeeAmount()}
              </span>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              {type === 'executor' 
                ? 'Fee is waived if invited by the innovator'
                : 'Fee is waived if invited by the executor'
              }
            </p>
          </div>
        </div>

        {/* Target Information */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {type === 'executor' ? 'Idea Details' : 'Project Details'}
          </h3>
          
          <div className="flex space-x-4">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
              {targetData.imageUri && (
                <img
                  src={targetData.imageUri}
                  alt={targetData.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {targetData.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {targetData.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                {type === 'executor' ? (
                  <>
                    <span>Innovator: {targetData.innovatorName}</span>
                    <span>Category: {targetData.category}</span>
                  </>
                ) : (
                  <>
                    <span>Executor: {targetData.executorName}</span>
                    <span>Innovator: {targetData.innovatorName}</span>
                    <span>Funding Goal: ${parseInt(targetData.fundingGoal).toLocaleString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Proposal Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Proposal Info */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Proposal Details</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="proposalTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Proposal Title *
                </label>
                <input
                  type="text"
                  id="proposalTitle"
                  name="proposalTitle"
                  value={formData.proposalTitle}
                  onChange={handleInputChange}
                  className={`input-field ${errors.proposalTitle ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter a compelling title for your proposal"
                />
                {errors.proposalTitle && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.proposalTitle}</p>
                )}
              </div>

              <div>
                <label htmlFor="proposalDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Proposal Description *
                </label>
                <textarea
                  id="proposalDescription"
                  name="proposalDescription"
                  rows={4}
                  value={formData.proposalDescription}
                  onChange={handleInputChange}
                  className={`input-field ${errors.proposalDescription ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Describe your proposal in detail. What will you deliver? How will you achieve it?"
                />
                {errors.proposalDescription && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.proposalDescription}</p>
                )}
              </div>
            </div>
          </div>

          {/* Type-specific Fields */}
          {type === 'executor' ? (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Terms</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="estimatedTimeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimated Timeline (days) *
                  </label>
                  <input
                    type="number"
                    id="estimatedTimeline"
                    name="estimatedTimeline"
                    value={formData.estimatedTimeline}
                    onChange={handleInputChange}
                    min="1"
                    className={`input-field ${errors.estimatedTimeline ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.estimatedTimeline && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.estimatedTimeline}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="requestedEquity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requested Equity (%) *
                  </label>
                  <input
                    type="number"
                    id="requestedEquity"
                    name="requestedEquity"
                    value={formData.requestedEquity}
                    onChange={handleInputChange}
                    min="1"
                    max="95"
                    className={`input-field ${errors.requestedEquity ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.requestedEquity && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.requestedEquity}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment Terms</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Investment Amount (USDC) *
                  </label>
                  <input
                    type="number"
                    id="investmentAmount"
                    name="investmentAmount"
                    value={formData.investmentAmount}
                    onChange={handleInputChange}
                    min="1"
                    step="0.01"
                    className={`input-field ${errors.investmentAmount ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="1000"
                  />
                  {errors.investmentAmount && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.investmentAmount}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="requestedEquity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requested Equity (%) *
                  </label>
                  <input
                    type="number"
                    id="requestedEquity"
                    name="requestedEquity"
                    value={formData.requestedEquity}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
                    className={`input-field ${errors.requestedEquity ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.requestedEquity && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.requestedEquity}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Milestones (for executor proposals) */}
          {type === 'executor' && (
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Milestones</h3>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="button-secondary inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Milestone</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.milestones.map((milestone: any, index: number) => (
                  <div key={milestone.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Milestone {index + 1}</h4>
                      {formData.milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                          className={`input-field ${errors[`milestone_${index}_title`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="Milestone title"
                        />
                        {errors[`milestone_${index}_title`] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`milestone_${index}_title`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Target Date
                        </label>
                        <input
                          type="date"
                          value={milestone.targetDate.toISOString().split('T')[0]}
                          onChange={(e) => handleMilestoneChange(index, 'targetDate', new Date(e.target.value))}
                          className="input-field"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                        rows={3}
                        className={`input-field ${errors[`milestone_${index}_description`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Describe what will be delivered in this milestone"
                      />
                      {errors[`milestone_${index}_description`] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`milestone_${index}_description`]}</p>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reward (USDC) *
                      </label>
                      <input
                        type="number"
                        value={milestone.reward}
                        onChange={(e) => handleMilestoneChange(index, 'reward', e.target.value)}
                        min="0"
                        step="0.01"
                        className={`input-field ${errors[`milestone_${index}_reward`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="1000"
                      />
                      {errors[`milestone_${index}_reward`] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`milestone_${index}_reward`]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payout Schedule (for investor proposals) */}
          {type === 'investor' && (
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payout Schedule</h3>
                <button
                  type="button"
                  onClick={addPayoutSchedule}
                  className="button-secondary inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Payout</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.payoutSchedule.map((payout: any, index: number) => (
                  <div key={payout.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Payout {index + 1}</h4>
                      {formData.payoutSchedule.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePayoutSchedule(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Amount (USDC) *
                        </label>
                        <input
                          type="number"
                          value={payout.amount}
                          onChange={(e) => handlePayoutScheduleChange(index, 'amount', e.target.value)}
                          min="0"
                          step="0.01"
                          className={`input-field ${errors[`payout_${index}_amount`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="1000"
                        />
                        {errors[`payout_${index}_amount`] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`payout_${index}_amount`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Percentage *
                        </label>
                        <input
                          type="number"
                          value={payout.percentage}
                          onChange={(e) => handlePayoutScheduleChange(index, 'percentage', e.target.value)}
                          min="1"
                          max="100"
                          className={`input-field ${errors[`payout_${index}_percentage`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="20"
                        />
                        {errors[`payout_${index}_percentage`] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`payout_${index}_percentage`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Conditions
                        </label>
                        <input
                          type="text"
                          value={payout.conditions.join(', ')}
                          onChange={(e) => handlePayoutScheduleChange(index, 'conditions', e.target.value.split(',').map(s => s.trim()))}
                          className="input-field"
                          placeholder="MVP completion, User testing"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Terms */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Terms</h3>
            
            <div>
              <label htmlFor="additionalTerms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Terms & Conditions
              </label>
              <textarea
                id="additionalTerms"
                name="additionalTerms"
                rows={4}
                value={formData.additionalTerms}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Any additional terms, conditions, or special requirements..."
              />
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="button-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="button-primary inline-flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Proposal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
