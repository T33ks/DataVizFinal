"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import ErrorDisplay from "../ui/error-display"

export default function PaperDisplay() {
  const [paperContent, setPaperContent] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")

  useEffect(() => {
    // Set the content directly
    try {
      setPaperContent(`# Abstract

This paper summarizes insights drawn from multiple articles, public data sets and analyses conducted surrounding Global Nuclear Energy generation. Trends from authoritative datasets (such as International Energy Agency's *World Energy Outlook* and Our World in Data public nuclear datasets) as of mid-2020s assessments show nuclear provides 9 – 10 % of the world's energy, making it the second-largest source of low-carbon electricity after hydropower. When comparing safety data across energy sources, nuclear emerges among the world's safest and cleanest large-scale power generators—yet its adoption has been met with intense scrutiny, and timelines to build and operationalize reactors take years if not decades. The synthesis of this paper comes in the form of a data-visualization dashboard built with Next.js, React, D3.js, and Tailwind CSS. Many more insights are discussed in the following sections. The final product is an interactive dashboard that explores historical trends, comparative metrics, and country clustering—and concludes with insights on nuclear energy's position in the future energy mix.

---

## Introduction

Since the first commercial reactors in the 1950s, nuclear energy has evolved from a novel technology to an established power source in dozens of countries. Its development is entangled with decarbonization and technological advancement in the power sector. As countries look for ways to leverage existing systems and rapidly decarbonize amid rising energy demand (from emerging technologies such as artificial intelligence) and climate change, it is very important to understand nuclear's historic and current role—as well as how it compares against other "green" energy sources. This project uses Next.js, React, D3.js, and Tailwind CSS to provide a web-based dashboard that addresses the following questions:

1. How has nuclear's contribution changed over time and by region?  
2. How safe and efficient is nuclear relative to other sources?  
3. What is nuclear's role in the global energy mix?  
4. Can nations be clustered by similar nuclear profiles?  

---

## Background

By the late 1960s and early 1970s, worldwide reactor construction surged, with a steep fall-off after the Chernobyl disaster. This event lives in infamy as the moment that many cited as proof that nuclear energy is a bad idea.

![Figure 1: Reactors Under Construction]  
*Figure 1: Reactors Under Construction (chart provided by World Nuclear Association)*

The dramatic drop in production post-Chernobyl later saw a resurgence in Eastern countries in the late 2000s, then stalled following Fukushima. Life-extensions and new builds in Asia have since stabilized output around 2 650 TWh per year. Thirty-one countries operate 440 reactors, with France utilizing nuclear energy as one of its primary electricity sources.

![Figure 2: Share of Electricity Production from Nuclear]  
*Figure 2: Share of Electricity Production from Nuclear (provided by Our World in Data)*

Many emerging economies are only now considering their first nuclear reactor plants, despite high capital costs, long lead times, and public-perception hurdles. Demand is rising both from data centers powering AI and from population growth; nuclear offers a path to clean, reliable energy and rapid decarbonization in the face of climate change.

---

## Approach

The approach was straightforward:

1. **Survey the current state of nuclear energy production** and growing global energy consumption trends.  
2. **Source datasets** from authoritative and non-profit organizations (e.g., IEA, Our World in Data).  
3. **Build visualizations** highlighting selected patterns and insights:  
   - (a) A world map of reactor locations  
   - (b) Time-series lines of nuclear generation and share  
   - (c) Bar charts of deaths per TWh for seven energy sources  
   - (d) A pie chart of the latest global electricity mix  
   - (e) Scatter plots relating nuclear metrics to per-capita demand and GDP  

Since the IAEA's PRIS data isn't publicly downloadable, we relied on curated CSVs from Our World in Data (sourced originally from IAEA/Energy Institute). This minimized cleanup effort and provided a solid basis for the dashboard. Users can filter by region, toggle logarithmic scales, highlight clusters, and even simulate energy production in a "Reactor Workspace."

---

## Results

Below are walkthrough screenshots of each dashboard module. (Interactive versions are available in the deployed app.)

1. **Reactor Map**  
   ![Figure 3: Reactor Map]  
   Users see global reactor adoption; hovering reveals site metadata. Regions can be highlighted interactively.

2. **Power Generation by Country**  
   ![Figure 4: Power Generation by Country]  
   Displays nuclear generation amounts and share per country.

3. **Safety Analysis by Energy Source**  
   ![Figure 5: Safety Analysis by Energy Source]  
   Coal is ~800× deadlier than nuclear; oil ~600×; gas ~100×. Wind, solar, and nuclear cluster near zero deaths-per-TWh. A log scale toggle is provided, plus links to deep-dive articles on Chernobyl and Fukushima.

4. **Global Energy Mix**  
   ![Figure 6: Energy Generation Allocated by Source]  
   Pie chart of current global electricity mix with filtering by source.

5. **K-means Clustering of Nuclear Nations**  
   ![Figure 7: K-means Clustering of Nuclear Nations]  
   Clusters:  
   - High-reliance states (France, Slovakia)  
   - Moderate users (USA, UK, South Korea)  
   - Emerging programs (China, India)

6. **Reactor Workspace (Simulator)**  
   ![Figure 8: Energy Reactor Simulator]  
   Sandbox for users to explore output vs. safety trade-offs; results can be exported.

> **Note:** One additional dashboard is top-secret—accessible only with special credentials (password: *Nuclear*).

---

## Conclusion

Nuclear energy holds dramatic decarbonization potential and can meet rising future demands. However, adoption remains slow due to high costs, long build times, and public stigma. This dashboard demonstrates that nuclear is among the safest green alternatives. With more development time, additional features, bug fixes, and access to PRIS data could deepen insights. This project is a first step toward interactive, source-linked visualizations to inform and shift perceptions of nuclear energy's strengths, weaknesses, and future pathways.

---

## References

- Bove, T. (2021, April 14). *Nuclear & the rest: Which is the safest energy source?* Earth.Org. https://earth.org/nuclear-which-is-the-safest-energy-source/  
- Goldman Sachs Research. (n.d.). *AI to drive 165% increase in data center power demand by 2030.* Goldman Sachs.  
- International Energy Agency. (2023). *World energy outlook 2023.* https://iea.blob.core.windows.net/assets/ed1e4c42-5726-4269-b801-97b3d32e117c/WorldEnergyOutlook2023.pdf  
- OECD Nuclear Energy Agency. (2023). *2022 NEA annual report.* https://www.oecd-nea.org/upload/docs/application/pdf/2023-12/nea_ar_2022.pdf  
- Ritchie, H. (2017). *What was the death toll from Chernobyl and Fukushima?* Our World in Data. https://ourworldindata.org/what-was-the-death-toll-from-chernobyl-and-fukushima  
- Ritchie, H. (2020). *What are the safest and cleanest sources of energy?* Our World in Data. https://ourworldindata.org/safest-sources-of-energy  
- Ritchie, H., & Rosado, P. (2020). *Nuclear energy.* Our World in Data. https://ourworldindata.org/nuclear-energy  
- Ritchie, H., Rosado, P., & Roser, M. (2020, July). *Energy production and consumption.* Our World in Data. https://ourworldindata.org/energy-production-consumption  
- World Nuclear Association. (2024). *World nuclear performance report 2024.* https://world-nuclear.org/images/articles/World-Nuclear-Performance-Report-2024.pdf  
`)
      setLoading(false)
    } catch (err: any) {
      console.error("Error setting paper content:", err)
      setError(err.message)
      setLoading(false)
    }
  }, [])

  const handlePasswordSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Always authorize regardless of what password was entered
      setAuthorized(true);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
        <span className="text-xs">LOADING DOCUMENT...</span>
      </div>
    )
  }

  if (error && !paperContent) {
    return <ErrorDisplay message={error} />
  }

  // Login screen
  if (!authorized) {
    return (
      <div className="h-[500px] bg-black p-4 flex flex-col items-center justify-center">
        <div className="bg-black border-2 border-green-400 p-8 rounded max-w-md w-full text-center">
          <h3 className="text-xl text-green-400 mb-6 font-pixel neon-text">TOP SECRET ACCESS</h3>
          <div className="mb-4">
            <div className="text-green-400 text-xs text-left mb-2">ENTER SECURITY CLEARANCE CODE:</div>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handlePasswordSubmit}
              className="w-full bg-black border-2 border-green-400 text-green-400 px-3 py-2 font-mono tracking-wider focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
              autoFocus
            />
            <div className="text-gray-500 text-xs text-right mt-2">Press Enter to submit</div>
          </div>
          <div className="text-green-300 text-xs animate-pulse mt-6">
            SECURITY CLEARANCE VERIFICATION IN PROGRESS...
          </div>
        </div>
      </div>
    );
  }

  // Actual content after login
  return (
    <div className="h-[500px] overflow-y-auto pr-4 custom-scrollbar">
      <div className="markdown bg-black p-4 text-green-400">
        <ReactMarkdown 
          components={{
            h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-4 text-green-300 neon-text" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-6 mb-3 text-green-300" {...props} />,
            a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
            p: ({node, ...props}) => <p className="mb-4" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-4" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-4" {...props} />,
            li: ({node, ...props}) => <li className="mb-1" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-green-400 pl-4 italic my-4" {...props} />,
            img: ({node, ...props}) => <div className="my-4"><span className="text-yellow-400">Image Placeholder: </span>{props.alt}</div>,
            em: ({node, ...props}) => <em className="text-green-200 not-italic" {...props} />
          }}
        >
          {paperContent}
        </ReactMarkdown>
      </div>
    </div>
  )
}