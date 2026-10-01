import { motion } from 'framer-motion'

interface Props {
  valor: number
  maximo: number
  rotulo: string
  className?: string
  /** Altura da barra (classe Tailwind). */
  altura?: string
}

export function BarraProgresso({ valor, maximo, rotulo, className = '', altura = 'h-2' }: Props) {
  const pct = maximo > 0 ? Math.min(100, (valor / maximo) * 100) : 0
  return (
    <div
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={maximo}
      aria-valuenow={valor}
      aria-valuetext={`${valor} de ${maximo} (${Math.round(pct)}%)`}
      className={`relative overflow-hidden rounded-full bg-white/10 ${altura} ${className}`}
    >
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-marvel-escuro via-marvel to-marvel-claro shadow-[0_0_16px_rgb(230_36_41/0.8)]"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 60, damping: 18, mass: 0.8 }}
      />
    </div>
  )
}
