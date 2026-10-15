import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from 'zustand'
import { graphStore, type HistoryKind } from '../graph/store'

const LABEL_KEYS: Record<HistoryKind, string> = {
  addNode: 'ui.timeline.addNode',
  removeNodes: 'ui.timeline.removeNodes',
  duplicate: 'ui.timeline.duplicate',
  connect: 'ui.timeline.connect',
  disconnect: 'ui.timeline.disconnect',
  move: 'ui.timeline.move',
  params: 'ui.timeline.params',
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function stamp(ts: number): string {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const STORE_KEY = 'yukon.timeline.hidden'

export function Timeline() {
  const { t } = useTranslation()
  const [hidden, setHidden] = useState(() => localStorage.getItem(STORE_KEY) === '1')
  const past = useStore(graphStore, (s) => s.events.past)
  const future = useStore(graphStore, (s) => s.events.future)
  const jumpToPast = useStore(graphStore, (s) => s.jumpToPast)
  const jumpToFuture = useStore(graphStore, (s) => s.jumpToFuture)

  const toggle = () => {
    const next = !hidden
    setHidden(next)
    localStorage.setItem(STORE_KEY, next ? '1' : '0')
  }

  return (
    <section className="timeline">
      <header className="timeline-head">
        <button type="button" className="btn-i" onClick={toggle} aria-label={t('ui.timeline.toggle')}>
          {hidden ? '+' : '−'}
        </button>
        <span className="type-faceplate">{t('ui.timeline.title')}</span>
      </header>
      {hidden ? null : past.length === 0 && future.length === 0 ? (
        <p className="type-micro">{t('ui.timeline.empty')}</p>
      ) : (
        <div className="timeline-rows">
          {past.map((ev, i) => {
            const back = past.length - i
            return (
              <button
                key={`${ev.ts}${i}`}
                type="button"
                className="timeline-row"
                onClick={() => jumpToPast(back)}
              >
                <span className="stamp">{stamp(ev.ts)}</span>
                <span className="label">{t(LABEL_KEYS[ev.kind])}</span>
              </button>
            )
          })}
          <div className="timeline-now">
            <span className="stamp" aria-hidden="true">--:--:--</span>
            <span className="label">{t('ui.timeline.now')}</span>
          </div>
          {[...future].reverse().map((ev, j) => (
            <button
              key={`${ev.ts}f${j}`}
              type="button"
              className="timeline-row future"
              onClick={() => jumpToFuture(j + 1)}
            >
              <span className="stamp">{stamp(ev.ts)}</span>
              <span className="label">{t(LABEL_KEYS[ev.kind])}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
