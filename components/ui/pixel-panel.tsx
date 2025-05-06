import type React from "react"

interface PixelPanelProps {
  children: React.ReactNode
  title?: string
  className?: string
  id?: string
}

export default function PixelPanel({ children, title, className = "", id }: PixelPanelProps) {
  const headingId = id ? `${id}-heading` : undefined;
  
  return (
    <section 
      className={`pixel-panel nuclear-glow ${className}`}
      aria-labelledby={headingId}
    >
      {title && (
        <div className="mb-4 pb-2 border-b-2 border-green-400 relative">
          <h2 
            id={headingId} 
            className="text-sm font-pixel neon-text"
          >
            {title}
          </h2>
        </div>
      )}
      <div className="relative z-10 custom-scrollbar">
        {children}
      </div>
    </section>
  )
}
