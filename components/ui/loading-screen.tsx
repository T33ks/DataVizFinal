import { AnimatedAtomIcon } from "../icons/animated-atom-icon"

export default function LoadingScreen() {
  return (
    <div 
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 pixel-scanline"
      role="alert"
      aria-live="assertive"
      aria-label="Loading nuclear data"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-green-400/10 rounded-full filter blur-xl animate-pulse"></div>
        <AnimatedAtomIcon className="w-20 h-20 text-green-400 relative z-10" aria-hidden="true" />
      </div>

      <div className="mt-8 text-center max-w-sm mx-auto">
        <h2 className="text-xl font-data neon-text mb-6">LOADING NUCLEAR DATA</h2>
        
        {/* Fuel rod loading bar */}
        <div className="relative flex items-center justify-center mb-8" aria-hidden="true">
          <div className="absolute w-full h-2 bg-black border border-gray-700"></div>
          
          {/* Fuel rod segments */}
          <div className="relative w-80 h-8 bg-black border-2 border-gray-700 rounded-md flex overflow-hidden mx-auto" 
            role="progressbar" 
            aria-valuemin="0" 
            aria-valuemax="100" 
            aria-valuenow="50"
            aria-label="Loading progress"
          >
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="flex-1 h-full border-r border-gray-700 last:border-r-0 relative overflow-hidden"
              >
                <div 
                  className="absolute inset-0 bg-green-400 opacity-80"
                  style={{ 
                    animationName: 'fuel-load',
                    animationDuration: '3s', 
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.3}s`,
                    animationFillMode: 'both',
                    animationTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)'
                  }}
                ></div>
                <div 
                  className="absolute inset-0 bg-green-300"
                  style={{ 
                    opacity: 0,
                    animationName: 'fuel-glow',
                    animationDuration: '2s', 
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.3}s`,
                    animationFillMode: 'both' 
                  }}
                ></div>
              </div>
            ))}
          </div>
          
          {/* Control rods */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 h-12 w-1 bg-gray-600"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 h-12 w-1 bg-gray-600"></div>
        </div>
        
        <p className="text-sm font-mono text-green-300 flex items-center justify-center gap-1">
          <span className="inline-block">REACTOR INITIALIZATION</span>
          <span className="inline-flex w-8">
            <span className="animate-[pulse_0.6s_infinite]">.</span>
            <span className="animate-[pulse_0.6s_0.2s_infinite]">.</span>
            <span className="animate-[pulse_0.6s_0.4s_infinite]">.</span>
          </span>
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="pixel-panel">
          <p className="data-label flex items-center">
            <span className="mr-2 inline-block w-2 h-2 bg-green-400 rounded-full" aria-hidden="true"></span>
            SYSTEM: <span className="data-value text-green-400 ml-1">ONLINE</span>
          </p>
        </div>
        <div className="pixel-panel">
          <p className="data-label flex items-center">
            <span className="mr-2 inline-block w-2 h-2 bg-yellow-400 animate-pulse rounded-full" aria-hidden="true"></span>
            DATA: <span className="data-value text-yellow-400 ml-1">LOADING</span>
          </p>
        </div>
        <div className="pixel-panel">
          <p className="data-label flex items-center">
            <span className="mr-2 inline-block w-2 h-2 bg-green-400 rounded-full" aria-hidden="true"></span>
            SECURITY: <span className="data-value text-green-400 ml-1">ACTIVE</span>
          </p>
        </div>
        <div className="pixel-panel">
          <p className="data-label flex items-center">
            <span className="mr-2 inline-block w-2 h-2 bg-cyan-400 animate-[pulse_2s_infinite] rounded-full" aria-hidden="true"></span>
            REACTOR: <span className="data-value text-cyan-400 ml-1">STABLE</span>
          </p>
        </div>
      </div>
      
      {/* Accessible description for screen readers */}
      <div className="sr-only">
        Loading nuclear data dashboard. Please wait while the application initializes.
      </div>
    </div>
  )
}
