interface AtomIconProps {
  className?: string
}

export function AtomIcon({ className }: AtomIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* nucleus */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />

      {/* orbital paths */}
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(0 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" />

      {/* electrons */}
      <circle cx="21" cy="12" r="1.25" fill="currentColor" />
      <circle cx="7.5" cy="6.5" r="1.25" fill="currentColor" />
      <circle cx="7.5" cy="17.5" r="1.25" fill="currentColor" />
    </svg>
  )
}
