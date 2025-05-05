
# Nuclear Dashboard Project

## Overview
A data visualization dashboard for nuclear energy data across the globe. Features interactive charts, maps, and data comparisons with a unified retro/cyberpunk UI theme.

## Key Features
- **Home Page**: Clean welcome screen with animated atomic icon
- **Dashboard Interface**: Interactive visualizations with hide/show control panel
- **Data Visualizations**:
  - Country Profiles (PCA/t-SNE scatter plots)
  - Safety Comparison (logarithmic/linear bar charts)
  - Global Energy Mix (pie chart)
  - Nuclear Reactors Map (operational reactors by country)
  - Power Generation (time-series line charts)

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
- **Data Sources**:
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

## Recent Improvements
1. Created dedicated Home page with minimalist welcome screen
2. Added Help page with detailed navigation guide
3. Implemented hide/show toggle for the Control Panel
4. Enhanced Safety Comparison chart with logarithmic scale toggle
5. Replaced static atom with animated version (orbiting electrons)
6. Fixed nuclear reactor map to properly display operational reactors
7. Updated loading screen with non-spinning animated icon
8. Added nuclear-themed glow effects throughout the application

## Key Components
- **AnimatedAtomIcon**: The centerpiece visual element with CSS animations
- **PixelPanel**: Base component for all dashboard panels
- **ReactorsMapDirect**: Directly reads CSV data for reactor visualization
- **SafetyBarChart**: Features logarithmic/linear scale toggle for safety data
- **NuclearDashboard**: Main container with data fetching and display logic

## Future Development
- Consider adding more interactive filtering options
- Explore time-based animations showing reactor development over decades
- Add country-specific detailed pages with deeper analysis
- Implement data export functionality
- Consider adding comparison features between multiple countries

## Style Notes
- Primary color: #4ade80 (green-400)
- Font: Pixel-style for headings, monospace for data
- Animation timing: 4-10s for slow pulses, 0.6-2s for interactive elements