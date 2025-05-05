import { NextResponse } from "next/server"
import { parse } from "csv-parse/sync"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Try to read from the local file first
    let csvData: string
    try {
      const filePath = path.join(process.cwd(), "public/data/Nuclear_Operational_Sites.csv")
      csvData = fs.readFileSync(filePath, "utf8")
    } catch (fileError) {
      // If local file fails, try to fetch from the blob URL
      console.warn("Could not read local file, trying blob URL:", fileError)
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nuclear_Operational_Sites-nn46a8C68F6BydED1RxSupMxrlaFz9.csv",
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch nuclear sites data: ${response.status} ${response.statusText}`)
      }

      csvData = await response.text()
    }

    // Validate CSV data before parsing
    if (!csvData || csvData.trim() === "") {
      throw new Error("Empty nuclear sites CSV data received")
    }

    // Parse CSV data
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    })

    // Process the data to extract site information
    const sites = records.map((record: any) => ({
      country: record.Country || "Unknown",
      operational: Number.parseInt(record["In Operation"]) || 0,
      shutdown: Number.parseInt(record.Shutdown) || 0,
      construction: Number.parseInt(record["Under Construction"]) || 0,
      totalReactors:
        (Number.parseInt(record["In Operation"]) || 0) +
        (Number.parseInt(record.Shutdown) || 0) +
        (Number.parseInt(record["Under Construction"]) || 0),
    }))

    return NextResponse.json({ sites })
  } catch (error) {
    console.error("Error in nuclear-sites API route:", error)

    // Fallback data for nuclear sites
    const fallbackSites = [
      {
        country: "United States",
        operational: 94,
        shutdown: 41,
        construction: 0,
        totalReactors: 135,
      },
      {
        country: "France",
        operational: 57,
        shutdown: 14,
        construction: 0,
        totalReactors: 71,
      },
      {
        country: "China",
        operational: 57,
        shutdown: 0,
        construction: 28,
        totalReactors: 85,
      },
      {
        country: "Russia",
        operational: 36,
        shutdown: 11,
        construction: 4,
        totalReactors: 51,
      },
      {
        country: "Korea, Republic of",
        operational: 26,
        shutdown: 2,
        construction: 2,
        totalReactors: 30,
      },
      {
        country: "Japan",
        operational: 14,
        shutdown: 27,
        construction: 2,
        totalReactors: 43,
      },
      {
        country: "Germany",
        operational: 0,
        shutdown: 33,
        construction: 0,
        totalReactors: 33,
      },
    ]

    return NextResponse.json({
      sites: fallbackSites,
      error: "Using fallback data due to error: " + (error instanceof Error ? error.message : String(error)),
    })
  }
}
