"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface EnergyMixPieProps {
  data: any
  hiddenSources: string[]
}

export default function EnergyMixPie({ data, hiddenSources }: EnergyMixPieProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Validate data before proceeding
    if (!data || !svgRef.current) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    try {
      // Set up dimensions
      const width = svgRef.current.clientWidth
      const height = 350 // Increased height for larger pie chart
      const radius = Math.min(width, height) / 2 - 20 // Reduced padding to make chart larger

      // Create SVG
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)

      // Extract energy sources and percentages
      const energySources = [
        { name: "Nuclear", value: data.Nuclear_pct || 0 },
        { name: "Coal", value: data.Coal_pct || 0 },
        { name: "Oil", value: data.Oil_pct || 0 },
        { name: "Gas", value: data.Gas_pct || 0 },
        { name: "Hydropower", value: data.Hydropower_pct || 0 },
        { name: "Wind", value: data.Wind_pct || 0 },
        { name: "Solar", value: data.Solar_pct || 0 },
        { name: "Biofuels", value: data.Biofuels_pct || 0 },
        { name: "Other renewables", value: data["Other renewables_pct"] || 0 },
        { name: "Traditional biomass", value: data["Traditional biomass_pct"] || 0 },
      ].filter((source) => !hiddenSources.includes(source.name) && source.value > 0)

      // If no data after filtering, show a message
      if (energySources.length === 0) {
        svg
          .append("text")
          .attr("text-anchor", "middle")
          .attr("fill", "#4ade80")
          .style("font-family", "var(--font-press-start-2p)")
          .style("font-size", "12px")
          .text("No energy sources to display")
        return
      }

      // Color scale
      const colorScale = d3
        .scaleOrdinal<string>()
        .domain(energySources.map((d) => d.name))
        .range([
          "#4ade80", // Nuclear - green
          "#6b7280", // Coal - gray
          "#60a5fa", // Oil - blue
          "#f59e0b", // Gas - amber
          "#3b82f6", // Hydropower - blue
          "#a78bfa", // Wind - purple
          "#fbbf24", // Solar - yellow
          "#34d399", // Biofuels - emerald
          "#f472b6", // Other renewables - pink
          "#8b5cf6", // Traditional biomass - violet
        ])

      // Create pie chart
      const pie = d3
        .pie<any>()
        .value((d) => d.value)
        .sort(null)

      const arc = d3.arc<any>().innerRadius(0).outerRadius(radius)

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

      // Draw pie slices
      svg
        .selectAll("path")
        .data(pie(energySources))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d) => colorScale(d.data.name))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 0.9)
          tooltip
            .html(`${d.data.name}<br/>${d.data.value.toFixed(2)}%`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px")
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0)
        })

      // Add legend
      const legendGroup = svg.append("g").attr("transform", `translate(${radius + 20}, ${-radius})`)

      const legend = legendGroup
        .selectAll(".legend")
        .data(energySources)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`)

      legend
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", (d) => colorScale(d.name))

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("fill", "#4ade80")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "8px")
        .text((d) => d.name)
    } catch (error) {
      console.error("Error rendering energy mix pie chart:", error)

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
        .text("Error rendering chart")
    }

    // Cleanup function to remove tooltip when component unmounts
    return () => {
      d3.select("body").selectAll(".tooltip").remove()
    }
  }, [data, hiddenSources])

  // If no data, show a message
  if (!data) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center">
        <p className="text-red-400 text-sm">No data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[350px] relative flex items-center justify-center">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}
