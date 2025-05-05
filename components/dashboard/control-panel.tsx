"use client"

import PixelPanel from "../ui/pixel-panel"

interface ControlPanelProps {
  activeView: string
  setActiveView: (view: string) => void
}

export default function ControlPanel({ activeView, setActiveView }: ControlPanelProps) {
  const viewOptions = [
    { value: "all", label: "ALL COMPONENTS" },
    { value: "map", label: "REACTORS MAP" },
    { value: "generation", label: "POWER GENERATION" },
    { value: "safety", label: "SAFETY COMPARISON" },
    { value: "energy", label: "ENERGY MIX" },
    { value: "profiles", label: "COUNTRY PROFILES" },
    { value: "paper", label: "TOP SECRET" },
  ]

  return (
    <PixelPanel title="CONTROL PANEL">
      <div>
        <h3 className="text-xs mb-2 neon-text">SELECT VIEW</h3>
        <div className="space-y-2">
          {viewOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full text-left text-xs px-3 py-2 border-2 transition-all z-20 relative ${
                activeView === option.value
                  ? "bg-green-400 text-black border-green-400"
                  : "bg-black text-green-400 border-green-400 hover:bg-green-900"
              }`}
              onClick={() => setActiveView(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6">
        <h3 className="text-xs mb-2 neon-text">SYSTEM STATUS</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs">OPERATIONAL</span>
        </div>
      </div>
    </PixelPanel>
  )
}
