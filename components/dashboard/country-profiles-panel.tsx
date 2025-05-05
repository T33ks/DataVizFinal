"use client"

import { useState } from "react"
import CountryProfilesScatter from "../charts/country-profiles-scatter"
import PixelPanel from "../ui/pixel-panel"
import ErrorDisplay from "../ui/error-display"
import { CountrySelector } from "./country-selector"

interface CountryProfilesPanelProps {
  data: any[]
  error: string | null
  selectedCountries: string[]
  onCountrySelectionChange: (countries: string[]) => void
}

export default function CountryProfilesPanel({
  data,
  error,
  selectedCountries,
  onCountrySelectionChange,
}: CountryProfilesPanelProps) {
  const [viewMode, setViewMode] = useState<string>("pca")

  return (
    <PixelPanel title="NUCLEAR COUNTRY PROFILES">
      <div className="mb-4 flex items-center">
        <div className="flex space-x-2">
          <button
            className={`text-xs px-3 py-1 border ${
              viewMode === "pca"
                ? "bg-green-400 text-black border-green-400"
                : "bg-black text-green-400 border-green-400 hover:bg-green-900"
            }`}
            onClick={() => setViewMode("pca")}
          >
            PCA VIEW
          </button>
          <button
            className={`text-xs px-3 py-1 border ${
              viewMode === "tsne"
                ? "bg-green-400 text-black border-green-400"
                : "bg-black text-green-400 border-green-400 hover:bg-green-900"
            }`}
            onClick={() => setViewMode("tsne")}
          >
            T-SNE VIEW
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <h3 className="text-xs mb-2 neon-text">SELECT COUNTRIES</h3>
          <CountrySelector data={data} selectedCountries={selectedCountries} onChange={onCountrySelectionChange} />
        </div>
        <div className="md:col-span-3">
          {error ? (
            <ErrorDisplay message={error} />
          ) : (
            <CountryProfilesScatter data={data} viewMode={viewMode} selectedCountries={selectedCountries} />
          )}
        </div>
      </div>
    </PixelPanel>
  )
}
