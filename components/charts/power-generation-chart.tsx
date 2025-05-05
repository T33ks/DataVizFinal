"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface PowerGenerationChartProps {
  data: any[]
  selectedCountries: string[]
}

export default function PowerGenerationChart({ data, selectedCountries }: PowerGenerationChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    try {
      // Filter data for selected countries
      const filteredData = data.filter((d) => selectedCountries.includes(d.Entity))

      // If no countries are selected, show a message
      if (filteredData.length === 0) {
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
          .attr("fill", "#4ade80")
          .style("font-family", "var(--font-press-start-2p)")
          .style("font-size", "12px")
          .text("Select countries to display data")

        return
      }

      // Set up dimensions
      const margin = { top: 20, right: 80, bottom: 50, left: 60 }
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

      // Group data by country
      const groupedData = d3.group(filteredData, (d) => d.Entity)

      // Get all years
      const allYears = Array.from(new Set(data.map((d) => +d.Year)))
      const minYear = d3.min(allYears) || 0
      const maxYear = d3.max(allYears) || 0

      // Create scales
      const xScale = d3.scaleLinear().domain([minYear, maxYear]).range([0, width])

      const allValues = filteredData.map((d) => Number.parseFloat(d.electricity_from_nuclear_twh || "0"))
      const yMax = d3.max(allValues) || 0

      const yScale = d3
        .scaleLinear()
        .domain([0, yMax * 1.1]) // Add 10% padding
        .range([height, 0])

      // Create line generator with curve interpolation for smoother lines
      const line = d3
        .line<any>()
        .x((d) => xScale(+d.Year))
        .y((d) => yScale(Number.parseFloat(d.electricity_from_nuclear_twh || "0")))
        .defined((d) => !isNaN(Number.parseFloat(d.electricity_from_nuclear_twh || "0")))
        .curve(d3.curveMonotoneX) // Makes the line curves smoother

      // Color scale for countries
      const colorScale = d3
        .scaleOrdinal<string>()
        .domain(selectedCountries)
        .range([
          "#4ade80",
          "#f472b6",
          "#60a5fa",
          "#fbbf24",
          "#a78bfa",
          "#34d399",
          "#fb923c",
          "#e879f9",
          "#2dd4bf",
          "#f87171",
        ])

      // Create enhanced tooltip
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "rgba(0, 0, 0, 0.9)")
        .style("border", "2px solid #4ade80")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "#4ade80")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "10px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("z-index", 100)
        .style("box-shadow", "0 0 15px rgba(74, 222, 128, 0.5)")
        .style("min-width", "180px")
        .style("backdrop-filter", "blur(5px)")

      // Draw lines
      groupedData.forEach((countryData, country) => {
        // Sort data by year
        const sortedData = countryData
          .sort((a, b) => +a.Year - +b.Year)
          .filter((d) => !isNaN(Number.parseFloat(d.electricity_from_nuclear_twh || "0")))

        if (sortedData.length === 0) return

        // Add line hover effect with drop shadow
        const linePath = svg
          .append("path")
          .datum(sortedData)
          .attr("fill", "none")
          .attr("stroke", colorScale(country))
          .attr("stroke-width", 3)
          .attr("d", line)
          .style("filter", "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3))")
          .style("transition", "all 0.2s ease");
          
        // Add line hover interactions
        linePath
          .on("mouseover", () => {
            linePath
              .attr("stroke-width", 5)
              .style("filter", "drop-shadow(0px 0px 5px rgba(74, 222, 128, 0.5))");
          })
          .on("mouseout", () => {
            linePath
              .attr("stroke-width", 3)
              .style("filter", "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3))");
          })

        // Add data points
        svg
          .selectAll(`.point-${country.replace(/\s+/g, "-")}`)
          .data(sortedData)
          .enter()
          .append("circle")
          .attr("class", `point-${country.replace(/\s+/g, "-")}`)
          .attr("cx", (d) => xScale(+d.Year))
          .attr("cy", (d) => yScale(Number.parseFloat(d.electricity_from_nuclear_twh || "0")))
          .attr("r", 5)
          .attr("fill", colorScale(country))
          .attr("stroke", "#000")
          .attr("stroke-width", 1.5)
          .attr("opacity", 0.9)
          .on("mouseover", (event, d) => {
            // Highlight current point
            d3.select(event.currentTarget)
              .attr("r", 8)
              .attr("stroke", "#fff")
              .attr("stroke-width", 2)
              .attr("opacity", 1)
              
            // Show tooltip with enhanced information
            tooltip.transition().duration(100).style("opacity", 0.95)
            tooltip
              .html(`
                <div style="text-align: center; margin-bottom: 5px; font-weight: bold; color: ${colorScale(country)};">
                  ${d.Entity}
                </div>
                <table style="border-collapse: collapse; width: 100%;">
                  <tr>
                    <td style="padding: 3px 0; border-bottom: 1px solid rgba(74, 222, 128, 0.3);">Year:</td>
                    <td style="text-align: right; padding: 3px 0; border-bottom: 1px solid rgba(74, 222, 128, 0.3);">${d.Year}</td>
                  </tr>
                  <tr>
                    <td style="padding: 3px 0; border-bottom: 1px solid rgba(74, 222, 128, 0.3);">Nuclear:</td>
                    <td style="text-align: right; padding: 3px 0; border-bottom: 1px solid rgba(74, 222, 128, 0.3);">${Number.parseFloat(d.electricity_from_nuclear_twh || "0").toFixed(1)} TWh</td>
                  </tr>
                  <tr>
                    <td style="padding: 3px 0;">Share:</td>
                    <td style="text-align: right; padding: 3px 0;">${Number.parseFloat(d.share_of_electricity_pct || "0").toFixed(1)}%</td>
                  </tr>
                </table>
              `)
              .style("left", event.pageX + 12 + "px")
              .style("top", event.pageY - 28 + "px")
          })
          .on("mouseout", (event) => {
            // Restore point to original size
            d3.select(event.currentTarget)
              .attr("r", 5)
              .attr("stroke", "#000")
              .attr("stroke-width", 1.5)
              .attr("opacity", 0.9)
              
            // Hide tooltip
            tooltip.transition().duration(300).style("opacity", 0)
          })
      })

      // Add axes
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat((d) => d.toString())
        .ticks(Math.min(10, maxYear - minYear))

      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("fill", "#4ade80")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "8px")

      const yAxis = d3.axisLeft(yScale)

      svg
        .append("g")
        .call(yAxis)
        .selectAll("text")
        .attr("fill", "#4ade80")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "8px")

      // Add axis labels
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#4ade80")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "10px")
        .text("Year")

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .attr("fill", "#4ade80")
        .style("font-family", "var(--font-press-start-2p)")
        .style("font-size", "10px")
        .text("Nuclear Electricity (TWh)")

      // Add legend
      const legend = svg.append("g").attr("transform", `translate(${width + 10}, 0)`)

      selectedCountries.forEach((country, i) => {
        // Only add to legend if country has data
        if (groupedData.has(country)) {
          const legendItem = legend.append("g").attr("transform", `translate(0, ${i * 20})`)

          legendItem.append("rect").attr("width", 12).attr("height", 12).attr("fill", colorScale(country))

          legendItem
            .append("text")
            .attr("x", 20)
            .attr("y", 10)
            .attr("fill", "#4ade80")
            .style("font-family", "var(--font-press-start-2p)")
            .style("font-size", "8px")
            .text(country)
        }
      })
    } catch (error) {
      console.error("Error rendering power generation chart:", error)

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
  }, [data, selectedCountries])

  return (
    <div className="w-full h-[400px] relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}
