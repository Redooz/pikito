import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { menuFor, type MenuAction } from './contextMenuData'
import type { ContextMenuTarget } from './ContextMenuTypes'

export type { ContextMenuTarget } from './ContextMenuTypes'
export type { MenuAction } from './contextMenuData'

interface ContextMenuProps {
  target: ContextMenuTarget
  onAction: (action: MenuAction) => void
  onClose: () => void
}

export function ContextMenu({ target, onAction, onClose }: ContextMenuProps) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const box = el.getBoundingClientRect()
    el.style.left = `${Math.min(target.x, window.innerWidth - box.width - 8)}px`
    el.style.top = `${Math.min(target.y, window.innerHeight - box.height - 8)}px`
  }, [target.x, target.y])

  useEffect(() => {
    const closeOnClick = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return
      onClose()
    }
    const closeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('mousedown', closeOnClick)
    window.addEventListener('keydown', closeKey)
    return () => {
      window.removeEventListener('mousedown', closeOnClick)
      window.removeEventListener('keydown', closeKey)
    }
  }, [onClose])

  const count = target.ids.length
  return (
    <div ref={ref} className="ctx-menu crop-marks" style={{ left: target.x, top: target.y }}>
      <header>
        <span className="type-faceplate">
          {target.kind === 'node' ? t('ui.menu.node') : t('ui.menu.edge')}
        </span>
        {count > 1 ? <span className="type-micro">×{count}</span> : null}
      </header>
      {menuFor(target.kind, target.hasEdges).map((action) => (
        <button key={action} type="button" className="ctx-item" data-action={action} onClick={() => onAction(action)}>
          <span className="code">{t(`ui.menu.${action}`)}</span>
        </button>
      ))}
    </div>
  )
}
