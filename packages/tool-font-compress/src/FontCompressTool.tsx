import React, { useState, useCallback } from 'react'
import { ToolLayout, DropZone, FileList, Button } from '@pal/ui'
import type { FileItem } from '@pal/ui'
import { nanoid, downloadBytes } from '@pal/utils'

export interface FontCompressToolProps {
  className?: string
}

interface FontItem {
  id: string
  file: File
  status: 'pending' | 'processing' | 'done' | 'error'
  resultSize?: number
  resultBlob?: Blob
  resultFilename?: string
  error?: string
}

export function FontCompressTool({ className }: FontCompressToolProps) {
  const [items, setItems] = useState<FontItem[]>([])
  const [glyphs, setGlyphs] = useState('')
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

  const handleCompress = useCallback(async () => {
    if (processing) return
    setProcessing(true)

    // 字体压缩需要 fonttools / pyftsubset 或 wasm 库（如 fontkit）
    // 此处为占位实现，实际逻辑在 Electron main 进程或 WASM 中完成
    for (const item of items) {
      if (item.status === 'done') continue
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: 'processing' } : i))
      try {
        // TODO: 调用 IPC 或 WASM 进行字体子集化
        await new Promise((r) => setTimeout(r, 500)) // 模拟处理
        setItems((prev) => prev.map((i) =>
          i.id === item.id ? { ...i, status: 'error', error: '字体压缩功能需要 Electron 环境' } : i
        ))
      } catch (e) {
        setItems((prev) => prev.map((i) =>
          i.id === item.id ? { ...i, status: 'error', error: e instanceof Error ? e.message : '处理失败' } : i
        ))
      }
    }

    setProcessing(false)
  }, [items, glyphs, processing])

  const fileItems: FileItem[] = items.map((i) => ({
    id: i.id,
    name: i.file.name,
    size: i.file.size,
    status: i.status,
    resultSize: i.resultSize,
    error: i.error,
  }))

  return (
    <ToolLayout title="字体压缩" description="提取字体子集，大幅减小字体文件体积" className={className}>
      <div className="space-y-6">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-600">保留字符集（留空则保留全部）</span>
          <textarea
            value={glyphs}
            onChange={(e) => setGlyphs(e.target.value)}
            placeholder="输入需要保留的字符，例如：你好世界 ABCabc123"
            className="border border-gray-300 rounded px-3 py-2 text-sm h-24 resize-none"
          />
        </label>

        <DropZone accept=".ttf,.otf,.woff,.woff2" onFiles={handleFiles} className="h-40" />

        {items.length > 0 && (
          <>
            <FileList files={fileItems} onRemove={handleRemove} />
            <div className="flex gap-3">
              <Button onClick={handleCompress} disabled={processing}>
                {processing ? '处理中…' : '开始压缩'}
              </Button>
              <Button variant="ghost" onClick={() => setItems([])}>清空</Button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
