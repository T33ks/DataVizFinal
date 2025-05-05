"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface DeathRatesChartProps {
  data: any[]
}

export default function DeathRatesChart({ data }: DeathRatesChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Set up dimensions
    const margin = { top: 20, right: 20, bottom: 70, left: 60 }
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

    // Filter and sort data
    const sortedData = [...data]
      .filter((d) => d["Deaths per TWh of electricity production"] !== undefined)
      .sort(
        (a, b) =>
          Number.parseFloat(b["Deaths per TWh of electricity production"]) -
          Number.parseFloat(a["Deaths per TWh of electricity production"]),
      )

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(sortedData.map((d) => d.Entity))
      .range([0, width])
      .padding(0.3)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(sortedData, (d) => Number.parseFloat(d["Deaths per TWh of electricity production"])) || 0])
      .range([height, 0])

    // Color scale for energy types
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(sortedData.map((d) => d.Entity))
      .range(["#4ade80", "#f472b6", "#60a5fa", "#fbbf24", "#a78bfa", "#34d399", "#fb923c", "#e879f9"])

    // Draw bars
    svg
      .selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.Entity) || 0)
      .attr("y", (d) => yScale(Number.parseFloat(d["Deaths per TWh of electricity production"])))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(Number.parseFloat(d["Deaths per TWh of electricity production"])))
      .attr("fill", (d) => colorScale(d.Entity))
      .attr("stroke", "black")
      .attr("stroke-width", 1)

    // Add axes
    const xAxis = d3.axisBottom(xScale)

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("fill", "#4ade80")
      .style("font-family", "var(--font-press-start-2p)")
      .style("font-size", "8px")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")

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
      .text("Energy Source")

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#4ade80")
      .style("font-family", "var(--font-press-start-2p)")
      .style("font-size", "10px")
      .text("Deaths per TWh")

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .attr("fill", "#4ade80")
      .style("font-family", "var(--font-press-start-2p)")
      .style("font-size", "12px")
      .text("Death Rates by Energy Source")
  }, [data])

  return (
    <div className="w-full h-[400px] relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}
