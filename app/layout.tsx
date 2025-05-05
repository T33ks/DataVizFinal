import type React from "react"
import type { Metadata } from "next"
import { Press_Start_2P, Space_Mono, VT323 } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"

// Pixel font for headings and special elements
const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  display: "swap",
})

// Better readability font for data visualization (monospace with better legibility)
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
})

// Alternative pixel font with better readability for data values
const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Nuclear Energy Dashboard",
  description: "A data visualization dashboard for nuclear energy statistics and comparisons",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className={`${pressStart2P.variable} ${spaceMono.variable} ${vt323.variable} font-pixel bg-black text-green-400`}>
        <ThemeProvider>
          <Suspense>
            {children}
            <Analytics />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
