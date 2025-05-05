export interface NuclearDataPoint {
  Entity: string
  Code: string
  Year: string
  value: number
}

export interface ChartData {
  Entity: string
  Code: string
  Year: string
  [key: string]: any
}

export interface CountryData {
  country: string
  data: NuclearDataPoint[]
}
