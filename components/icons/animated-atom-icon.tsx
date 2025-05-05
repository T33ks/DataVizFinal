"use client"

interface AnimatedAtomIconProps {
  className?: string
}

export function AnimatedAtomIcon({ className }: AnimatedAtomIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Nucleus - with pulsing glow effect */}
      <circle 
        cx="12" 
        cy="12" 
        r="2" 
        fill="currentColor" 
        className="animate-pulse nuclear-core"
      />

      {/* Orbital paths */}
      <ellipse 
        cx="12" 
        cy="12" 
        rx="9" 
        ry="4" 
        className="orbital-path" 
      />
      <ellipse 
        cx="12" 
        cy="12" 
        rx="9" 
        ry="4" 
        transform="rotate(60 12 12)" 
        className="orbital-path" 
      />
      <ellipse 
        cx="12" 
        cy="12" 
        rx="9" 
        ry="4" 
        transform="rotate(120 12 12)" 
        className="orbital-path" 
      />

      {/* Animated electrons */}
      <g className="electron-orbit-1">
        <circle 
          cx="21" 
          cy="12" 
          r="1" 
          fill="currentColor" 
          className="electron" 
        />
      </g>
      
      <g className="electron-orbit-2">
        <circle 
          cx="7.5" 
          cy="6.5" 
          r="1" 
          fill="currentColor" 
          className="electron" 
        />
      </g>
      
      <g className="electron-orbit-3">
        <circle 
          cx="7.5" 
          cy="17.5" 
          r="1" 
          fill="currentColor" 
          className="electron" 
        />
      </g>

      {/* Inner glow for nucleus */}
      <circle 
        cx="12" 
        cy="12" 
        r="2.5" 
        className="nuclear-glow"
        fill="none"
        strokeWidth="0.5"  
      />
      
      <style jsx>{`
        .orbital-path {
          opacity: 0.5;
        }
        
        .nuclear-glow {
          stroke: currentColor;
          opacity: 0.7;
          filter: blur(1px);
          animation: pulse 2s infinite ease-in-out;
        }

        .nuclear-core {
          filter: drop-shadow(0 0 3px currentColor);
        }
        
        .electron-orbit-1 {
          animation: orbit1 6s infinite linear;
          transform-origin: 12px 12px;
        }
        
        .electron-orbit-2 {
          animation: orbit2 8s infinite linear;
          transform-origin: 12px 12px;
        }
        
        .electron-orbit-3 {
          animation: orbit3 7s infinite linear;
          transform-origin: 12px 12px;
        }
        
        .electron {
          filter: drop-shadow(0 0 2px currentColor);
        }
        
        @keyframes orbit1 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes orbit2 {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        @keyframes orbit3 {
          from { transform: rotate(120deg); }
          to { transform: rotate(480deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.3; stroke-width: 0.3; }
          50% { opacity: 0.7; stroke-width: 0.7; }
          100% { opacity: 0.3; stroke-width: 0.3; }
        }
      `}</style>
    </svg>
  )
}