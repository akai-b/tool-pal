export interface FileItem {
  id: string
  name: string
  size: number
  status: 'pending' | 'processing' | 'done' | 'error'
  progress?: number
  resultSize?: number
  error?: string
}

export interface FileListProps {
  files: FileItem[]
  onRemove?: (id: string) => void
  className?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

const statusIcon: Record<FileItem['status'], string> = {
  pending: '⏳',
  processing: '⚙️',
  done: '✅',
  error: '❌',
}

export function FileList({ files, onRemove, className = '' }: FileListProps) {
  if (files.length === 0) return null
  return (
    <ul className={`divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {files.map((f) => (
        <li key={f.id} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50">
          <span className="text-base" aria-hidden="true">{statusIcon[f.status]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
            <p className="text-xs text-gray-500">
              {formatBytes(f.size)}
              {f.resultSize != null && f.status === 'done' && (
                <span className="ml-2 text-green-600">→ {formatBytes(f.resultSize)}</span>
              )}
              {f.error && <span className="ml-2 text-red-500">{f.error}</span>}
            </p>
          </div>
          {onRemove && (
            <button
              onClick={() => onRemove(f.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={`移除 ${f.name}`}
            >
              ✕
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
