import { useTranslation } from 'react-i18next'
import { useStore } from 'zustand'
import { graphStore } from '../../graph/store'
import { useTimelineHidden } from './hook/useTimelineHidden'
import { TimelineRows } from './components/TimelineRows'

export function Timeline() {
  const { t } = useTranslation()
  const [hidden, toggleHidden] = useTimelineHidden()
  const past = useStore(graphStore, (s) => s.events.past)
  const future = useStore(graphStore, (s) => s.events.future)
  const jumpToPast = useStore(graphStore, (s) => s.jumpToPast)
  const jumpToFuture = useStore(graphStore, (s) => s.jumpToFuture)

  return (
    <section className="timeline">
      <header className="timeline-head">
        <button type="button" className="btn-i" onClick={toggleHidden} aria-label={t('ui.timeline.toggle')}>
          {hidden ? '+' : '−'}
        </button>
        <span className="type-faceplate">{t('ui.timeline.title')}</span>
      </header>
      {hidden ? null : past.length === 0 && future.length === 0 ? (
        <p className="type-micro">{t('ui.timeline.empty')}</p>
      ) : (
        <TimelineRows past={past} future={future} onJumpPast={jumpToPast} onJumpFuture={jumpToFuture} />
      )}
    </section>
  )
}
