import React, { useState } from 'react'
import { ImageCompressTool, ImageConvertTool } from '@pal/tool-image'
import { GifMakerTool } from '@pal/tool-gif-maker'

type Tab = 'compress' | 'convert' | 'gif-maker'

const TABS: { id: Tab; label: string }[] = [
  { id: 'compress',  label: '图片压缩' },
  { id: 'convert',   label: '图片转换' },
  { id: 'gif-maker', label: 'GIF 制作' },
]

export function App() {
  const [tab, setTab] = useState<Tab>('compress')

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Tab bar */}
      <header className="bg-white border-b border-gray-200 px-4">
        <nav className="flex gap-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {tab === 'compress'  && <ImageCompressTool />}
        {tab === 'convert'   && <ImageConvertTool />}
        {tab === 'gif-maker' && <GifMakerTool />}
      </main>
    </div>
  )
}
