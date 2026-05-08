import { CompressOptions, CompressResult } from './types'

/**
 * 使用 Canvas / OffscreenCanvas 在浏览器端压缩图片
 */
export async function compressImage(file: File, options: CompressOptions): Promise<CompressResult> {
  const { quality, maxWidth, maxHeight, outputFormat } = options
  const mimeType = outputFormat ? `image/${outputFormat}` : (file.type || 'image/jpeg')

  const bitmap = await createImageBitmap(file)
  let { width, height } = bitmap

  if (maxWidth && width > maxWidth) {
    height = Math.round((height * maxWidth) / width)
    width = maxWidth
  }
  if (maxHeight && height > maxHeight) {
    width = Math.round((width * maxHeight) / height)
    height = maxHeight
  }

  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2d context')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await canvas.convertToBlob({ type: mimeType, quality: quality / 100 })
  const ext = mimeType.split('/')[1] ?? 'jpg'
  const baseName = file.name.replace(/\.[^.]+$/, '')

  return {
    blob,
    originalSize: file.size,
    resultSize: blob.size,
    filename: `${baseName}_compressed.${ext}`,
  }
}
