import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'

/** Pôster clicável com leve elevação e inclinação (tilt) ao passar o mouse. */
export function PosterInterativo({
  children,
  rotulo,
  onClick,
  className = '',
}: {
  children: ReactNode
  rotulo: string
  onClick: () => void
  className?: string
}) {
  const reduzido = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const mola = { stiffness: 200, damping: 18, mass: 0.4 }
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), mola)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), mola)
  const reflexo = useTransform(px, (x) => `radial-gradient(circle at ${(x + 0.5) * 100}% 30%, rgb(255 255 255 / 0.45), transparent 55%)`)

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      className={`group/poster relative block [perspective:900px] ${className}`}
      whileHover={reduzido ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onPointerMove={(e) => {
        if (reduzido || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width - 0.5)
        py.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
    >
      <motion.div
        style={reduzido ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative size-full overflow-hidden rounded-xl shadow-[0_20px_40px_-18px_rgb(0_0_0/0.9)] ring-1 ring-white/10 transition-shadow duration-300 group-hover/poster:shadow-[0_30px_60px_-20px_rgb(230_36_41/0.45)]"
      >
        {children}
        {!reduzido && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover/poster:opacity-100"
            style={{ background: reflexo }}
          />
        )}
      </motion.div>
    </motion.button>
  )
}
