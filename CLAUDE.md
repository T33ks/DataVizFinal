# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands
- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code quality issues

## Code Style Guidelines
- **Imports**: Group imports by 3rd-party, then project imports with a blank line between groups
- **TypeScript**: Use explicit types for function parameters, return types, and state variables
- **Components**: Always use functional components with proper TypeScript interfaces for props
- **Naming**:
  - React components use PascalCase and have .tsx extension
  - Utilities use camelCase and have .ts extension
  - CSS files use kebab-case
- **Error Handling**: Use try/catch with appropriate fallbacks (see data-utils.ts)
- **CSS/Styling**: Use Tailwind classes with clsx/cva for conditional styling
- **Data Visualization**: Charts should be responsive and have proper error states
- **Formatting**: Follow Next.js/React ecosystem patterns with "use client" directives