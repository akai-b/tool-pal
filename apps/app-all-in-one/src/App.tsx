import React, { useState } from 'react'
import { ImageCompressTool, ImageConvertTool } from '@pal/tool-image'
import { FontCompressTool } from '@pal/tool-font-compress'
import { GifMakerTool } from '@pal/tool-gif-maker'

type ToolId = 'image-compress' | 'image-convert' | 'font-compress' | 'gif-maker'

const TOOLS: { id: ToolId; label: string; icon: string }[] = [
  { id: 'image-compress', label: '图片压缩', icon: '🖼️' },
  { id: 'image-convert', label: '图片转换', icon: '🔄' },
  { id: 'font-compress', label: '字体压缩', icon: '🔤' },
  { id: 'gif-maker', label: 'GIF 制作', icon: '🎞️' },
]

export function App() {
  const [active, setActive] = useState<ToolId>('image-compress')

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 */}
      <nav className="w-48 shrink-0 bg-white border-r border-gray-200 flex flex-col py-4">
        <div className="px-4 mb-6">
          <h1 className="text-base font-bold text-gray-900">Pal 工具箱</h1>
        </div>
        <ul className="flex-1 space-y-1 px-2">
          {TOOLS.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => setActive(t.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active === t.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 内容区 */}
      <main className="flex-1 overflow-auto">
        {active === 'image-compress' && <ImageCompressTool />}
        {active === 'image-convert' && <ImageConvertTool />}
        {active === 'font-compress' && <FontCompressTool />}
        {active === 'gif-maker' && <GifMakerTool />}
      </main>
    </div>
  )
}
