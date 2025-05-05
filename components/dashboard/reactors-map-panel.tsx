"use client"

import ReactorsMapDirect from "../charts/reactors-map-direct"
import PixelPanel from "../ui/pixel-panel"
import ErrorDisplay from "../ui/error-display"
import { CountrySelector } from "./country-selector"

interface ReactorsMapPanelProps {
  data: any[]
  error: string | null
  selectedCountries: string[]
  onCountrySelectionChange: (countries: string[]) => void
}

export default function ReactorsMapPanel({
  data,
  error,
  selectedCountries,
  onCountrySelectionChange,
}: ReactorsMapPanelProps) {
  return (
    <PixelPanel title="NUCLEAR REACTORS MAP">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <h3 className="text-xs mb-2 neon-text">HIGHLIGHT COUNTRIES</h3>
          <CountrySelector data={data} selectedCountries={selectedCountries} onChange={onCountrySelectionChange} />
        </div>
        <div className="md:col-span-3">
          {error ? (
            <ErrorDisplay message={error} />
          ) : (
            <ReactorsMapDirect highlightedCountries={selectedCountries} />
          )}
        </div>
      </div>
    </PixelPanel>
  )
}
