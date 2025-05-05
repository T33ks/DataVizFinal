interface ErrorDisplayProps {
  title?: string
  message: string
  id?: string
}

export default function ErrorDisplay({ title = "ERROR", message, id }: ErrorDisplayProps) {
  const headingId = id ? `${id}-error-heading` : "error-heading";
  return (
    <div 
      className="flex flex-col items-center justify-center p-6 text-center" 
      role="alert"
      aria-labelledby={headingId}
    >
      <div className="w-16 h-16 mb-4 relative" aria-hidden="true">
        <div className="absolute inset-0 bg-red-500 opacity-20 animate-ping rounded-full"></div>
        <div className="relative flex items-center justify-center w-full h-full border-2 border-red-500 rounded-full">
          <span className="text-2xl text-red-500">!</span>
        </div>
      </div>
      <h3 id={headingId} className="text-sm font-pixel neon-text-red mb-2">{title}</h3>
      <p className="text-xs font-mono text-red-400">{message}</p>
      <div className="mt-4 grid grid-cols-1 gap-2 w-full max-w-xs">
        <div className="pixel-panel border-red-400">
          <p className="text-xs font-data text-red-400">SYSTEM STATUS: ERROR</p>
        </div>
        <div className="pixel-panel">
          <p className="text-xs font-mono">RETRY RECOMMENDED</p>
        </div>
      </div>
    </div>
  )
}
