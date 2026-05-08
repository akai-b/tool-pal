import React, { useState, useCallback } from 'react'
import { ToolLayout, DropZone, FileList, Button } from '@pal/ui'
import type { FileItem } from '@pal/ui'
import { nanoid, downloadBytes } from '@pal/utils'

export interface GifMakerToolProps {
  className?: string
}

interface FrameItem {
  id: string
  file: File
  status: 'pending' | 'processing' | 'done' | 'error'
  error?: string
}

export function GifMakerTool({ className }: GifMakerToolProps) {
  const [frames, setFrames] = useState<FrameItem[]>([])
  const [fps, setFps] = useState(10)
  const [loop, setLoop] = useState(true)
  const [processing, setProcessing] = useState(false)

  const handleFiles = useCallback((files: File[]) => {
    setFrames((prev) => [
      ...prev,
      ...files.map((f) => ({ id: nanoid(), file: f, status: 'pending' as const })),
    ])
  }, [])

  const handleRemove = useCallback((id: string) => {
    setFrames((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const handleMake = useCallback(async () => {
    if (processing || frames.length === 0) return
    setProcessing(true)

    // GIF 合成需要 gif.js / gifenc 等库
    // 此处为占位实现
    await new Promise((r) => setTimeout(r, 800))
    alert(`TODO: 将 ${frames.length} 帧合成为 GIF（fps=${fps}，loop=${loop}）`)

    setProcessing(false)
  }, [frames, fps, loop, processing])

  const fileItems: FileItem[] = frames.map((f) => ({
    id: f.id,
    name: f.file.name,
    size: f.file.size,
    status: f.status,
    error: f.error,
  }))

  return (
    <ToolLayout title="GIF 制作" description="将多张图片合成为 GIF 动图" className={className}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">帧率 ({fps} fps)</span>
            <input
              type="range" min={1} max={30} value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              className="w-40"
            />
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={loop}
              onChange={(e) => setLoop(e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-600">循环播放</span>
          </label>
        </div>

        <DropZone accept="image/*" onFiles={handleFiles} className="h-40" />

        {frames.length > 0 && (
          <>
            <FileList files={fileItems} onRemove={handleRemove} />
            <div className="flex gap-3">
              <Button onClick={handleMake} disabled={processing}>
                {processing ? '合成中…' : `合成 GIF（${frames.length} 帧）`}
              </Button>
              <Button variant="ghost" onClick={() => setFrames([])}>清空</Button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
