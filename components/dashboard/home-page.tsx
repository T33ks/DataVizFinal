"use client"

import Link from "next/link"
import { AnimatedAtomIcon } from "../icons/animated-atom-icon"
import PixelPanel from "../ui/pixel-panel"

export default function HomePage() {
  return (
    <div className="min-h-screen pixel-scanline bg-black flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4 relative">
          <div className="absolute w-24 h-24 rounded-full bg-green-400/5 animate-pulse"></div>
          <AnimatedAtomIcon className="w-20 h-20 text-green-400 relative z-10" />
        </div>
        <h1 className="text-3xl md:text-4xl font-pixel neon-text tracking-wider mb-2">NUCLEAR DASHBOARD</h1>
        <p className="text-sm text-green-300 mt-1">ENERGY VISUALIZATION SYSTEM</p>
      </div>

      <div className="w-full max-w-md mx-auto">
        <PixelPanel title="WELCOME" className="text-center">
          <div className="p-10 flex flex-col items-center">
            <p className="mb-10 text-green-300 max-w-sm mx-auto text-center">
              Welcome to the Nuclear Energy Dashboard, a visualization tool for global nuclear energy data.
            </p>
            
            <div className="text-center">
              <Link 
                href="/dashboard" 
                className="inline-block px-8 py-4 bg-green-400 text-black font-pixel hover:bg-green-500 transition-colors text-lg 
                           relative overflow-hidden group shadow-[0_0_15px_rgba(74,222,128,0.5)]"
              >
                <span className="relative z-10">PROCEED</span>
                <span className="absolute inset-0 bg-green-300 opacity-0 group-hover:opacity-20 
                                 transition-opacity duration-300"></span>
                <span className="absolute -inset-x-2 bottom-0 h-0.5 bg-green-300 opacity-70 
                                 animate-pulse"></span>
              </Link>
            </div>
          </div>
        </PixelPanel>

        <div className="mt-6 text-center">
          <Link href="/help" className="text-xs text-green-300 hover:text-green-400 underline">
            Help & Documentation
          </Link>
        </div>
      </div>
    </div>
  )
}