"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface LineChartProps {
  data: any[]
  dataType: string
  selectedCountries: string[]
}

export default function LineChart({ data, dataType, selectedCountries }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Filter data for selected countries
    const filteredData = data.filter((d) => selectedCountries.includes(d.Entity))

    // Get the value column based on dataType
    let valueColumn: string
    let yAxisLabel: string

    switch (dataType) {
      case "primary-energy":
        valueColumn = "Nuclear (% equivalent primary energy)"
        yAxisLabel = "% of primary energy"
        break
      case "energy-generation":
        valueColumn = "Electricity from nuclear - TWh"
        yAxisLabel = "TWh"
        break
      case "share-electricity":
        valueColumn = "Nuclear - % electricity"
        yAxisLabel = "% of electricity"
        break
      case "change-energy":
        valueColumn = "Annual change in primary energy consumption (%)"
        yAxisLabel = "% change"
        break
      default:
        valueColumn = "Nuclear (% equivalent primary energy)"
        yAxisLabel = "% of primary energy"
    }

    // Group data by country
    const groupedData = d3.group(filteredData, (d) => d.Entity)

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

    // Parse years and values
    const allYears = Array.from(new Set(data.map((d) => +d.Year)))
    const minYear = d3.min(allYears) || 0
    const maxYear = d3.max(allYears) || 0

    // Create scales
    const xScale = d3.scaleLinear().domain([minYear, maxYear]).range([0, width])

    const allValues = filteredData.map((d) => Number.parseFloat(d[valueColumn] || "0"))
    const yMax = d3.max(allValues) || 0

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax * 1.1]) // Add 10% padding
      .range([height, 0])

    // Create line generator
    const line = d3
      .line<any>()
      .x((d) => xScale(+d.Year))
      .y((d) => yScale(Number.parseFloat(d[valueColumn] || "0")))

    // Color scale for countries
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(selectedCountries)
      .range(["#4ade80", "#f472b6", "#60a5fa", "#fbbf24", "#a78bfa", "#34d399"])

    // Draw lines
    groupedData.forEach((countryData, country) => {
      // Sort data by year
      const sortedData = countryData.sort((a, b) => +a.Year - +b.Year)

      // Draw line
      svg
        .append("path")
        .datum(sortedData)
        .attr("fill", "none")
        .attr("stroke", colorScale(country))
        .attr("stroke-width", 3)
        .attr("d", line)

      // Add data points
      svg
        .selectAll(`.point-${country.replace(/\s+/g, "-")}`)
        .data(sortedData)
        .enter()
        .append("circle")
        .attr("class", `point-${country.replace(/\s+/g, "-")}`)
        .attr("cx", (d) => xScale(+d.Year))
        .attr("cy", (d) => yScale(Number.parseFloat(d[valueColumn] || "0")))
        .attr("r", 4)
        .attr("fill", colorScale(country))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
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
      .text(yAxisLabel)

    // Add legend
    const legend = svg.append("g").attr("transform", `translate(${width + 10}, 0)`)

    selectedCountries.forEach((country, i) => {
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
    })
  }, [data, dataType, selectedCountries])

  return (
    <div className="w-full h-[400px] relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}
