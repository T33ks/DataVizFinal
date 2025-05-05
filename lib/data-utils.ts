// Helper function to validate JSON response
async function validateAndParseJSON(response: Response, errorMessage: string) {
  const text = await response.text()

  try {
    // Try to parse the text as JSON
    return JSON.parse(text)
  } catch (error) {
    console.error(`Invalid JSON: ${text.substring(0, 100)}...`)
    throw new Error(`${errorMessage}: Invalid JSON format - ${error.message}`)
  }
}

// Fetch death rates data with fallback
export async function fetchDeathRates() {
  try {
    // Use the local JSON file instead of the blob URL
    const response = await fetch("/data/death_rates.json")

    if (!response.ok) {
      throw new Error(`Failed to fetch death rates data: ${response.status} ${response.statusText}`)
    }

    // Use the helper function to validate and parse JSON
    return await validateAndParseJSON(response, "Failed to parse death rates data")
  } catch (error) {
    console.error("Error fetching death rates:", error)

    // Fallback data for death rates
    return [
      { Entity: "Coal", "Deaths per TWh of electricity production": 24.62 },
      { Entity: "Oil", "Deaths per TWh of electricity production": 18.43 },
      { Entity: "Natural Gas", "Deaths per TWh of electricity production": 2.82 },
      { Entity: "Biomass", "Deaths per TWh of electricity production": 4.63 },
      { Entity: "Nuclear", "Deaths per TWh of electricity production": 0.07 },
      { Entity: "Wind", "Deaths per TWh of electricity production": 0.04 },
      { Entity: "Hydropower", "Deaths per TWh of electricity production": 0.02 },
      { Entity: "Solar", "Deaths per TWh of electricity production": 0.02 },
    ]
  }
}

