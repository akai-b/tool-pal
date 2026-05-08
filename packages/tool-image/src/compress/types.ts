export interface CompressOptions {
  quality: number        // 1~100
  maxWidth?: number
  maxHeight?: number
  outputFormat?: 'jpeg' | 'png' | 'webp'
}

export interface CompressResult {
  blob: Blob
  originalSize: number
  resultSize: number
  filename: string
}

export interface CompressFileItem {
  id: string
  file: File
  status: 'pending' | 'processing' | 'done' | 'error'
  result?: CompressResult
  error?: string
}
