"use client"

import { useState, useEffect } from "react"
import NuclearHeader from "./nuclear-header"
import LoadingScreen from "../ui/loading-screen"
import PaperDisplay from "./paper-display"
import ControlPanel from "./control-panel"
import ErrorDisplay from "../ui/error-display"
import { fetchDeathRates, fetchEnergyMix, fetchReactorData, fetchCountryProfiles } from "@/lib/data-utils"
import CountryProfilesPanel from "./country-profiles-panel"
import SafetyComparisonPanel from "./safety-comparison-panel"
import EnergyMixPanel from "./energy-mix-panel"
import ReactorsMapPanel from "./reactors-map-panel"
import PowerGenerationPanel from "./power-generation-panel"
import ReactorWorkspacePanel from "./reactor-workspace-panel"

export default function NuclearDashboard() {
  const [loading, setLoading] = useState(true)
  const [deathRatesData, setDeathRatesData] = useState<any[]>([])
  const [energyMixData, setEnergyMixData] = useState<any>(null)
  const [reactorData, setReactorData] = useState<any[]>([])
  const [countryProfilesData, setCountryProfilesData] = useState<any[]>([])
  const [powerGenerationData, setPowerGenerationData] = useState<any[]>([])
  const [errors, setErrors] = useState<Record<string, string | null>>({
    deathRates: null,
    energyMix: null,
    reactors: null,
    countryProfiles: null,
    powerGeneration: null,
    general: null,
  })

  // Selection states
  const [activeView, setActiveView] = useState<string>("all")
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    "France",
    "United States",
    "Germany",
    "Japan",
    "United Kingdom",
  ])
  
  // Control panel visibility state
  const [controlPanelVisible, setControlPanelVisible] = useState<boolean>(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const newErrors = { ...errors }

      try {
        // Fetch death rates data
        try {
          const deathRates = await fetchDeathRates()
          setDeathRatesData(deathRates)
          newErrors.deathRates = null
        } catch (error) {
          console.error("Error loading death rates data:", error)
          newErrors.deathRates = `Failed to load death rates data: ${error.message}`
        }

        // Fetch energy mix data
        try {
          const energyMix = await fetchEnergyMix()
          setEnergyMixData(energyMix)
          newErrors.energyMix = null
        } catch (error) {
          console.error("Error loading energy mix data:", error)
          newErrors.energyMix = `Failed to load energy mix data: ${error.message}`
        }

        // Fetch reactor data
        try {
          const reactors = await fetchReactorData()
          setReactorData(reactors)
          newErrors.reactors = null
        } catch (error) {
          console.error("Error loading reactor data:", error)
          newErrors.reactors = `Failed to load reactor data: ${error.message}`
        }

        // Fetch country profiles data
        try {
          const countryProfiles = await fetchCountryProfiles()
          setCountryProfilesData(countryProfiles)
          newErrors.countryProfiles = null
        } catch (error) {
          console.error("Error loading country profiles data:", error)
          newErrors.countryProfiles = `Failed to load country profiles data: ${error.message}`
        }

        // Fetch power generation data
        try {
          const response = await fetch("/api/power-generation")
          if (!response.ok) {
            throw new Error(`Failed to fetch power generation data: ${response.status}`)
          }
          const data = await response.json()
          setPowerGenerationData(data.data)
          newErrors.powerGeneration = null
        } catch (error) {
          console.error("Error loading power generation data:", error)
          newErrors.powerGeneration = `Failed to load power generation data: ${error.message}`
        }

        newErrors.general = null
      } catch (error) {
        console.error("General error loading dashboard data:", error)
        newErrors.general = `Failed to load dashboard data: ${error.message}`
      } finally {
        setErrors(newErrors)
        // Simulate loading for effect
        setTimeout(() => setLoading(false), 1000)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  // Check if we have critical errors that prevent rendering the dashboard
  const hasCriticalError =
    errors.general !== null &&
    (deathRatesData.length === 0 || !energyMixData || reactorData.length === 0 || countryProfilesData.length === 0)

  if (hasCriticalError) {
    return (
      <div className="min-h-screen pixel-scanline bg-black">
        <NuclearHeader />
        <div className="container mx-auto p-4">
          <ErrorDisplay
            title="SYSTEM ERROR"
            message={errors.general || "Failed to load dashboard data. Please try again."}
          />
        </div>
      </div>
    )
  }

  // Filter visible components based on activeView
  // Exclude "paper" (TOP SECRET) from showing when "all" is selected
  const showComponent = (componentName: string) => {
    if (componentName === "paper") {
      // Only show TOP SECRET when specifically selected
      return activeView === "paper"
    }
    // Show other components when "all" is selected or when specifically selected
    return activeView === "all" || activeView === componentName
  }

  // Toggle control panel visibility
  const toggleControlPanel = () => {
    setControlPanelVisible(!controlPanelVisible)
  }

  return (
    <div className="min-h-screen pixel-scanline">
      <NuclearHeader />

      <div className="relative mt-6 p-4">
        {/* Control Panel Toggle Button */}
        <button 
          onClick={toggleControlPanel}
          className="absolute z-20 top-0 left-4 flex items-center justify-center w-8 h-8 
                    bg-black border-2 border-green-400 text-green-400 hover:bg-green-900
                    transition-colors duration-200"
          aria-label={controlPanelVisible ? "Hide Control Panel" : "Show Control Panel"}
        >
          {controlPanelVisible ? "◀" : "▶"}
        </button>

        <div className={`grid grid-cols-1 ${controlPanelVisible ? 'lg:grid-cols-4' : ''} gap-6`}>
          {/* Control Panel - Conditionally rendered based on visibility */}
          {controlPanelVisible && (
            <div className="lg:col-span-1 transition-all duration-300">
              <ControlPanel activeView={activeView} setActiveView={setActiveView} />
            </div>
          )}

          <div className={controlPanelVisible ? "lg:col-span-3" : "w-full"}>
            <div className="grid grid-cols-1 gap-6">
              {/* Nuclear Reactors Map Panel */}
              {showComponent("map") && (
                <div className="pixel-box-animate">
                  <ReactorsMapPanel
                    data={reactorData}
                    error={errors.reactors}
                    selectedCountries={selectedCountries}
                    onCountrySelectionChange={setSelectedCountries}
                  />
                </div>
              )}

              {/* Power Generation Panel */}
              {showComponent("generation") && (
                <div className="pixel-box-animate animation-delay-200">
                  <PowerGenerationPanel
                    data={powerGenerationData}
                    error={errors.powerGeneration}
                    selectedCountries={selectedCountries}
                    onCountrySelectionChange={setSelectedCountries}
                  />
                </div>
              )}

              {/* Safety Comparison Panel */}
              {showComponent("safety") && (
                <div className="pixel-box-animate animation-delay-400">
                  <SafetyComparisonPanel data={deathRatesData} error={errors.deathRates} />
                </div>
              )}

              {/* Global Energy Mix Panel */}
              {showComponent("energy") && (
                <div className="pixel-box-animate animation-delay-600">
                  <EnergyMixPanel data={energyMixData} error={errors.energyMix} />
                </div>
              )}

              {/* Country Profiles Panel */}
              {showComponent("profiles") && (
                <div className="pixel-box-animate animation-delay-700">
                  <CountryProfilesPanel
                    data={countryProfilesData}
                    error={errors.countryProfiles}
                    selectedCountries={selectedCountries}
                    onCountrySelectionChange={setSelectedCountries}
                  />
                </div>
              )}

              {/* Nuclear Reactor Workspace */}
              {showComponent("reactor") && (
                <div className="pixel-box-animate animation-delay-750">
                  <ReactorWorkspacePanel error={null} />
                </div>
              )}

              {/* TOP SECRET */}
              {showComponent("paper") && (
                <div className="pixel-box-animate animation-delay-800">
                  <PaperDisplay />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
