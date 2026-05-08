import React, { useCallback, useState } from 'react'

export interface DropZoneProps {
  accept?: string
  multiple?: boolean
  onFiles: (files: File[]) => void
  children?: React.ReactNode
  className?: string
}

export function DropZone({ accept, multiple = true, onFiles, children, className = '' }: DropZoneProps) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) onFiles(multiple ? files : [files[0]])
  }, [multiple, onFiles])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) onFiles(files)
    e.target.value = ''
  }, [onFiles])

  return (
    <label
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'} ${className}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input type="file" className="sr-only" accept={accept} multiple={multiple} onChange={handleChange} />
      {children ?? (
        <div className="flex flex-col items-center gap-2 p-8 text-gray-500">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm font-medium">拖拽文件到此处，或点击选择</span>
          {accept && <span className="text-xs text-gray-400">{accept}</span>}
        </div>
      )}
    </label>
  )
}
