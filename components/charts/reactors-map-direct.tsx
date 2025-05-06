"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { feature } from "topojson-client"
import { parse } from "csv-parse/sync"

interface ReactorData {
  country: string
  operational: number
  construction: number
  shutdown: number
  totalReactors: number
}

interface ReactorsMapProps {
  highlightedCountries: string[]
}

export default function ReactorsMapDirect({ highlightedCountries }: ReactorsMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<ReactorData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch the CSV file directly
        const response = await fetch("/data/Nuclear_Operational_Sites.csv")
        
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
        }
        
        const csvText = await response.text()
        
        // Parse the CSV
        const records = parse(csvText, {
          columns: true,
          skip_empty_lines: true,
        })
        
        // Process the data
        const processedData = records.map((record: any) => ({
          country: record.Country,
          operational: parseInt(record["In Operation"]) || 0,
          construction: parseInt(record["Under Construction"]) || 0,
          shutdown: parseInt(record.Shutdown) || 0,
          totalReactors: 
            (parseInt(record["In Operation"]) || 0) + 
            (parseInt(record["Under Construction"]) || 0) + 
            (parseInt(record.Shutdown) || 0)
        }))
        
        setData(processedData)
      } catch (err: any) {
        console.error("Error loading reactor data:", err)
        setError(err.message)
        
        // Fallback data
        setData([
          { country: "United States", operational: 94, shutdown: 41, construction: 0, totalReactors: 135 },
          { country: "France", operational: 57, shutdown: 14, construction: 0, totalReactors: 71 },
          { country: "China", operational: 57, shutdown: 0, construction: 28, totalReactors: 85 },
          { country: "Russia", operational: 36, shutdown: 11, construction: 4, totalReactors: 51 },
          { country: "Korea, Republic of", operational: 26, shutdown: 2, construction: 2, totalReactors: 30 },
          { country: "Canada", operational: 17, shutdown: 8, construction: 0, totalReactors: 25 },
          { country: "Ukraine", operational: 15, shutdown: 4, construction: 2, totalReactors: 21 },
          { country: "United Kingdom", operational: 9, shutdown: 36, construction: 2, totalReactors: 47 },
          { country: "Spain", operational: 7, shutdown: 3, construction: 0, totalReactors: 10 },
          { country: "India", operational: 21, shutdown: 0, construction: 6, totalReactors: 27 },
          { country: "Japan", operational: 14, shutdown: 27, construction: 2, totalReactors: 43 },
          { country: "Germany", operational: 0, shutdown: 33, construction: 0, totalReactors: 33 },
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  useEffect(() => {
    if (loading || !data.length || !svgRef.current) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    try {
      // Set up dimensions - fit within the container bounds
      const width = svgRef.current.clientWidth
      const height = 400

      // Create SVG
      const svg = d3.select(svgRef.current).attr("width", width).attr("height", height)

      // Add pixelated background
      svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "black")
        .attr("stroke", "#4ade80")
        .attr("stroke-width", 2)

      // Create a projection - properly constrained to fit within bounds
      const projection = d3
        .geoMercator()
        .scale(width / 8.5) // Further reduced scale to ensure map fits within container
        .center([10, 35]) // Adjusted center to better position map vertically
        .translate([width / 2, height / 2 - 20]) // Adjusted vertical position by moving the map up slightly

      // Create a path generator
      const pathGenerator = d3.geoPath().projection(projection)

      // Create tooltip
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "black")
        .style("border", "2px solid #4ade80")
        .style("padding", "8px")
        .style("color", "#4ade80")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "10px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("z-index", 100)
        .style("box-shadow", "0 0 10px #4ade80")

      // Load world map data
      d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((worldData: any) => {
        // Convert TopoJSON to GeoJSON
        const countries = feature(worldData, worldData.objects.countries)

        // Create a mapping between country names in the world map and our data
        const countryNameMapping: Record<string, string> = {
          "United States of America": "UNITED STATES OF AMERICA",
          "United Kingdom": "UNITED KINGDOM",
          "Russian Federation": "RUSSIA",
          "South Korea": "KOREA REPUBLIC OF",
          "Korea, Democratic People's Republic of": "KOREA DPR",
          "Iran": "IRAN, ISLAMIC REPUBLIC OF",
          "Netherlands": "NETHERLANDS",
          "Turkey": "TÜRKİYE",
          "Slovakia": "SLOVAK REPUBLIC",
          "Czechia": "CZECH REPUBLIC",
          "United Arab Emirates": "UNITED ARAB EMIRATES",
          "China": "CHINA",
          "Japan": "JAPAN",
          "France": "FRANCE",
          "Canada": "CANADA",
          "Ukraine": "UKRAINE",
          "India": "INDIA",
          "Spain": "SPAIN",
          "Germany": "GERMANY",
          "Belgium": "BELGIUM",
          "Switzerland": "SWITZERLAND",
          "Sweden": "SWEDEN"
        }

        // Create color scale for reactor counts
        const colorScale = d3
          .scaleThreshold<number, string>()
          .domain([1, 10, 30, 60])
          .range(["#1f2937", "#4ade80", "#34d399", "#10b981", "#059669"])

        // Draw countries
        svg
          .selectAll("path")
          .data(countries.features)
          .enter()
          .append("path")
          .attr("d", pathGenerator)
          .attr("fill", (d) => {
            // Get the country name from the world map data
            const countryName = d.properties.name
            
            // Find the matching country in our data
            const mappedName = countryNameMapping[countryName] || countryName.toUpperCase()
            const country = data.find((c) => c.country === mappedName)
            
            // If we have data for this country, color it based on operational reactor count
            if (country) {
              return colorScale(country.operational)
            }
            
            return "#1f2937" // Default color for countries without reactors
          })
          .attr("stroke", (d) => {
            const countryName = d.properties.name
            const mappedName = countryNameMapping[countryName] || countryName
            return highlightedCountries.includes(mappedName) ? "#f472b6" : "#4ade80"
          })
          .attr("stroke-width", (d) => {
            const countryName = d.properties.name
            const mappedName = countryNameMapping[countryName] || countryName
            return highlightedCountries.includes(mappedName) ? 2 : 0.5
          })
          .on("mouseover", (event, d) => {
            const countryName = d.properties.name
            const mappedName = countryNameMapping[countryName] || countryName.toUpperCase()
            const country = data.find((c) => c.country === mappedName)
            
            if (country) {
              tooltip.transition().duration(200).style("opacity", 0.9)
              tooltip
                .html(`
                  <strong>${countryName}</strong><br/>
                  Operational Reactors: ${country.operational}<br/>
                  ${country.shutdown ? `Shutdown: ${country.shutdown}<br/>` : ""}
                  ${country.construction ? `Under Construction: ${country.construction}<br/>` : ""}
                `)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 28 + "px")
            }
          })
          .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0)
          })

        // Add legend with semi-transparent background and green outline
        const legendItems = [
          { label: "No operational reactors", color: "#1f2937" },
          { label: "1-9 operational reactors", color: "#4ade80" },
          { label: "10-29 operational reactors", color: "#34d399" },
          { label: "30-59 operational reactors", color: "#10b981" },
          { label: "60+ operational reactors", color: "#059669" },
        ]
        
        // Calculate legend dimensions
        const legendItemHeight = 16; // Reduced from 20
        const legendWidth = 180; // Increased from 140 to fit text better
        const legendHeight = legendItems.length * legendItemHeight + 10;
        
        // Create background for legend - moved up slightly to avoid overlapping with bottom countries
        svg.append("rect")
          .attr("x", 15)
          .attr("y", height - 135) // Moved up by 10px
          .attr("width", legendWidth)
          .attr("height", legendHeight)
          .attr("fill", "rgba(128, 128, 128, 0.2)") // Light grey, semi-transparent
          .attr("stroke", "#4ade80") // Green outline
          .attr("stroke-width", 1)
          .attr("rx", 3) // Rounded corners
          .attr("ry", 3)
        
        const legend = svg.append("g").attr("transform", `translate(20, ${height - 130})`) // Adjusted to match the moved legend background

        legendItems.forEach((item, i) => {
          legend
            .append("rect")
            .attr("x", 0)
            .attr("y", i * legendItemHeight)
            .attr("width", 10) // Slightly smaller squares
            .attr("height", 10)
            .attr("fill", item.color)

          legend
            .append("text")
            .attr("x", 18)
            .attr("y", i * legendItemHeight + 8) // Adjusted y-position for smaller font
            .attr("fill", "#4ade80")
            .style("font-family", "var(--font-press-start-2p)")
            .style("font-size", "6px") // Reduced font size
            .text(item.label)
        })
      })
    } catch (error) {
      console.error("Error rendering reactors map:", error)

      // Display error message on the chart
      const width = svgRef.current.clientWidth
      const height = svgRef.current.clientHeight

      const svg = d3.select(svgRef.current).attr("width", width).attr("height", height)

      svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "black")
        .attr("stroke", "#4ade80")
        .attr("stroke-width", 2)

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#ff4040")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "12px")
        .text(`Error rendering map: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Cleanup function to remove tooltip when component unmounts
    return () => {
      d3.select("body").selectAll(".tooltip").remove()
    }
  }, [data, highlightedCountries, loading])

  if (loading) {
    return (
      <div className="w-full h-[400px] relative bg-black border-2 border-green-400 flex items-center justify-center">
        <div className="text-green-400 font-pixel text-sm animate-pulse">Loading Nuclear Data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-[400px] relative bg-black border-2 border-red-400 flex items-center justify-center">
        <div className="text-red-400 font-pixel text-sm">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="w-full h-[400px] relative">
      <svg ref={svgRef} className="w-full h-full overflow-hidden"></svg> {/* Using overflow-hidden to ensure content stays within bounds */}
    </div>
  )
}