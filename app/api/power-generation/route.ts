import { NextResponse } from "next/server"
import { parse } from "csv-parse/sync"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Try to read from the local file first
    let csvData: string
    try {
      const filePath = path.join(process.cwd(), "public/data/world_nuclear_energy_generation.csv")
      csvData = fs.readFileSync(filePath, "utf8")
    } catch (fileError) {
      // If local file fails, try to fetch from the blob URL
      console.warn("Could not read local file, trying blob URL:", fileError)
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/world_nuclear_energy_generation-nn46a8C68F6BydED1RxSupMxrlaFz9.csv",
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch power generation data: ${response.status} ${response.statusText}`)
      }

      csvData = await response.text()
    }

    // Validate CSV data before parsing
    if (!csvData || csvData.trim() === "") {
      throw new Error("Empty power generation CSV data received")
    }

    // Parse CSV data
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    })

    // Process the data
    const processedData = records.map((record: any) => ({
      Entity: record.Entity,
      Year: record.Year,
      electricity_from_nuclear_twh: record["electricity_from_nuclear_twh"] || "0",
      share_of_electricity_pct: record["share_of_electricity_pct"] || "0",
    }))

    return NextResponse.json({ data: processedData })
  } catch (error) {
    console.error("Error in power-generation API route:", error)

    // Fallback data with more countries
    const fallbackData = [
      {
        Entity: "United States",
        Year: "1990",
        electricity_from_nuclear_twh: "576.9",
        share_of_electricity_pct: "19.0",
      },
      {
        Entity: "United States",
        Year: "2000",
        electricity_from_nuclear_twh: "753.9",
        share_of_electricity_pct: "19.8",
      },
      {
        Entity: "United States",
        Year: "2010",
        electricity_from_nuclear_twh: "807.0",
        share_of_electricity_pct: "19.6",
      },
      {
        Entity: "United States",
        Year: "2020",
        electricity_from_nuclear_twh: "789.9",
        share_of_electricity_pct: "19.7",
      },
      {
        Entity: "United States",
        Year: "2022",
        electricity_from_nuclear_twh: "775.4",
        share_of_electricity_pct: "18.2",
      },

      { Entity: "France", Year: "1990", electricity_from_nuclear_twh: "297.7", share_of_electricity_pct: "74.5" },
      { Entity: "France", Year: "2000", electricity_from_nuclear_twh: "395.0", share_of_electricity_pct: "76.8" },
      { Entity: "France", Year: "2010", electricity_from_nuclear_twh: "410.1", share_of_electricity_pct: "75.1" },
      { Entity: "France", Year: "2020", electricity_from_nuclear_twh: "335.4", share_of_electricity_pct: "67.1" },
      { Entity: "France", Year: "2022", electricity_from_nuclear_twh: "335.7", share_of_electricity_pct: "65.3" },

      { Entity: "China", Year: "1990", electricity_from_nuclear_twh: "0.0", share_of_electricity_pct: "0.0" },
      { Entity: "China", Year: "2000", electricity_from_nuclear_twh: "16.7", share_of_electricity_pct: "1.2" },
      { Entity: "China", Year: "2010", electricity_from_nuclear_twh: "73.9", share_of_electricity_pct: "1.8" },
      { Entity: "China", Year: "2020", electricity_from_nuclear_twh: "344.7", share_of_electricity_pct: "4.8" },
      { Entity: "China", Year: "2022", electricity_from_nuclear_twh: "407.5", share_of_electricity_pct: "5.3" },

      { Entity: "Japan", Year: "1990", electricity_from_nuclear_twh: "202.3", share_of_electricity_pct: "23.8" },
      { Entity: "Japan", Year: "2000", electricity_from_nuclear_twh: "319.8", share_of_electricity_pct: "30.4" },
      { Entity: "Japan", Year: "2010", electricity_from_nuclear_twh: "288.2", share_of_electricity_pct: "25.1" },
      { Entity: "Japan", Year: "2015", electricity_from_nuclear_twh: "9.4", share_of_electricity_pct: "0.9" },
      { Entity: "Japan", Year: "2022", electricity_from_nuclear_twh: "77.4", share_of_electricity_pct: "7.6" },

      { Entity: "Germany", Year: "1990", electricity_from_nuclear_twh: "152.4", share_of_electricity_pct: "27.7" },
      { Entity: "Germany", Year: "2000", electricity_from_nuclear_twh: "169.6", share_of_electricity_pct: "29.5" },
      { Entity: "Germany", Year: "2010", electricity_from_nuclear_twh: "140.6", share_of_electricity_pct: "22.4" },
      { Entity: "Germany", Year: "2020", electricity_from_nuclear_twh: "60.9", share_of_electricity_pct: "11.3" },
      { Entity: "Germany", Year: "2022", electricity_from_nuclear_twh: "8.8", share_of_electricity_pct: "1.7" },

      { Entity: "Russia", Year: "1990", electricity_from_nuclear_twh: "118.0", share_of_electricity_pct: "12.2" },
      { Entity: "Russia", Year: "2000", electricity_from_nuclear_twh: "129.9", share_of_electricity_pct: "15.0" },
      { Entity: "Russia", Year: "2010", electricity_from_nuclear_twh: "170.4", share_of_electricity_pct: "16.5" },
      { Entity: "Russia", Year: "2020", electricity_from_nuclear_twh: "215.7", share_of_electricity_pct: "20.6" },
      { Entity: "Russia", Year: "2022", electricity_from_nuclear_twh: "214.5", share_of_electricity_pct: "19.6" },

      { Entity: "South Korea", Year: "1990", electricity_from_nuclear_twh: "52.9", share_of_electricity_pct: "49.1" },
      { Entity: "South Korea", Year: "2000", electricity_from_nuclear_twh: "108.8", share_of_electricity_pct: "40.9" },
      { Entity: "South Korea", Year: "2010", electricity_from_nuclear_twh: "148.6", share_of_electricity_pct: "32.2" },
      { Entity: "South Korea", Year: "2020", electricity_from_nuclear_twh: "160.0", share_of_electricity_pct: "29.6" },
      { Entity: "South Korea", Year: "2022", electricity_from_nuclear_twh: "180.5", share_of_electricity_pct: "29.4" },
    ]

    return NextResponse.json({
      data: fallbackData,
      error: "Using fallback data due to error: " + (error instanceof Error ? error.message : String(error)),
    })
  }
}
