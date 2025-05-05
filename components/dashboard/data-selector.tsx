"use client"

interface DataSelectorOption {
  value: string
  label: string
}

interface DataSelectorProps {
  options: DataSelectorOption[]
  value: string
  onChange: (value: string) => void
}

export default function DataSelector({ options, value, onChange }: DataSelectorProps) {
  return (
    <div>
      <h3 className="text-xs mb-2 neon-text">SELECT DATA TYPE</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            className={`w-full text-left text-xs px-3 py-2 border-2 transition-all ${
              value === option.value
                ? "bg-green-400 text-black border-green-400"
                : "bg-black text-green-400 border-green-400 hover:bg-green-900"
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
