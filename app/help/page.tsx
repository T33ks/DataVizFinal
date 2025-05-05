import Link from "next/link"
import { AnimatedAtomIcon } from "@/components/icons/animated-atom-icon"
import PixelPanel from "@/components/ui/pixel-panel"

export default function HelpPage() {
  return (
    <div className="min-h-screen pixel-scanline bg-black">
      <header className="sticky top-0 z-40 pixel-border p-4 flex flex-col md:flex-row items-center justify-between bg-black">
        <div className="flex items-center space-x-4">
          <AnimatedAtomIcon className="w-10 h-10 text-green-400" />
          <div>
            <h1 className="text-xl md:text-2xl font-pixel neon-text tracking-wider">HELP & DOCUMENTATION</h1>
            <p className="text-xs text-green-300 mt-1">NUCLEAR DASHBOARD</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            href="/" 
            className="text-green-400 hover:text-green-300 underline mr-6"
          >
            Home
          </Link>
          <Link 
            href="/dashboard" 
            className="text-green-400 hover:text-green-300 underline"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <PixelPanel title="NAVIGATION GUIDE">
            <div className="p-6">
              <h3 className="text-lg font-pixel neon-text mb-4">Dashboard Controls</h3>
              <ul className="space-y-4 text-green-300 mb-8">
                <li>
                  <span className="font-bold text-green-400">Control Panel:</span> Use the sidebar to navigate between different visualization sections. You can toggle the control panel visibility using the arrow button on the left.
                </li>
                <li>
                  <span className="font-bold text-green-400">Country Selection:</span> Most panels allow you to filter data by selecting specific countries. Click on country names to include/exclude them from visualizations.
                </li>
                <li>
                  <span className="font-bold text-green-400">Interactive Charts:</span> Hover over data points, bars, and map regions for detailed information via tooltips.
                </li>
                <li>
                  <span className="font-bold text-green-400">Scale Toggle:</span> Some charts (like Safety Comparison) offer logarithmic/linear scale options for better data comparison of values with different magnitudes.
                </li>
              </ul>
              
              <h3 className="text-lg font-pixel neon-text mb-4">DASHBOARD SECTIONS</h3>
              <div className="space-y-6 mb-8">
                <div className="bg-black/30 p-4 border border-green-400/30 rounded">
                  <h4 className="font-bold text-green-400 mb-2">Country Profiles</h4>
                  <p className="text-sm text-green-300">
                    Interactive scatter plot showing country clusters based on nuclear energy profiles.
                    Toggle between PCA and t-SNE views for different perspectives on how countries relate to each other
                    based on their nuclear energy characteristics.
                  </p>
                </div>
                
                <div className="bg-black/30 p-4 border border-green-400/30 rounded">
                  <h4 className="font-bold text-green-400 mb-2">Safety Comparison</h4>
                  <p className="text-sm text-green-300">
                    Bar chart comparing mortality rates across different energy sources.
                    The logarithmic scale option helps visualize the vast differences between safer and more dangerous
                    energy sources, making small values like those for nuclear and renewables visible alongside larger values.
                  </p>
                </div>
                
                <div className="bg-black/30 p-4 border border-green-400/30 rounded">
                  <h4 className="font-bold text-green-400 mb-2">Energy Mix</h4>
                  <p className="text-sm text-green-300">
                    Pie chart showing the global distribution of energy sources.
                    This visualization helps understand nuclear energy's place in the global energy landscape
                    and how it compares to other sources like coal, gas, and renewables.
                  </p>
                </div>
                
                <div className="bg-black/30 p-4 border border-green-400/30 rounded">
                  <h4 className="font-bold text-green-400 mb-2">Reactors Map</h4>
                  <p className="text-sm text-green-300">
                    World map displaying operational nuclear reactors by country.
                    Countries are color-coded based on the number of operational reactors, and hovering
                    provides additional information on shutdown and under-construction reactors.
                  </p>
                </div>
                
                <div className="bg-black/30 p-4 border border-green-400/30 rounded">
                  <h4 className="font-bold text-green-400 mb-2">Power Generation</h4>
                  <p className="text-sm text-green-300">
                    Line chart tracking nuclear power generation over time by country.
                    The "Top 5 by Share" button highlights countries with the highest share of nuclear
                    power in their electricity mix, allowing for quick identification of leaders.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <Link 
                  href="/dashboard" 
                  className="inline-block px-6 py-3 bg-green-400 text-black font-pixel hover:bg-green-500 transition-colors"
                >
                  GO TO DASHBOARD
                </Link>
              </div>
            </div>
          </PixelPanel>
        </div>
      </div>
    </div>
  )
}