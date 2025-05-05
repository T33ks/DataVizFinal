"use client"

import { useState, useEffect } from "react"

interface CountrySelectorProps {
  data: any[]
  selectedCountries: string[]
  onChange: (countries: string[]) => void
}

export function CountrySelector({ data, selectedCountries, onChange }: CountrySelectorProps) {
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    if (data && data.length > 0) {
      // Extract unique countries from the data
      const countries = Array.from(
        new Set(
          data
            .map((item) => item.Entity || item.name || item.country)
            .filter((country) => country !== undefined && country !== "World"),
        ),
      ).sort() as string[]

      setAvailableCountries(countries)
    }
  }, [data])

  const toggleCountry = (country: string) => {
    // Clicking a filter field adds it to the chart; clicking a selected country removes it
    if (!selectedCountries.includes(country)) {
      // Add the country
      onChange([...selectedCountries, country])
    } else {
      // Remove the country
      onChange(selectedCountries.filter((c) => c !== country))
    }
  }

  const filteredCountries = searchTerm
    ? availableCountries.filter((country) => country.toLowerCase().includes(searchTerm.toLowerCase()))
    : availableCountries

  return (
    <div>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search countries..."
          className="w-full bg-black text-green-400 border-2 border-green-400 px-2 py-1 text-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {filteredCountries.map((country) => (
          <div key={country} className="flex items-center mb-2">
            <button
              className={`w-full text-left text-xs px-2 py-1 border transition-all ${
                selectedCountries.includes(country)
                  ? "bg-green-400 text-black border-green-400"
                  : "bg-black text-green-400 border-green-400 hover:bg-green-900"
              }`}
              onClick={() => toggleCountry(country)}
            >
              {country}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
