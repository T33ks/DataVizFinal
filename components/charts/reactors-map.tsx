"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { feature } from "topojson-client"

interface ReactorsMapProps {
  data: any[]
  highlightedCountries: string[]
}

export default function ReactorsMap({ data, highlightedCountries }: ReactorsMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    try {
      // Set up dimensions
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

      // Create a projection
      const projection = d3
        .geoMercator()
        .scale(width / 6)
        .center([0, 20])
        .translate([width / 2, height / 2])

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
          "United States of America": "United States",
          "United Kingdom": "United Kingdom",
          "Russian Federation": "Russia",
          "South Korea": "Korea, Republic of",
          "Korea, Democratic People's Republic of": "Korea, DPR",
          Iran: "Iran, Islamic Republic of",
          Netherlands: "Netherlands, Kingdom of the",
          Turkey: "Türkiye",
          "Slovakia": "Slovak Republic",
          "Czechia": "Czech Republic",
          "United Arab Emirates": "United Arab Emirates"
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
            const mappedName = countryNameMapping[countryName] || countryName
            const country = data.find((c) => c.name === mappedName || c.country === mappedName)

            // If we have data for this country, color it based on operational reactor count
            if (country) {
              const operationalReactors = country.operational || 0
              return colorScale(operationalReactors)
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
            const mappedName = countryNameMapping[countryName] || countryName
            const country = data.find((c) => c.name === mappedName || c.country === mappedName)

            if (country) {
              tooltip.transition().duration(200).style("opacity", 0.9)
              tooltip
                .html(`
                  <strong>${countryName}</strong><br/>
                  Operational Reactors: ${country.operational || 0}<br/>
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

        // Add legend
        const legend = svg.append("g").attr("transform", `translate(20, ${height - 120})`)

        const legendItems = [
          { label: "No operational reactors", color: "#1f2937" },
          { label: "1-9 operational reactors", color: "#4ade80" },
          { label: "10-29 operational reactors", color: "#34d399" },
          { label: "30-59 operational reactors", color: "#10b981" },
          { label: "60+ operational reactors", color: "#059669" },
        ]

        legendItems.forEach((item, i) => {
          legend
            .append("rect")
            .attr("x", 0)
            .attr("y", i * 20)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", item.color)

          legend
            .append("text")
            .attr("x", 20)
            .attr("y", i * 20 + 10)
            .attr("fill", "#4ade80")
            .style("font-family", "var(--font-press-start-2p)")
            .style("font-size", "8px")
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
        .text("Error rendering map")
    }

    // Cleanup function to remove tooltip when component unmounts
    return () => {
      d3.select("body").selectAll(".tooltip").remove()
    }
  }, [data, highlightedCountries])

  return (
    <div className="w-full h-[400px] relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}
