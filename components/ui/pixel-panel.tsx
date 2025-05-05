import type React from "react"
interface PixelPanelProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export default function PixelPanel({ children, title, className = "" }: PixelPanelProps) {
  return (
    <div className={`pixel-panel nuclear-glow ${className}`}>
      {title && (
        <div className="mb-4 pb-2 border-b-2 border-green-400 relative">
          <h2 className="text-sm font-pixel neon-text">{title}</h2>
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
