import React from 'react'

export interface ToolLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function ToolLayout({ title, description, children, className = '' }: ToolLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}
