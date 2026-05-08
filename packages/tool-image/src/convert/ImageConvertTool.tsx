import React, { useState, useCallback } from 'react'
import { ToolLayout, DropZone, FileList, Button } from '@pal/ui'
import type { FileItem } from '@pal/ui'
import { nanoid, downloadBytes } from '@pal/utils'

export interface ImageConvertToolProps {
  className?: string
}

type OutputFormat = 'jpeg' | 'png' | 'webp' | 'avif'

interface ConvertItem {
  id: string
  file: File
  status: 'pending' | 'processing' | 'done' | 'error'
  resultBlob?: Blob
  resultFilename?: string
  resultSize?: number
  error?: string
}

async function convertImage(file: File, format: OutputFormat, quality: number): Promise<{ blob: Blob; filename: string }> {
  const bitmap = await createImageBitmap(file)
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()
  const mimeType = `image/${format}`
  const blob = await canvas.convertToBlob({ type: mimeType, quality: quality / 100 })
  const baseName = file.name.replace(/\.[^.]+$/, '')
  return { blob, filename: `${baseName}.${format}` }
}

export function ImageConvertTool({ className }: ImageConvertToolProps) {
  const [items, setItems] = useState<ConvertItem[]>([])
  const [format, setFormat] = useState<OutputFormat>('webp')
  const [quality, setQuality] = useState(85)
  const [processing, setProcessing] = useState(false)

  const handleFiles = useCallback((files: File[]) => {
    setItems((prev) => [
      ...prev,
      ...files.map((f) => ({ id: nanoid(), file: f, status: 'pending' as const })),
    ])
  }, [])

  const handleRemove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const handleConvert = useCallback(async () => {
    if (processing) return
    setProcessing(true)
    for (const item of items) {
      if (item.status === 'done') continue
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: 'processing' } : i))
      try {
        const { blob, filename } = await convertImage(item.file, format, quality)
        setItems((prev) => prev.map((i) =>
          i.id === item.id ? { ...i, status: 'done', resultBlob: blob, resultFilename: filename, resultSize: blob.size } : i
        ))
      } catch (e) {
        setItems((prev) => prev.map((i) =>
          i.id === item.id ? { ...i, status: 'error', error: e instanceof Error ? e.message : '转换失败' } : i
        ))
      }
    }
    setProcessing(false)
  }, [items, format, quality, processing])

  const handleDownloadAll = useCallback(() => {
    items.forEach((i) => {
      if (i.resultBlob && i.resultFilename) {
        i.resultBlob.arrayBuffer().then((buf) => {
          downloadBytes(new Uint8Array(buf), i.resultFilename!, i.resultBlob!.type)
        })
      }
    })
  }, [items])

  const fileItems: FileItem[] = items.map((i) => ({
    id: i.id,
    name: i.file.name,
    size: i.file.size,
    status: i.status,
    resultSize: i.resultSize,
    error: i.error,
  }))

  const doneCount = items.filter((i) => i.status === 'done').length

  return (
    <ToolLayout title="图片格式转换" description="将图片批量转换为 JPEG / PNG / WebP / AVIF" className={className}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">目标格式</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as OutputFormat)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
              <option value="avif">AVIF</option>
            </select>
          </label>
          {format !== 'png' && (
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">质量 ({quality})</span>
              <input
                type="range" min={1} max={100} value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-40"
              />
            </label>
          )}
        </div>

        <DropZone accept="image/*" onFiles={handleFiles} className="h-40" />

        {items.length > 0 && (
          <>
            <FileList files={fileItems} onRemove={handleRemove} />
            <div className="flex gap-3">
              <Button onClick={handleConvert} disabled={processing}>
                {processing ? '转换中…' : '开始转换'}
              </Button>
              {doneCount > 0 && (
                <Button variant="secondary" onClick={handleDownloadAll}>
                  下载全部 ({doneCount})
                </Button>
              )}
              <Button variant="ghost" onClick={() => setItems([])}>清空</Button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
