/**
 * Image utility functions for handling avatar uploads and processing
 */

export interface ImageValidationResult {
  isValid: boolean
  error?: string
}

export interface ProcessedImage {
  dataUrl: string
  fileSize: number
  dimensions: { width: number; height: number }
}

/**
 * Validates an image file
 */
export function validateImageFile(file: File): ImageValidationResult {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'File must be an image'
    }
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image file size must be less than 5MB'
    }
  }

  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const fileName = file.name.toLowerCase()
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: 'Image must be JPG, PNG, GIF, or WebP format'
    }
  }

  return { isValid: true }
}

/**
 * Processes an image file and converts it to a data URL
 */
export function processImageFile(file: File): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      
      // Create an image element to get dimensions
      const img = new Image()
      img.onload = () => {
        resolve({
          dataUrl,
          fileSize: file.size,
          dimensions: {
            width: img.width,
            height: img.height
          }
        })
      }
      img.onerror = () => {
        reject(new Error('Failed to load image for dimension calculation'))
      }
      img.src = dataUrl
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Compresses an image data URL to reduce file size
 */
export function compressImage(
  dataUrl: string, 
  maxWidth: number = 400, 
  maxHeight: number = 400,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      
      resolve(compressedDataUrl)
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image for compression'))
    }
    
    img.src = dataUrl
  })
}

/**
 * Converts a data URL to a Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new Blob([u8arr], { type: mime })
}

/**
 * Generates a placeholder avatar with initials
 */
export function generatePlaceholderAvatar(name: string, size: number = 100): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    return ''
  }
  
  canvas.width = size
  canvas.height = size
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, '#667eea')
  gradient.addColorStop(1, '#764ba2')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  
  // Text
  ctx.fillStyle = 'white'
  ctx.font = `bold ${size * 0.4}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Get initials from name
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  ctx.fillText(initials, size / 2, size / 2)
  
  return canvas.toDataURL()
}
