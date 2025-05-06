"use client"

import { useState } from "react"
import SafetyBarChart from "../charts/safety-bar-chart"
import PixelPanel from "../ui/pixel-panel"
import ErrorDisplay from "../ui/error-display"

interface SafetyComparisonPanelProps {
  data: any[]
  error: string | null
}

export default function SafetyComparisonPanel({ data, error }: SafetyComparisonPanelProps) {
  const [selectedEnergyTypes, setSelectedEnergyTypes] = useState<string[]>([])
  const [useLogScale, setUseLogScale] = useState<boolean>(true)

  const energyTypes = ["Nuclear", "Coal", "Oil", "Natural Gas", "Biomass", "Wind", "Hydropower", "Solar"]

  const toggleEnergyType = (type: string) => {
    if (selectedEnergyTypes.includes(type)) {
      setSelectedEnergyTypes(selectedEnergyTypes.filter((t) => t !== type))
    } else {
      setSelectedEnergyTypes([...selectedEnergyTypes, type])
    }
  }

  return (
    <PixelPanel title="SAFETY COMPARISON">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <div className="mb-4">
            <h3 className="text-xs mb-2 neon-text">SCALE OPTIONS</h3>
            <div className="flex items-center space-x-2 mb-2">
              <button
                className={`flex-1 text-center text-xs px-2 py-1 border-2 transition-all ${
                  !useLogScale
                    ? "bg-green-400 text-black border-green-400"
                    : "bg-black text-green-400 border-green-400 hover:bg-green-900"
                }`}
                onClick={() => setUseLogScale(false)}
              >
                Linear
              </button>
              <button
                className={`flex-1 text-center text-xs px-2 py-1 border-2 transition-all ${
                  useLogScale
                    ? "bg-green-400 text-black border-green-400"
                    : "bg-black text-green-400 border-green-400 hover:bg-green-900"
                }`}
                onClick={() => setUseLogScale(true)}
              >
                Logarithmic
              </button>
            </div>
            <p className="text-xs text-green-300 italic mb-4">
              {useLogScale 
                ? "Log scale makes small values visible" 
                : "Linear scale shows true proportions"}
            </p>
          </div>
          
          <h3 className="text-xs mb-2 neon-text">FILTER ENERGY TYPES</h3>
          <div className="space-y-2">
            {energyTypes.map((type) => (
              <button
                key={type}
                className={`w-full text-left text-xs px-3 py-2 border-2 transition-all ${
                  selectedEnergyTypes.includes(type)
                    ? "bg-green-400 text-black border-green-400"
                    : "bg-black text-green-400 border-green-400 hover:bg-green-900"
                }`}
                onClick={() => toggleEnergyType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-3">
          {error ? (
            <ErrorDisplay message={error} />
          ) : (
            <>
              <SafetyBarChart data={data} selectedEnergyTypes={selectedEnergyTypes} useLogScale={useLogScale} />
              
              {/* Hazard symbol with glowing effect and link */}
              <div className="mt-4 flex items-center justify-center">
                <a 
                  href="https://ourworldindata.org/what-was-the-death-toll-from-chernobyl-and-fukushima" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center text-2xl animate-pulse text-yellow-400">
                      <div className="relative">
                        <span className="absolute -inset-0.5 rounded-full bg-yellow-400 opacity-50 blur-sm animate-pulse"></span>
                        <span className="relative z-10">☢️</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-red-500 text-xs font-pixel group-hover:underline">
                    What was the death toll from Chernobyl and Fukushima?
                  </span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </PixelPanel>
  )
}
