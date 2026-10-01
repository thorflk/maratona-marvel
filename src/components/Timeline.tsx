import { motion } from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'
import { useProgresso } from '../state/contexto'
import { estaAssistido } from '../state/progresso'
import type { ItemCatalogo } from '../types'
import { CardDestino } from './CardDestino'
import { CardItem, NoTimeline } from './CardItem'

interface Props {
  itens: ItemCatalogo[]
  mostrarDestino: boolean
  destacado: string | null
}

export function Timeline({ itens, mostrarDestino, destacado }: Props) {
  const { progresso } = useProgresso()
  const container = useRef<HTMLDivElement>(null)
  const [alturaAcesa, setAlturaAcesa] = useState(0)

  const assinatura = itens.map((i) => `${i.id}:${estaAssistido(i, progresso.itens[i.id]) ? 1 : 0}`).join('|')

  // A linha "acende" do topo até o nó do último item assistido.
  useLayoutEffect(() => {
    const el = container.current
    if (!el) return
    const medir = () => {
      const nos = el.querySelectorAll<HTMLElement>('[data-no][data-assistido="true"]')
      const ultimo = nos[nos.length - 1]
      if (!ultimo) return setAlturaAcesa(0)
      const topo = el.getBoundingClientRect().top
      const r = ultimo.getBoundingClientRect()
      setAlturaAcesa(r.top + r.height / 2 - topo)
    }
    medir()
    const obs = new ResizeObserver(medir)
    obs.observe(el)
    return () => obs.disconnect()
  }, [assinatura, mostrarDestino])

  return (
    <section aria-labelledby="titulo-timeline" className="mx-auto max-w-6xl px-4 pt-14 pb-24 sm:px-6 lg:px-8">
      <h2 id="titulo-timeline" className="sr-only">
        Linha do tempo da maratona
      </h2>

      <div ref={container} className="relative">
        {/* Linha base e linha acesa */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-5 w-px -translate-x-1/2 bg-gradient-to-b from-white/5 via-white/12 to-white/5 md:left-1/2"
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-5 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-marvel-escuro via-marvel to-marvel-claro shadow-[0_0_14px_rgb(230_36_41/0.9)] md:left-1/2"
          initial={false}
          animate={{ height: alturaAcesa }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        >
          {alturaAcesa > 0 && (
            <span className="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgb(255_74_79/0.9)]" />
          )}
        </motion.div>

        {itens.length === 0 ? (
          <p className="relative py-24 pl-14 text-suave md:pl-0 md:text-center">Nenhum título encontrado com esses filtros.</p>
        ) : (
          <ol className="relative space-y-8 md:space-y-4">
            {itens.map((item, i) => {
              const esquerda = i % 2 === 0
              const assistido = estaAssistido(item, progresso.itens[item.id])
              return (
                <li
                  key={item.id}
                  id={`item-${item.id}`}
                  tabIndex={-1}
                  className="relative grid scroll-mt-28 grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2.5 sm:gap-x-4 focus:outline-none md:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] md:gap-x-0"
                >
                  <div className="col-start-1 row-start-1 flex justify-center pt-6 md:col-start-2">
                    <NoTimeline posicao={item.posicao} assistido={assistido} />
                  </div>
                  <div
                    className={`col-start-2 row-start-1 rounded-2xl transition-shadow duration-700 ${esquerda ? 'md:col-start-1' : 'md:col-start-3'} ${
                      destacado === item.id ? 'shadow-[0_0_0_2px_var(--color-marvel-claro),0_0_60px_-10px_rgb(230_36_41/0.8)]' : ''
                    }`}
                  >
                    <CardItem item={item} lado={esquerda ? 'esquerda' : 'direita'} />
                  </div>
                </li>
              )
            })}
          </ol>
        )}

        {mostrarDestino && <CardDestino />}
      </div>
    </section>
  )
}
