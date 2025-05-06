"use client"

import { useState, useEffect } from "react"
import PixelPanel from "../ui/pixel-panel"

interface ReactorWorkspacePanelProps {
  error?: string | null
}

export default function ReactorWorkspacePanel({ error }: ReactorWorkspacePanelProps) {
  // Reactor configuration state
  const [reactorType, setReactorType] = useState<string>("PWR")
  const [fuelEnrichment, setFuelEnrichment] = useState<number>(5)
  const [coolantFlow, setCoolantFlow] = useState<number>(70)
  const [controlRodPosition, setControlRodPosition] = useState<number>(50)
  const [moderatorTemp, setModeratorTemp] = useState<number>(300)
  
  // Simulation results state
  const [isSimulating, setIsSimulating] = useState<boolean>(false)
  const [powerOutput, setPowerOutput] = useState<number>(0)
  const [thermalEfficiency, setThermalEfficiency] = useState<number>(0)
  const [outletTemperature, setOutletTemperature] = useState<number>(0)
  const [safetyMargin, setSafetyMargin] = useState<number>(100)
  
  // Simulation history state
  const [simulationHistory, setSimulationHistory] = useState<any[]>([])
  const [comparisonMode, setComparisonMode] = useState<boolean>(false)
  const [comparisonConfig, setComparisonConfig] = useState<any>(null)
  
  // Reactor types
  const reactorTypes = [
    { value: "PWR", label: "Pressurized Water Reactor" },
    { value: "BWR", label: "Boiling Water Reactor" },
    { value: "CANDU", label: "CANDU (Heavy Water)" },
    { value: "RBMK", label: "RBMK" },
    { value: "MSR", label: "Molten Salt Reactor" }
  ]

  // Reset configuration
  const resetConfiguration = () => {
    setReactorType("PWR")
    setFuelEnrichment(5)
    setCoolantFlow(70)
    setControlRodPosition(50)
    setModeratorTemp(300)
    setPowerOutput(0)
    setThermalEfficiency(0)
    setOutletTemperature(0)
    setSafetyMargin(100)
    setIsSimulating(false)
  }

  // Run simulation
  const runSimulation = () => {
    setIsSimulating(true)
    
    // Simulate reactor physics (simplified for demonstration)
    setTimeout(() => {
      // Calculate simulated values based on configuration
      // These are simplified formulas for demonstration purposes
      const newPowerOutput = (fuelEnrichment * (100 - controlRodPosition) / 100) * 12
      const newThermalEfficiency = 30 + (coolantFlow / 10)
      const newOutletTemperature = moderatorTemp + (fuelEnrichment * (100 - controlRodPosition) / coolantFlow) * 10
      
      // Safety margin decreases with high power and temperature, increases with coolant flow
      const newSafetyMargin = 100 - (newPowerOutput / 2) + (coolantFlow / 2) - (newOutletTemperature / 10)
      
      // Update state with simulation results
      setPowerOutput(Math.min(100, Math.max(0, newPowerOutput)))
      setThermalEfficiency(Math.min(40, Math.max(20, newThermalEfficiency)))
      setOutletTemperature(Math.min(1000, Math.max(moderatorTemp, newOutletTemperature)))
      setSafetyMargin(Math.min(100, Math.max(0, newSafetyMargin)))
      
      // Add to history
      const newSimulation = {
        id: Date.now(),
        reactorType,
        fuelEnrichment,
        coolantFlow,
        controlRodPosition,
        moderatorTemp,
        powerOutput: Math.min(100, Math.max(0, newPowerOutput)),
        thermalEfficiency: Math.min(40, Math.max(20, newThermalEfficiency)),
        outletTemperature: Math.min(1000, Math.max(moderatorTemp, newOutletTemperature)),
        safetyMargin: Math.min(100, Math.max(0, newSafetyMargin)),
        timestamp: new Date().toISOString()
      }
      
      setSimulationHistory(prev => [...prev, newSimulation])
      setIsSimulating(false)
    }, 2000)
  }

  // Set comparison configuration
  const compareSimulation = (simulation: any) => {
    setComparisonMode(true)
    setComparisonConfig(simulation)
  }

  // Download report
  const downloadReport = () => {
    // Get the best configuration (highest power output with safety margin > 30)
    const safeSimulations = simulationHistory.filter(sim => sim.safetyMargin > 30)
    const bestConfig = safeSimulations.length > 0 
      ? safeSimulations.reduce((prev, current) => 
          (prev.powerOutput > current.powerOutput) ? prev : current
        ) 
      : null
      
    if (!bestConfig) {
      alert("No safe configuration found in history!")
      return
    }
    
    // Create report content
    const reportContent = `
NUCLEAR REACTOR SIMULATION REPORT
=================================
Date: ${new Date().toLocaleDateString()}

BEST CONFIGURATION:
Reactor Type: ${bestConfig.reactorType}
Fuel Enrichment: ${bestConfig.fuelEnrichment}%
Coolant Flow: ${bestConfig.coolantFlow}%
Control Rod Position: ${bestConfig.controlRodPosition}%
Moderator Temperature: ${bestConfig.moderatorTemp}K

PERFORMANCE METRICS:
Power Output: ${bestConfig.powerOutput.toFixed(2)} MW
Thermal Efficiency: ${bestConfig.thermalEfficiency.toFixed(2)}%
Outlet Temperature: ${bestConfig.outletTemperature.toFixed(2)}K
Safety Margin: ${bestConfig.safetyMargin.toFixed(2)}%

SIMULATION HISTORY:
${simulationHistory.map(sim => 
  `${new Date(sim.timestamp).toLocaleTimeString()} - Power: ${sim.powerOutput.toFixed(2)} MW, Safety: ${sim.safetyMargin.toFixed(2)}%`
).join('\n')}
    `
    
    // Create and download the file
    const element = document.createElement('a')
    const file = new Blob([reportContent], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = 'reactor_simulation_report.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (error) {
    return (
      <PixelPanel title="NUCLEAR REACTOR WORKSPACE">
        <div className="text-red-400 text-sm">ERROR: {error}</div>
      </PixelPanel>
    )
  }

  return (
    <PixelPanel title="NUCLEAR REACTOR WORKSPACE">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left side - Controls */}
        <div className="space-y-4">
          <h3 className="text-sm neon-text mb-2">REACTOR CONFIGURATION</h3>
          
          <div className="space-y-3">
            {/* Reactor Type */}
            <div>
              <label className="text-xs text-green-300 block mb-1">REACTOR TYPE</label>
              <select 
                value={reactorType}
                onChange={(e) => setReactorType(e.target.value)}
                className="w-full bg-black border-2 border-green-400 text-green-400 text-xs p-1"
                disabled={isSimulating}
              >
                {reactorTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            {/* Fuel Enrichment */}
            <div>
              <label className="text-xs text-green-300 block mb-1">
                FUEL ENRICHMENT: {fuelEnrichment}%
              </label>
              <input 
                type="range" 
                min="3" 
                max="20" 
                value={fuelEnrichment}
                onChange={(e) => setFuelEnrichment(Number(e.target.value))}
                className="w-full"
                disabled={isSimulating}
              />
            </div>
            
            {/* Coolant Flow */}
            <div>
              <label className="text-xs text-green-300 block mb-1">
                COOLANT FLOW: {coolantFlow}%
              </label>
              <input 
                type="range" 
                min="30" 
                max="100" 
                value={coolantFlow}
                onChange={(e) => setCoolantFlow(Number(e.target.value))}
                className="w-full"
                disabled={isSimulating}
              />
            </div>
            
            {/* Control Rod Position */}
            <div>
              <label className="text-xs text-green-300 block mb-1">
                CONTROL ROD POSITION: {controlRodPosition}%
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={controlRodPosition}
                onChange={(e) => setControlRodPosition(Number(e.target.value))}
                className="w-full"
                disabled={isSimulating}
              />
              <div className="text-xs text-gray-400 mt-1">0% = Fully Inserted, 100% = Fully Withdrawn</div>
            </div>
            
            {/* Moderator Temperature */}
            <div>
              <label className="text-xs text-green-300 block mb-1">
                MODERATOR TEMPERATURE: {moderatorTemp}K
              </label>
              <input 
                type="range" 
                min="250" 
                max="600" 
                value={moderatorTemp}
                onChange={(e) => setModeratorTemp(Number(e.target.value))}
                className="w-full"
                disabled={isSimulating}
              />
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex space-x-2 mt-4">
            <button
              className="bg-black text-green-400 border-2 border-green-400 hover:bg-green-900 px-3 py-1 text-xs transition-colors disabled:opacity-50"
              onClick={runSimulation}
              disabled={isSimulating}
            >
              {isSimulating ? "SIMULATING..." : "RUN SIMULATION"}
            </button>
            <button
              className="bg-black text-green-400 border-2 border-green-400 hover:bg-green-900 px-3 py-1 text-xs transition-colors"
              onClick={resetConfiguration}
              disabled={isSimulating}
            >
              RESET
            </button>
            {simulationHistory.length > 0 && (
              <button
                className="bg-black text-green-400 border-2 border-green-400 hover:bg-green-900 px-3 py-1 text-xs transition-colors"
                onClick={downloadReport}
                disabled={isSimulating}
              >
                DOWNLOAD REPORT
              </button>
            )}
          </div>
        </div>
        
        {/* Right side - Visualization and Metrics */}
        <div>
          {/* Core Visualization */}
          <div className="border-2 border-green-400 bg-black p-4 h-40 mb-4 relative">
            <h3 className="text-xs text-green-300 absolute top-2 left-2">CORE SCHEMATIC</h3>
            
            {/* Reactor Core Visualization */}
            <div className="w-full h-full relative flex items-center justify-center">
              {/* Reactor Vessel */}
              <div className="w-24 h-24 border-4 border-gray-600 rounded-full relative flex items-center justify-center">
                {/* Fuel Rods */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-1 bg-orange-500"
                    style={{
                      height: `${12 + i * 3}px`,
                      left: `${10 + i * 9}px`,
                      bottom: `${(100 - controlRodPosition) / 2}%`,
                      transition: 'all 0.5s ease'
                    }}
                  ></div>
                ))}
                
                {/* Coolant Visualization */}
                <div className="w-full h-full absolute inset-0 rounded-full overflow-hidden">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-blue-500 opacity-50"
                    style={{ 
                      height: `${coolantFlow}%`,
                      transition: 'height 0.5s ease'
                    }}
                  ></div>
                </div>
                
                {/* Heat Visualization */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    opacity: powerOutput / 100,
                    transition: 'opacity 0.5s ease'
                  }}
                ></div>
              </div>
              
              {/* Temperature indicators */}
              <div className="absolute right-2 top-2 text-xs">
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-1" 
                    style={{ 
                      backgroundColor: outletTemperature > 700 ? 'red' : 
                                      outletTemperature > 500 ? 'orange' : 'green' 
                    }}
                  ></div>
                  <span>{outletTemperature.toFixed(0)}K</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2">
            {/* Power Output */}
            <div className="border-2 border-green-400 bg-black p-2">
              <div className="text-xs text-green-300">POWER OUTPUT</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-700 h-2 rounded-full">
                  <div 
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${powerOutput}%` }}
                  ></div>
                </div>
                <div className="ml-2 text-xs">{powerOutput.toFixed(1)}MW</div>
              </div>
            </div>
            
            {/* Thermal Efficiency */}
            <div className="border-2 border-green-400 bg-black p-2">
              <div className="text-xs text-green-300">THERMAL EFFICIENCY</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-700 h-2 rounded-full">
                  <div 
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${thermalEfficiency * 2.5}%` }}
                  ></div>
                </div>
                <div className="ml-2 text-xs">{thermalEfficiency.toFixed(1)}%</div>
              </div>
            </div>
            
            {/* Temperature */}
            <div className="border-2 border-green-400 bg-black p-2">
              <div className="text-xs text-green-300">OUTLET TEMPERATURE</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-700 h-2 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      outletTemperature > 700 ? 'bg-red-500' : 
                      outletTemperature > 500 ? 'bg-orange-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${(outletTemperature / 1000) * 100}%` }}
                  ></div>
                </div>
                <div className="ml-2 text-xs">{outletTemperature.toFixed(0)}K</div>
              </div>
            </div>
            
            {/* Safety Margin */}
            <div className="border-2 border-green-400 bg-black p-2">
              <div className="text-xs text-green-300">SAFETY MARGIN</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-700 h-2 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      safetyMargin < 30 ? 'bg-red-500' : 
                      safetyMargin < 60 ? 'bg-orange-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${safetyMargin}%` }}
                  ></div>
                </div>
                <div className="ml-2 text-xs">{safetyMargin.toFixed(0)}%</div>
              </div>
            </div>
          </div>
          
          {/* Simulation History */}
          <div className="mt-4">
            <h3 className="text-xs text-green-300 mb-1">SIMULATION HISTORY</h3>
            <div className="border-2 border-green-400 bg-black p-2 h-24 overflow-auto">
              {simulationHistory.length === 0 ? (
                <div className="text-xs text-gray-400">No simulations yet</div>
              ) : (
                <div className="space-y-1">
                  {simulationHistory.map((sim, index) => (
                    <div key={sim.id} className="text-xs flex justify-between">
                      <span>
                        #{index + 1} {sim.reactorType} - Power: {sim.powerOutput.toFixed(1)} MW
                      </span>
                      <button 
                        className="text-green-400 hover:underline"
                        onClick={() => compareSimulation(sim)}
                      >
                        Compare
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Comparison Mode */}
      {comparisonMode && comparisonConfig && (
        <div className="mt-4 border-2 border-green-400 bg-black p-3">
          <div className="flex justify-between">
            <h3 className="text-xs neon-text">COMPARISON MODE</h3>
            <button 
              className="text-xs text-red-400"
              onClick={() => setComparisonMode(false)}
            >
              CLOSE
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <h4 className="text-xs text-green-300">CURRENT SETTINGS</h4>
              <table className="w-full text-xs mt-1">
                <tbody>
                  <tr>
                    <td className="text-gray-400">Reactor Type:</td>
                    <td>{reactorType}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400">Fuel Enrichment:</td>
                    <td>{fuelEnrichment}%</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400">Coolant Flow:</td>
                    <td>{coolantFlow}%</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400">Control Rod Pos:</td>
                    <td>{controlRodPosition}%</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400">Power Output:</td>
                    <td>{powerOutput.toFixed(1)} MW</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400">Safety Margin:</td>
                    <td>{safetyMargin.toFixed(0)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h4 className="text-xs text-green-300">SAVED SETTINGS</h4>
              <table className="w-full text-xs mt-1">
                <tbody>
                  <tr>
                    <td className="text-gray-400">Reactor Type:</td>
                    <td>{comparisonConfig.reactorType}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400">Fuel Enrichment:</td>
                    <td>{comparisonConfig.fuelEnrichment}%</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400">Coolant Flow:</td>
                    <td>{comparisonConfig.coolantFlow}%</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400">Control Rod Pos:</td>
                    <td>{comparisonConfig.controlRodPosition}%</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400">Power Output:</td>
                    <td>{comparisonConfig.powerOutput.toFixed(1)} MW</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400">Safety Margin:</td>
                    <td>{comparisonConfig.safetyMargin.toFixed(0)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <button
            className="mt-2 bg-black text-green-400 border-2 border-green-400 hover:bg-green-900 px-3 py-1 text-xs transition-colors"
            onClick={() => {
              // Apply the saved settings
              setReactorType(comparisonConfig.reactorType)
              setFuelEnrichment(comparisonConfig.fuelEnrichment)
              setCoolantFlow(comparisonConfig.coolantFlow)
              setControlRodPosition(comparisonConfig.controlRodPosition)
              setModeratorTemp(comparisonConfig.moderatorTemp)
              setComparisonMode(false)
            }}
          >
            APPLY THESE SETTINGS
          </button>
        </div>
      )}
    </PixelPanel>
  )
}