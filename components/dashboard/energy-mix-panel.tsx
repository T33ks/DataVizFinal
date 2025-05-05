"use client"

import { useState } from "react"
import EnergyMixPie from "../charts/energy-mix-pie"
import PixelPanel from "../ui/pixel-panel"
import ErrorDisplay from "../ui/error-display"

interface EnergyMixPanelProps {
  data: any
  error: string | null
}

export default function EnergyMixPanel({ data, error }: EnergyMixPanelProps) {
  const [hiddenSources, setHiddenSources] = useState<string[]>([])

  const energySources = [
    "Nuclear",
    "Coal",
    "Oil",
    "Gas",
    "Hydropower",
    "Wind",
    "Solar",
    "Biofuels",
    "Other renewables",
    "Traditional biomass",
  ]

  const toggleEnergySource = (source: string) => {
    if (hiddenSources.includes(source)) {
      setHiddenSources(hiddenSources.filter((s) => s !== source))
    } else {
      setHiddenSources([...hiddenSources, source])
    }
  }

  return (
    <PixelPanel title="GLOBAL ENERGY MIX">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <h3 className="text-xs mb-2 neon-text">HIDE ENERGY SOURCES</h3>
          <div className="space-y-2">
            {energySources.map((source) => (
              <button
                key={source}
                className={`w-full text-left text-xs px-3 py-2 border-2 transition-all ${
                  hiddenSources.includes(source)
                    ? "bg-green-400 text-black border-green-400"
                    : "bg-black text-green-400 border-green-400 hover:bg-green-900"
                }`}
                onClick={() => toggleEnergySource(source)}
              >
                {source}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-3">
          {error ? <ErrorDisplay message={error} /> : <EnergyMixPie data={data} hiddenSources={hiddenSources} />}
        </div>
      </div>
    </PixelPanel>
  )
}
