# Nuclear Energy Data Visualization Dashboard

## Overview
A data visualization dashboard that displays nuclear energy data across the globe. Features interactive charts, maps, and data comparisons with a unified retro/cyberpunk UI theme.

## Installation
To run this project locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Features
- **Home Page**: Clean welcome screen with animated atomic icon
- **Dashboard Interface**: Interactive visualizations with hide/show control panel
- **Data Visualizations**:
  - Country Profiles (PCA/t-SNE scatter plots)
  - Safety Comparison (logarithmic/linear bar charts)
  - Global Energy Mix (pie chart)
  - Nuclear Reactors Map (operational reactors by country)
  - Power Generation (time-series line charts)
  - Nuclear Reactor Workspace (interactive reactor simulator)

## UI/UX Enhancements
- **Animated Atomic Icon**: Core remains static while electrons orbit
- **Nuclear Glow Effects**: Pulsing glows mimic nuclear reactor aesthetic
- **Interactive Elements**: All charts have hover states and tooltips
- **Responsive Design**: Works on different screen sizes
- **Enhanced Loading Screen**: Themed loading experience between pages

## Technical Implementation
- **Framework**: Next.js with React
- **Styling**: Tailwind CSS with custom animation extensions
- **Visualizations**: D3.js for custom charts
- **Data Sources (Note these are sythesized from the RAW data folder)**:
  - `/public/data/Nuclear_Operational_Sites.csv` - Reactor data
  - `/public/data/world_nuclear_energy_generation.csv` - Power generation data
  - `/public/data/death_rates.json` - Safety comparison data

## Project Structure
- `/app` - Page routes and layouts
- `/components/charts` - D3.js visualization components
- `/components/dashboard` - Main dashboard interface components
- `/components/icons` - SVG icons including AnimatedAtomIcon
- `/components/ui` - Reusable UI components
- `/lib` - Data utilities and type definitions
- `/public/data` - Data sources

## Key Components
- **AnimatedAtomIcon**: The centerpiece visual element with CSS animations
- **PixelPanel**: Base component for all dashboard panels
- **ReactorsMapDirect**: Directly reads CSV data for reactor visualization
- **SafetyBarChart**: Features logarithmic/linear scale toggle for safety data
- **NuclearDashboard**: Main container with data fetching and display logic
- **ReactorWorkspacePanel**: Interactive nuclear reactor simulator

## Style Notes
- Primary color: #4ade80 (green-400)
- Font: Pixel-style for headings, monospace for data
- Animation timing: 4-10s for slow pulses, 0.6-2s for interactive elements

## Accessibility
See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for details about accessibility features and improvements implemented in this project.

## Future Development
- Consider adding more interactive filtering options
- Explore time-based animations showing reactor development over decades
- Add country-specific detailed pages with deeper analysis
- Implement data export functionality
- Consider adding comparison features between multiple countries
