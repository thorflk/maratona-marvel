import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { DESTINO } from '../lib/catalogo'
import { formatarDuracao } from '../lib/formato'
import { Emblema } from './Emblema'
import { Modal } from './Modal'

/** Pequena celebração quando a maratona inteira é concluída. */
export function Celebracao({ aberta, aoFechar, minutos }: { aberta: boolean; aoFechar: () => void; minutos: number }) {
  return (
    <Modal aberto={aberta} aoFechar={aoFechar} rotulo="Maratona concluída" className="w-full max-w-lg">
      <Confete />
      <div className="relative overflow-hidden rounded-3xl border border-marvel/40 bg-superficie p-8 text-center shadow-[0_40px_120px_-30px_rgb(230_36_41/0.7)] sm:p-10">
        <div className="absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-marvel/30 blur-3xl" aria-hidden="true" />
        <motion.div
          className="relative mx-auto w-fit"
          initial={{ scale: 0.4, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
        >
          <Emblema tamanho={72} />
        </motion.div>
        <h2 className="titulo-display relative mt-6 text-5xl text-white sm:text-6xl">Maratona concluída!</h2>
        <p className="relative mt-4 text-suave">
          Você assistiu a todos os títulos — cerca de <strong className="text-texto">{formatarDuracao(minutos)}</strong> de Marvel. Agora só
          falta <strong className="text-texto">{DESTINO.titulo}</strong>.
        </p>
        <button type="button" className="botao-primario relative mt-8" onClick={aoFechar} data-foco-inicial>
          Rumo a Doomsday
        </button>
      </div>
    </Modal>
  )
}

const CORES = ['#e62429', '#ff4a4f', '#f5c518', '#ffffff', '#a3161a']

function Confete() {
  const reduzido = useReducedMotion()
  const [pecas] = useState(() =>
    Array.from({ length: 70 }, (_, i) => ({
      x: Math.random() * 100,
      deriva: (Math.random() - 0.5) * 40,
      atraso: Math.random() * 0.6,
      duracao: 2.4 + Math.random() * 1.8,
      giro: (Math.random() - 0.5) * 720,
      largura: 6 + Math.random() * 6,
      cor: CORES[i % CORES.length],
    })),
  )
  if (reduzido) return null
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {pecas.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-0 block rounded-[2px]"
          style={{ left: `${p.x}vw`, width: p.largura, height: p.largura * 0.45, background: p.cor }}
          initial={{ y: '-5vh', x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: '105vh', x: `${p.deriva}vw`, rotate: p.giro, opacity: [1, 1, 0] }}
          transition={{ duration: p.duracao, delay: p.atraso, ease: [0.25, 0.1, 0.4, 1] }}
        />
      ))}
    </div>
  )
}
