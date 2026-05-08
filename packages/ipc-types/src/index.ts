// ─── 通用 IPC 类型 ────────────────────────────────────────────────────────────

export interface IpcResult<T = void> {
  ok: boolean
  data?: T
  error?: string
}

// ─── 图片压缩 ─────────────────────────────────────────────────────────────────

export interface CompressImageOptions {
  quality: number        // 0~100
  maxWidth?: number
  maxHeight?: number
  outputFormat?: 'jpeg' | 'png' | 'webp'
}

export interface CompressImageResult {
  originalSize: number
  resultSize: number
  outputPath: string
}

// ─── 图片格式转换 ─────────────────────────────────────────────────────────────

export interface ConvertImageOptions {
  outputFormat: 'jpeg' | 'png' | 'webp' | 'avif'
  quality?: number
}

export interface ConvertImageResult {
  outputPath: string
  outputFormat: string
}

// ─── 字体压缩 ─────────────────────────────────────────────────────────────────

export interface CompressFontOptions {
  /** 需要保留的字符集，为空则保留全部 */
  glyphs?: string
  outputFormat?: 'woff2' | 'woff'
}

export interface CompressFontResult {
  originalSize: number
  resultSize: number
  outputPath: string
}

// ─── GIF 制作 ─────────────────────────────────────────────────────────────────

export interface MakeGifOptions {
  fps: number
  width?: number
  loop?: number   // 0 = 无限循环
}

export interface MakeGifResult {
  outputPath: string
  frameCount: number
  duration: number
}

// ─── IPC 频道名称常量 ─────────────────────────────────────────────────────────

export const IPC_CHANNELS = {
  COMPRESS_IMAGE: 'compress-image',
  CONVERT_IMAGE: 'convert-image',
  COMPRESS_FONT: 'compress-font',
  MAKE_GIF: 'make-gif',
  SAVE_FILE: 'save-file',
  OPEN_FILE_DIALOG: 'open-file-dialog',
  OPEN_SAVE_DIALOG: 'open-save-dialog',
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]
