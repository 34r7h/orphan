import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import {
  Lightbulb,
  Image as ImageIcon,
  Upload,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function CreateIdeaPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    imageFile: null as File | null,
    imagePreview: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = [
    { value: 'defi', label: 'DeFi' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'social', label: 'Social' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'nft', label: 'NFT' },
    { value: 'dao', label: 'DAO' },
    { value: 'ai', label: 'AI/ML' },
    { value: 'other', label: 'Other' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, imageFile: 'Image must be less than 5MB' }))
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
      setErrors(prev => ({ ...prev, imageFile: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one tag is required'
    }
    if (!formData.imageFile) {
      newErrors.imageFile = 'Image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call to CDP for NFT creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate to the created idea
      navigate('/dashboard/innovator')
    } catch (error) {
      console.error('Error creating idea:', error)
      setErrors(prev => ({ ...prev, submit: 'Failed to create idea. Please try again.' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (user?.role !== UserRole.INNOVATOR) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Only innovators can create ideas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create New Idea
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Turn your innovative concept into an NFT and start earning royalties
              </p>
            </div>
          </div>
          
          {/* Cost Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                Cost: $1 USDC + gas fees
              </span>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              You'll earn 5% lifetime royalties on all future revenue from this idea
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idea Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter a compelling title for your idea"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleInputChange}
              className={`input-field ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Describe your idea in detail. What problem does it solve? How does it work?"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`input-field ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags *
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className={`input-field ${errors.tags ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter tags separated by commas"
              />
              {errors.tags && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tags}</p>
            )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idea Image *
            </label>
            <div className="space-y-4">
              {formData.imagePreview ? (
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imageFile: null, imagePreview: '' }))}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      Upload an image that represents your idea
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="button-secondary inline-flex items-center space-x-2 mt-4 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose Image</span>
                  </label>
                </div>
              )}
              {errors.imageFile && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.imageFile}</p>
              )}
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

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/innovator')}
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
                  <span>Creating Idea...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Create Idea NFT</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
