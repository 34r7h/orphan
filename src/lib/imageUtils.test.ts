/**
 * Simple tests for image utilities
 * Note: These are basic tests that can be run in the browser console
 */

import { validateImageFile, processImageFile, compressImage } from './imageUtils'

// Mock File object for testing
function createMockFile(content: string, name: string, type: string): File {
  const blob = new Blob([content], { type })
  return new File([blob], name, { type })
}

// Test validation function
export function testImageValidation() {
  console.log('Testing image validation...')
  
  // Test valid image
  const validImage = createMockFile('fake-image-data', 'test.jpg', 'image/jpeg')
  const validResult = validateImageFile(validImage)
  console.log('Valid image test:', validResult.isValid ? 'PASS' : 'FAIL')
  
  // Test invalid file type
  const invalidType = createMockFile('fake-data', 'test.txt', 'text/plain')
  const invalidTypeResult = validateImageFile(invalidType)
  console.log('Invalid type test:', !invalidTypeResult.isValid ? 'PASS' : 'FAIL')
  
  // Test large file
  const largeImage = createMockFile('x'.repeat(6 * 1024 * 1024), 'large.jpg', 'image/jpeg')
  const largeResult = validateImageFile(largeImage)
  console.log('Large file test:', !largeResult.isValid ? 'PASS' : 'FAIL')
  
  // Test invalid extension
  const invalidExt = createMockFile('fake-data', 'test.bmp', 'image/bmp')
  const invalidExtResult = validateImageFile(invalidExt)
  console.log('Invalid extension test:', !invalidExtResult.isValid ? 'PASS' : 'FAIL')
}

// Test image processing (requires actual image data)
export async function testImageProcessing() {
  console.log('Testing image processing...')
  
  try {
    // Create a simple canvas-based image for testing
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'red'
      ctx.fillRect(0, 0, 100, 100)
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, 'image/jpeg')
      })
      
      const file = new File([blob], 'test.jpg', { type: 'image/jpeg' })
      
      // Test processing
      const processed = await processImageFile(file)
      console.log('Image processing test:', processed ? 'PASS' : 'FAIL')
      console.log('Processed image:', processed)
      
      // Test compression
      const compressed = await compressImage(processed.dataUrl, 50, 50, 0.5)
      console.log('Image compression test:', compressed ? 'PASS' : 'FAIL')
      console.log('Compressed size:', compressed.length)
      
    } else {
      console.log('Canvas context not available')
    }
  } catch (error) {
    console.error('Image processing test failed:', error)
  }
}

// Run all tests
export function runAllTests() {
  console.log('=== Running Image Utils Tests ===')
  testImageValidation()
  testImageProcessing().then(() => {
    console.log('=== Tests Complete ===')
  })
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testImageUtils = {
    testImageValidation,
    testImageProcessing,
    runAllTests
  }
}
