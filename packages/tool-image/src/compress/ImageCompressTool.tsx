import React, { useState, useCallback } from 'react'
import { ToolLayout, DropZone, FileList, Button, ProgressBar } from '@pal/ui'
import type { FileItem } from '@pal/ui'
import { nanoid, formatBytes, calcSavingPercent, downloadBytes } from '@pal/utils'
import { compressImage } from './compress'
import type { CompressOptions, CompressFileItem } from './types'

export interface ImageCompressToolProps {
  className?: string
}

export function ImageCompressTool({ className }: ImageCompressToolProps) {
  const [files, setFiles] = useState<CompressFileItem[]>([])
  const [options, setOptions] = useState<CompressOptions>({ quality: 80, outputFormat: 'jpeg' })
  const [processing, setProcessing] = useState(false)

  const handleFiles = useCallback((incoming: File[]) => {
    const items: CompressFileItem[] = incoming.map((f) => ({
      id: nanoid(),
      file: f,
      status: 'pending',
    }))
    setFiles((prev) => [...prev, ...items])
  }, [])

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const handleCompress = useCallback(async () => {
    if (files.length === 0 || processing) return
    setProcessing(true)

    for (const item of files) {
      if (item.status === 'done') continue
      setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: 'processing' } : f))
      try {
        const result = await compressImage(item.file, options)
        setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: 'done', result } : f))
      } catch (e) {
        const error = e instanceof Error ? e.message : '压缩失败'
        setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: 'error', error } : f))
      }
    }

    setProcessing(false)
  }, [files, options, processing])

  const handleDownloadAll = useCallback(() => {
    files.forEach((f) => {
      if (f.result) {
        const arr = new Uint8Array(0) // placeholder — real impl reads blob
        f.result.blob.arrayBuffer().then((buf) => {
          downloadBytes(new Uint8Array(buf), f.result!.filename, f.result!.blob.type)
        })
      }
    })
  }, [files])

  const fileItems: FileItem[] = files.map((f) => ({
    id: f.id,
    name: f.file.name,
    size: f.file.size,
    status: f.status,
    resultSize: f.result?.resultSize,
    error: f.error,
  }))

  const doneCount = files.filter((f) => f.status === 'done').length
  const progress = files.length > 0 ? (doneCount / files.length) * 100 : 0

  return (
    <ToolLayout title="图片压缩" description="批量压缩 JPEG / PNG / WebP 图片，保留画质" className={className}>
      <div className="space-y-6">
        {/* 选项区 */}
        <div className="flex flex-wrap gap-4 items-end">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">质量 ({options.quality})</span>
            <input
              type="range" min={1} max={100} value={options.quality}
              onChange={(e) => setOptions((o) => ({ ...o, quality: Number(e.target.value) }))}
              className="w-40"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">输出格式</span>
            <select
              value={options.outputFormat ?? 'jpeg'}
              onChange={(e) => setOptions((o) => ({ ...o, outputFormat: e.target.value as CompressOptions['outputFormat'] }))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </label>
        </div>

        {/* 拖拽区 */}
        <DropZone accept="image/*" onFiles={handleFiles} className="h-40" />

        {/* 文件列表 */}
        {files.length > 0 && (
          <>
            <FileList files={fileItems} onRemove={handleRemove} />
            {processing && <ProgressBar value={progress} showLabel />}
            <div className="flex gap-3">
              <Button onClick={handleCompress} disabled={processing}>
                {processing ? '压缩中…' : '开始压缩'}
              </Button>
              {doneCount > 0 && (
                <Button variant="secondary" onClick={handleDownloadAll}>
                  下载全部 ({doneCount})
                </Button>
              )}
              <Button variant="ghost" onClick={() => setFiles([])}>清空</Button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
