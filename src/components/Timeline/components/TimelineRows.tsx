import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { stamp } from '../timelineStamp'
import { useNowInView } from '../hook/useNowInView'
import type { HistoryEvent } from '../../../graph/store'
import type { HistoryKind } from '../../../graph/store'

const LABEL_KEYS: Record<HistoryKind, string> = {
  addNode: 'ui.timeline.addNode',
  removeNodes: 'ui.timeline.removeNodes',
  duplicate: 'ui.timeline.duplicate',
  connect: 'ui.timeline.connect',
  disconnect: 'ui.timeline.disconnect',
  move: 'ui.timeline.move',
  params: 'ui.timeline.params',
}

export function TimelineRows(props: {
  past: HistoryEvent[]
  future: HistoryEvent[]
  onJumpPast: (steps: number) => void
  onJumpFuture: (steps: number) => void
}) {
  const { t } = useTranslation()
  const rowsRef = useRef<HTMLDivElement | null>(null)
  useNowInView(rowsRef, [props.past.length, props.future.length])
  return (
    <div className="timeline-rows" ref={rowsRef}>
      {props.past.map((ev, i) => (
        <button
          key={`${ev.ts}${i}`}
          type="button"
          className="timeline-row"
          onClick={() => props.onJumpPast(props.past.length - i)}
        >
          <span className="stamp">{stamp(ev.ts)}</span>
          <span className="label">{t(LABEL_KEYS[ev.kind])}</span>
        </button>
      ))}
      <div className="timeline-now">
        <span className="stamp" aria-hidden="true">--:--:--</span>
        <span className="label">{t('ui.timeline.now')}</span>
      </div>
      {[...props.future].reverse().map((ev, j) => (
        <button
          key={`${ev.ts}f${j}`}
          type="button"
          className="timeline-row future"
          onClick={() => props.onJumpFuture(j + 1)}
        >
          <span className="stamp">{stamp(ev.ts)}</span>
          <span className="label">{t(LABEL_KEYS[ev.kind])}</span>
        </button>
      ))}
    </div>
  )
}
