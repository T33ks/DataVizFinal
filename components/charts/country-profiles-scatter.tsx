"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface CountryProfilesScatterProps {
  data: any[]
  viewMode: string
  selectedCountries: string[]
}

export default function CountryProfilesScatter({ data, viewMode, selectedCountries }: CountryProfilesScatterProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Validate data before proceeding
    if (!data || data.length === 0 || !svgRef.current) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    try {
      // Set up dimensions
      const margin = { top: 20, right: 20, bottom: 50, left: 60 }
      const width = svgRef.current.clientWidth - margin.left - margin.right
      const height = 400 - margin.top - margin.bottom

      // Create SVG
      const svg = d3
        .select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

      // Add pixelated background
      svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "black")
        .attr("stroke", "#4ade80")
        .attr("stroke-width", 2)

      // Add grid lines with pixel aesthetic
      const gridColor = "rgba(74, 222, 128, 0.2)"

      // Horizontal grid lines
      svg
        .append("g")
        .attr("class", "grid-lines")
        .selectAll("line")
        .data(d3.range(0, height, 20))
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("y1", (d) => d)
        .attr("x2", width)
        .attr("y2", (d) => d)
        .attr("stroke", gridColor)
        .attr("stroke-width", 1)

      // Vertical grid lines
      svg
        .append("g")
        .attr("class", "grid-lines")
        .selectAll("line")
        .data(d3.range(0, width, 20))
        .enter()
        .append("line")
        .attr("x1", (d) => d)
        .attr("y1", 0)
        .attr("x2", (d) => d)
        .attr("y2", height)
        .attr("stroke", gridColor)
        .attr("stroke-width", 1)

      // Determine which coordinates to use based on viewMode
      const xKey = viewMode === "pca" ? "pca_x" : "tsne_x"
      const yKey = viewMode === "pca" ? "pca_y" : "tsne_y"

      // Validate that data has the required properties
      if (!data.every((d) => d.Entity && d[xKey] !== undefined && d[yKey] !== undefined)) {
        throw new Error("Data is missing required properties for scatter plot")
      }

      // Create scales
      const xExtent = d3.extent(data, (d) => d[xKey]) as [number, number]
      const yExtent = d3.extent(data, (d) => d[yKey]) as [number, number]

      const xScale = d3
        .scaleLinear()
        .domain([xExtent[0] - 0.5, xExtent[1] + 0.5])
        .range([0, width])

      const yScale = d3
        .scaleLinear()
        .domain([yExtent[0] - 0.5, yExtent[1] + 0.5])
        .range([height, 0])

      // Color scale for clusters
      const colorScale = d3
        .scaleOrdinal<string>()
        .domain(["0", "1", "2", "3"])
        .range(["#4ade80", "#f472b6", "#60a5fa", "#fbbf24"])

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

      // Draw points
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d[xKey]))
        .attr("cy", (d) => yScale(d[yKey]))
        .attr("r", (d) => (selectedCountries.includes(d.Entity) ? 8 : 5))
        .attr("fill", (d) => colorScale((d.cluster || 0).toString()))
        .attr("stroke", (d) => (selectedCountries.includes(d.Entity) ? "#ffffff" : "black"))
        .attr("stroke-width", (d) => (selectedCountries.includes(d.Entity) ? 2 : 1))
        .attr("opacity", (d) => (selectedCountries.includes(d.Entity) ? 1 : 0.7))
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 0.9)
          tooltip
            .html(`
              <strong>${d.Entity}</strong><br/>
              Nuclear: ${(d.latest_nuclear_twh || 0).toFixed(2)} TWh<br/>
              Share: ${(d.latest_share_pct || 0).toFixed(2)}%<br/>
              Growth: ${((d.decade_growth_rate || 0) * 100).toFixed(2)}%<br/>
              Per Capita: ${(d["Per capita electricity - kWh"] || 0).toFixed(2)} kWh
            `)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px")
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0)
        })

      // Add country labels for selected countries
      svg
        .selectAll(".country-label")
        .data(data.filter((d) => selectedCountries.includes(d.Entity)))
        .enter()
        .append("text")
        .attr("class", "country-label")
        .attr("x", (d) => xScale(d[xKey]))
        .attr("y", (d) => yScale(d[yKey]) - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "8px")
        .text((d) => d.Entity)

      // Add axes without numeric labels
      const xAxis = d3.axisBottom(xScale).tickFormat(() => "")
      const yAxis = d3.axisLeft(yScale).tickFormat(() => "")

      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("fill", "#4ade80")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "8px")

      svg
        .append("g")
        .call(yAxis)
        .selectAll("text")
        .attr("fill", "#4ade80")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "8px")

      // Add axis labels (without "1" and "2")
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#4ade80")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "10px")
        .text(viewMode === "pca" ? "PCA Projection (X)" : "t-SNE Projection (X)")

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .attr("fill", "#4ade80")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "10px")
        .text(viewMode === "pca" ? "PCA Projection (Y)" : "t-SNE Projection (Y)")

      // Add title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .attr("fill", "#4ade80")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "12px")
        .text(`Nuclear Country Profiles (${viewMode.toUpperCase()})`)

      // Add legend with semi-transparent background and green border
      const clusters = [
        { id: "0", label: "High Nuclear" },
        { id: "1", label: "Medium Nuclear" },
        { id: "2", label: "Low Nuclear" },
        { id: "3", label: "Emerging Nuclear" },
      ]
      
      // Calculate legend dimensions
      const legendItemHeight = 20;
      const legendWidth = 160; // Increased from 130 to fit text better
      const legendHeight = clusters.length * legendItemHeight + 10;
      
      // Create background for legend in bottom right corner
      svg.append("rect")
        .attr("x", width - legendWidth - 10) // Position at right edge with 10px margin
        .attr("y", height - legendHeight - 10) // Position at bottom with 10px margin
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", "rgba(128, 128, 128, 0.5)") // Grey semi-transparent
        .attr("stroke", "#4ade80") // Green outline
        .attr("stroke-width", 1)
        .attr("rx", 3) // Rounded corners
        .attr("ry", 3)
      
      // Add legend group
      const legend = svg.append("g").attr("transform", `translate(${width - legendWidth}, ${height - legendHeight})`)

      clusters.forEach((cluster, i) => {
        legend
          .append("circle")
          .attr("cx", 0)
          .attr("cy", i * legendItemHeight)
          .attr("r", 5)
          .attr("fill", colorScale(cluster.id))

        legend
          .append("text")
          .attr("x", 10)
          .attr("y", i * legendItemHeight + 4)
          .attr("fill", "#4ade80")
          .style("font-family", "var(--font-press-start-2p)")
          .style("font-size", "8px")
          .text(cluster.label)
      })
    } catch (error) {
      console.error("Error rendering country profiles scatter plot:", error)

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
  }, [data, viewMode, selectedCountries])

  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <p className="text-red-400 text-sm">No country profile data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[400px] relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}