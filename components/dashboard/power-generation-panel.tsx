"use client"

import { useState } from "react"
import PowerGenerationChart from "../charts/power-generation-chart"
import PixelPanel from "../ui/pixel-panel"
import ErrorDisplay from "../ui/error-display"
import { CountrySelector } from "./country-selector"

interface PowerGenerationPanelProps {
  data: any[]
  error: string | null
  selectedCountries: string[]
  onCountrySelectionChange: (countries: string[]) => void
}

export default function PowerGenerationPanel({
  data,
  error,
  selectedCountries,
  onCountrySelectionChange,
}: PowerGenerationPanelProps) {
  const [localSelectedCountries, setLocalSelectedCountries] = useState<string[]>(selectedCountries)

  // Get unique countries from the data
  const uniqueCountries = Array.from(new Set(data.map((d) => d.Entity))).sort()

  // Handle local country selection
  const handleCountrySelection = (countries: string[]) => {
    setLocalSelectedCountries(countries)
    onCountrySelectionChange(countries)
  }
  
  // Get top 5 countries with highest share of nuclear power
  const getTop5Countries = () => {
    // Create a map to store the latest data for each country
    const latestDataByCountry = new Map()
    
    // Find the latest year data for each country
    data.forEach(item => {
      const country = item.Entity
      const year = parseInt(item.Year)
      const share = parseFloat(item.share_of_electricity_pct || "0")
      
      if (!latestDataByCountry.has(country) || 
          year > latestDataByCountry.get(country).year) {
        latestDataByCountry.set(country, { year, share })
      }
    })
    
    // Convert map to array, sort by share, and get top 5
    return Array.from(latestDataByCountry.entries())
      .sort((a, b) => b[1].share - a[1].share)
      .slice(0, 5)
      .map(entry => entry[0])
  }

  return (
    <PixelPanel title="NUCLEAR POWER GENERATION">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <h3 className="text-xs mb-2 neon-text">SELECT COUNTRIES</h3>
          <div className="mb-2 flex justify-between">
            <button
              className="text-xs px-2 py-1 bg-black text-green-400 border border-green-400 hover:bg-green-900"
              onClick={() => handleCountrySelection([])}
            >
              Clear All
            </button>
            <button
              className="text-xs px-2 py-1 bg-black text-green-400 border border-green-400 hover:bg-green-900"
              onClick={() => handleCountrySelection(getTop5Countries())}
            >
              Top 5 by Share
            </button>
          </div>
          <CountrySelector data={data} selectedCountries={localSelectedCountries} onChange={handleCountrySelection} />
        </div>
        <div className="md:col-span-3">
          {error ? (
            <ErrorDisplay message={error} />
          ) : (
            <PowerGenerationChart data={data} selectedCountries={localSelectedCountries} />
          )}
        </div>
      </div>
    </PixelPanel>
  )
}
