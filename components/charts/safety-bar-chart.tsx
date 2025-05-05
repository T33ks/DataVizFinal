"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface SafetyBarChartProps {
  data: any[]
  selectedEnergyTypes: string[]
  useLogScale?: boolean
}

export default function SafetyBarChart({ data, selectedEnergyTypes, useLogScale = true }: SafetyBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Validate data before proceeding
    if (!data || data.length === 0 || !svgRef.current) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()
    
    // Remove any existing tooltips when re-rendering
    d3.select("body").selectAll(".tooltip").remove()

    try {
      // Filter data based on selected energy types
      const filteredData =
        selectedEnergyTypes.length > 0 ? data.filter((d) => !selectedEnergyTypes.includes(d.Entity)) : data

      // Validate that data has the required properties
      if (!filteredData.every((d) => d.Entity && d["Deaths per TWh of electricity production"] !== undefined)) {
        throw new Error("Data is missing required properties")
      }

      // Sort data by death rate
      const sortedData = [...filteredData].sort(
        (a, b) => b["Deaths per TWh of electricity production"] - a["Deaths per TWh of electricity production"],
      )

      // Set up dimensions
      const margin = { top: 20, right: 20, bottom: 70, left: 60 }
      const width = svgRef.current.clientWidth - margin.left - margin.right
      const height = 300 - margin.top - margin.bottom

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

      // Create scales
      const xScale = d3
        .scaleBand()
        .domain(sortedData.map((d) => d.Entity))
        .range([0, width])
        .padding(0.3)

      // Create either logarithmic or linear scale based on user selection
      const yScale = useLogScale
        ? d3
            .scaleLog()
            .domain([
              Math.max(0.01, d3.min(sortedData, (d) => d["Deaths per TWh of electricity production"]) || 0.01), 
              Math.max(1, d3.max(sortedData, (d) => d["Deaths per TWh of electricity production"]) || 1)
            ])
            .range([height, 0])
            .nice()
        : d3
            .scaleLinear()
            .domain([0, d3.max(sortedData, (d) => d["Deaths per TWh of electricity production"]) || 0])
            .range([height, 0])

      // Color scale for energy types
      const colorScale = d3
        .scaleOrdinal<string>()
        .domain(sortedData.map((d) => d.Entity))
        .range(["#4ade80", "#f472b6", "#60a5fa", "#fbbf24", "#a78bfa", "#34d399", "#fb923c", "#e879f9"])

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

      // Calculate value for height (handling log scale minimum values)
      const getBarHeight = (d) => {
        const value = d["Deaths per TWh of electricity production"];
        if (useLogScale) {
          // For log scale, ensure we have a minimum visible height for very small values
          const scaledValue = Math.max(value, 0.01); // Ensure a minimum value for log scale
          return height - yScale(scaledValue);
        } else {
          return height - yScale(value);
        }
      };
      
      // Calculate Y position for bars
      const getBarY = (d) => {
        const value = d["Deaths per TWh of electricity production"];
        if (useLogScale) {
          return yScale(Math.max(value, 0.01));
        } else {
          return yScale(value);
        }
      };
      
      // Draw bars with improved interaction area for small values
      const bars = svg
        .selectAll(".bar-group")
        .data(sortedData)
        .enter()
        .append("g")
        .attr("class", "bar-group");
      
      // Add the actual visible bars
      bars.append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.Entity) || 0)
        .attr("y", getBarY)
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => Math.max(getBarHeight(d), 1)) // Ensure minimum 1px height
        .attr("fill", (d) => colorScale(d.Entity))
        .attr("stroke", "black")
        .attr("stroke-width", 1);
      
      // Add a transparent interaction area on top of each bar (especially for small bars)
      bars.append("rect")
        .attr("class", "bar-hover-area")
        .attr("x", (d) => xScale(d.Entity) || 0)
        .attr("y", (d) => Math.min(getBarY(d), height - 20)) // Ensure at least 20px height for interaction
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => Math.max(getBarHeight(d), 20)) // At least 20px tall for easy hovering
        .attr("fill", "transparent")
        .on("mouseover", (event, d) => {
          // Highlight the bar
          d3.select(event.currentTarget.parentNode)
            .select(".bar")
            .attr("stroke", "#4ade80")
            .attr("stroke-width", 2)
            .attr("filter", "brightness(1.2)");
            
          // Show enhanced tooltip
          tooltip.transition().duration(200).style("opacity", 0.95);
          tooltip
            .html(`
              <div style="text-align: center; margin-bottom: 5px; font-weight: bold; color: ${colorScale(d.Entity)};">
                ${d.Entity}
              </div>
              <table style="border-collapse: collapse; width: 100%;">
                <tr>
                  <td style="padding: 3px 0;">Deaths:</td>
                  <td style="text-align: right; padding: 3px 0;">${d["Deaths per TWh of electricity production"].toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 3px 0;">Per TWh</td>
                  <td style="text-align: right; padding: 3px 0;">${useLogScale ? "(log scale)" : ""}</td>
                </tr>
              </table>
            `)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", (event) => {
          // Restore bar style
          d3.select(event.currentTarget.parentNode)
            .select(".bar")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("filter", null);
            
          // Hide tooltip
          tooltip.transition().duration(500).style("opacity", 0);
        });

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

      // Create appropriate Y axis based on scale type
      const yAxis = useLogScale
        ? d3.axisLeft(yScale)
            .tickFormat((d) => {
              if (d >= 1) return d.toFixed(0);
              if (d >= 0.1) return d.toFixed(1);
              return d.toFixed(2);
            })
            .tickValues([0.01, 0.1, 1, 10, 100]) // Custom tick values for log scale
        : d3.axisLeft(yScale);

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
        .text(`Deaths per TWh ${useLogScale ? "(Log Scale)" : ""}`)
    } catch (error) {
      console.error("Error rendering safety bar chart:", error)

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
  }, [data, selectedEnergyTypes, useLogScale])

  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <p className="text-red-400 text-sm">No data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[300px] relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}
