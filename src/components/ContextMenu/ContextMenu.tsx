import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { menuFor, type MenuAction } from './contextMenuData'
import type { ContextMenuTarget } from './ContextMenuTypes'
import { useContextMenuPositioning, useContextMenuDismiss } from './hook/useContextMenuBehavior'

interface ContextMenuProps {
  target: ContextMenuTarget
  onAction: (action: MenuAction) => void
  onClose: () => void
}

export function ContextMenu({ target, onAction, onClose }: ContextMenuProps) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement | null>(null)

  useContextMenuPositioning(ref, target.x, target.y)
  useContextMenuDismiss(ref, onClose)

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
