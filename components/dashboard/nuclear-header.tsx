"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AnimatedAtomIcon } from "../icons/animated-atom-icon"
import { HomeIcon } from "lucide-react"

export default function NuclearHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())
  useEffect(() => {
    // Update the time every second
    const timeTimer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Clean up the interval on component unmount
    return () => {
      clearInterval(timeTimer)
    }
  }, [])

  // Format date and time with leading zeros
  const formatTimeUnit = (unit: number) => {
    return unit.toString().padStart(2, "0")
  }

  const formattedDate = `${currentTime.getFullYear()}-${formatTimeUnit(currentTime.getMonth() + 1)}-${formatTimeUnit(currentTime.getDate())}`
  const formattedTime = `${formatTimeUnit(currentTime.getHours())}:${formatTimeUnit(currentTime.getMinutes())}:${formatTimeUnit(currentTime.getSeconds())}`

  return (
    <header className="sticky top-0 z-40 pixel-border p-4 flex flex-col md:flex-row items-center justify-between bg-black">
      <div className="flex items-center space-x-4">
        <AnimatedAtomIcon className="w-10 h-10 text-green-400" />
        <div>
          <h1 className="text-xl md:text-2xl font-pixel neon-text tracking-wider">NUCLEAR DASHBOARD</h1>
          <p className="text-xs text-green-300 mt-1">ENERGY VISUALIZATION SYSTEM</p>
        </div>
      </div>
      <div className="mt-4 md:mt-0 flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2 text-green-400 hover:text-green-300 mr-4">
          <HomeIcon size={18} />
          <span className="text-xs">HOME</span>
        </Link>
        
        <div className="text-right">
          <div className="text-xs text-green-300">SYSTEM TIME</div>
          <div className="text-sm neon-text font-mono">
            <span className="mr-2">{formattedDate}</span>
            <span>{formattedTime}</span>
          </div>
          <div className="text-xs opacity-50 text-[#FF7F00]">Created by: Trenton Kenney</div>
        </div>
      </div>
    </header>
  )
}
