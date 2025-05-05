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

## Technical Implementation
- **Framework**: Next.js with React
- **Styling**: Tailwind CSS
- **Visualizations**: D3.js for custom charts
- **Data Sources**: CSV and JSON files in the `/public/data/` directory