// Fetch energy mix data with fallback
export async function fetchEnergyMix() {
  try {
    const response = await fetch(
      "https://blobs.vusercontent.net/blob/energy_mix_dashboard-PyTTrofHogRC39SL3yVfFfXWLeeboZ.json",
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch energy mix data: ${response.status} ${response.statusText}`)
    }

    // Use the helper function to validate and parse JSON
    return await validateAndParseJSON(response, "Failed to parse energy mix data")
  } catch (error) {
    console.error("Error fetching energy mix:", error)

    // Fallback data for energy mix
    return {
      Nuclear_pct: 10.3,
      Coal_pct: 36.7,
      Oil_pct: 3.1,
      Gas_pct: 23.5,
      Hydropower_pct: 15.8,
      Wind_pct: 5.9,
      Solar_pct: 3.2,
      Biofuels_pct: 1.2,
      "Other renewables_pct": 0.2,
      "Traditional biomass_pct": 0.1,
    }
  }
}

// Fetch country profiles data with fallback
export async function fetchCountryProfiles() {
  try {
    const response = await fetch(
      "https://blobs.vusercontent.net/blob/country_profiles-Ks9Tro3HogRC39SL3yVfFfXWLeeboZ.json",
    )

    if (!response.ok) {
      // If the file doesn't exist or there's a server error, use fallback data
      console.warn("Country profiles data not available, using fallback data")
      return getCountryProfilesFallbackData()
    }

    try {
      // Use the helper function to validate and parse JSON
      return await validateAndParseJSON(response, "Failed to parse country profiles data")
    } catch (error) {
      console.error("Error parsing country profiles data:", error)
      return getCountryProfilesFallbackData()
    }
  } catch (error) {
    console.error("Error fetching country profiles:", error)
    return getCountryProfilesFallbackData()
  }
}

// Fallback data for country profiles
function getCountryProfilesFallbackData() {
  return [
    {
      Entity: "France",
      latest_nuclear_twh: 335.65,
      latest_share_pct: 65.28759,
      decade_growth_rate: -0.2412803182712087,
      "Per capita electricity - kWh": 8524.836,
      cluster: 0,
      pca_x: 2.0992754982484896,
      pca_y: -0.4977064085297052,
      tsne_x: 2.936413049697876,
      tsne_y: -5.452370643615723,
    },
    {
      Entity: "United States",
      latest_nuclear_twh: 775.35,
      latest_share_pct: 18.247608,
      decade_growth_rate: -0.018792710706150368,
      "Per capita electricity - kWh": 12325.368,
      cluster: 0,
      pca_x: 0.8844046638857633,
      pca_y: 1.0693402389463567,
      tsne_x: 1.6389719247817993,
      tsne_y: -6.206027507781982,
    },
    {
      Entity: "Germany",
      latest_nuclear_twh: 8.75,
      latest_share_pct: 1.733394,
      decade_growth_rate: -0.9189589700842826,
      "Per capita electricity - kWh": 6945.45,
      cluster: 1,
      pca_x: -0.4185823672971118,
      pca_y: -0.02806772581800835,
      tsne_x: 0.6022857427597046,
      tsne_y: -5.677921772003174,
    },
    {
      Entity: "Japan",
      latest_nuclear_twh: 77.44,
      latest_share_pct: 7.6407733,
      decade_growth_rate: -0.5247038605536121,
      "Per capita electricity - kWh": 8183.046,
      cluster: 1,
      pca_x: -0.039128875890496434,
      pca_y: 0.004836991348098951,
      tsne_x: 0.9502581357955933,
      tsne_y: -5.730170726776123,
    },
    {
      Entity: "United Kingdom",
      latest_nuclear_twh: 41.29,
      latest_share_pct: 14.068623,
      decade_growth_rate: -0.401420701652653,
      "Per capita electricity - kWh": 4587.4736,
      cluster: 1,
      pca_x: -0.3530656716589692,
      pca_y: -0.2521433839958847,
      tsne_x: 0.8469322323799133,
      tsne_y: -5.219177722930908,
    },
    {
      Entity: "China",
      latest_nuclear_twh: 383.2,
      latest_share_pct: 5.0,
      decade_growth_rate: 2.1,
      "Per capita electricity - kWh": 5312.0,
      cluster: 1,
      pca_x: -0.5,
      pca_y: 0.8,
      tsne_x: 0.7,
      tsne_y: -4.5,
    },
    {
      Entity: "Russia",
      latest_nuclear_twh: 215.7,
      latest_share_pct: 20.6,
      decade_growth_rate: 0.15,
      "Per capita electricity - kWh": 7240.0,
      cluster: 0,
      pca_x: 1.1,
      pca_y: -0.3,
      tsne_x: 2.1,
      tsne_y: -5.3,
    },
    {
      Entity: "South Korea",
      latest_nuclear_twh: 180.49,
      latest_share_pct: 29.386671,
      decade_growth_rate: 0.1665589451913134,
      "Per capita electricity - kWh": 11613.514,
      cluster: 0,
      pca_x: 1.2408719250969573,
      pca_y: -0.11797923551005936,
      tsne_x: 1.9840492010116577,
      tsne_y: -6.047524929046631,
    },
    {
      Entity: "India",
      latest_nuclear_twh: 48.19,
      latest_share_pct: 2.4488032,
      decade_growth_rate: 0.4956548727498448,
      "Per capita electricity - kWh": 1218.2467,
      cluster: 1,
      pca_x: -1.3430232392444874,
      pca_y: -0.1745018888843826,
      tsne_x: 0.028736334294080734,
      tsne_y: -4.996639251708984,
    },
    {
      Entity: "Iran",
      latest_nuclear_twh: 6.57,
      latest_share_pct: 1.8097678,
      decade_growth_rate: 58.72727272727273,
      "Per capita electricity - kWh": 3927.6218,
      cluster: 2,
      pca_x: -3.9343302582150455,
      pca_y: -2.576316661348931,
      tsne_x: -0.7502555847167969,
      tsne_y: -4.26800012588501,
    },
  ]
}

// Fetch and process reactor data with improved error handling
export async function fetchReactorData() {
  try {
    // First try to fetch the Nuclear_Operational_Sites.csv data
    const response = await fetch("/api/nuclear-sites")

    if (!response.ok) {
      throw new Error(`Failed to fetch nuclear sites data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.sites || !Array.isArray(data.sites) || data.sites.length === 0) {
      throw new Error("Invalid or empty nuclear sites data")
    }

    // Process the sites data to get country-level aggregates
    const countryMap = new Map()

    data.sites.forEach((site: any) => {
      const countryName = site.country

      if (!countryMap.has(countryName)) {
        countryMap.set(countryName, {
          name: countryName,
          operational: 0,
          shutdown: 0,
          construction: 0,
          totalReactors: 0,
        })
      }

      const countryData = countryMap.get(countryName)
      countryData.operational += site.operational || 0
      countryData.shutdown += site.shutdown || 0
      countryData.construction += site.construction || 0
      countryData.totalReactors += site.totalReactors || 0
    })

    return Array.from(countryMap.values())
  } catch (error) {
    console.error("Error fetching reactor data:", error)

    // Fallback data for reactors
    return [
      { name: "United States", operational: 94, shutdown: 41, construction: 0, totalReactors: 135 },
      { name: "France", operational: 57, shutdown: 14, construction: 0, totalReactors: 71 },
      { name: "China", operational: 57, shutdown: 0, construction: 28, totalReactors: 85 },
      { name: "Russia", operational: 36, shutdown: 11, construction: 4, totalReactors: 51 },
      { name: "Korea, Republic of", operational: 26, shutdown: 2, construction: 2, totalReactors: 30 },
      { name: "Canada", operational: 17, shutdown: 8, construction: 0, totalReactors: 25 },
      { name: "Ukraine", operational: 15, shutdown: 4, construction: 2, totalReactors: 21 },
      { name: "United Kingdom", operational: 9, shutdown: 36, construction: 2, totalReactors: 47 },
      { name: "Spain", operational: 7, shutdown: 3, construction: 0, totalReactors: 10 },
      { name: "India", operational: 21, shutdown: 0, construction: 6, totalReactors: 27 },
      { name: "Japan", operational: 14, shutdown: 27, construction: 2, totalReactors: 43 },
      { name: "Germany", operational: 0, shutdown: 33, construction: 0, totalReactors: 33 },
    ]
  }
}

// New function to fetch and parse Nuclear_Operational_Sites.csv
export async function fetchNuclearSites() {
  try {
    const response = await fetch("/api/nuclear-sites")

    if (!response.ok) {
      throw new Error(`Failed to fetch nuclear sites data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.sites || !Array.isArray(data.sites)) {
      throw new Error("Invalid nuclear sites data format")
    }

    return data.sites
  } catch (error) {
    console.error("Error fetching nuclear sites:", error)
    throw error
  }
}
