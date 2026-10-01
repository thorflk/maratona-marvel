/** Emblema próprio da maratona (o mesmo desenho do favicon). */
export function Emblema({ tamanho = 36, className = '' }: { tamanho?: number; className?: string }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <linearGradient id="emblema-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff4a4f" />
          <stop offset="1" stopColor="#a3161a" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#emblema-g)" />
      <path d="M14 48V16h8l10 16 10-16h8v32h-8V30l-10 15-10-15v18z" fill="#fff" />
    </svg>
  )
}
