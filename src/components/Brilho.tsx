import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

/** Efeito único de brilho + partículas ao marcar um item como assistido. */
export function Brilho() {
  const reduzido = useReducedMotion()
  const [particulas] = useState(() =>
    Array.from({ length: 18 }, (_, i) => {
      const angulo = (i / 18) * Math.PI * 2 + Math.random() * 0.4
      const distancia = 70 + Math.random() * 70
      return {
        x: Math.cos(angulo) * distancia,
        y: Math.sin(angulo) * distancia,
        tamanho: 3 + Math.random() * 4,
        atraso: Math.random() * 0.12,
        dourada: i % 3 === 0,
      }
    }),
  )

  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      <motion.div
        className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_center,rgb(255_74_79/0.55),transparent_65%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.1, times: [0, 0.25, 1] }}
      />
      <motion.div
        className="absolute inset-0 rounded-[inherit] ring-2 ring-marvel-claro"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
      />
      {!reduzido &&
        particulas.map((p, i) => (
          <motion.span
            key={i}
            className={`absolute top-1/2 left-1/2 rounded-full ${p.dourada ? 'bg-ouro' : 'bg-marvel-claro'}`}
            style={{
              width: p.tamanho,
              height: p.tamanho,
              marginLeft: -p.tamanho / 2,
              marginTop: -p.tamanho / 2,
              boxShadow: '0 0 8px currentColor',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.9, delay: p.atraso, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
    </div>
  )
}
