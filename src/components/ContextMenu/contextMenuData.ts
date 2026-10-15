import type { ContextMenuTarget } from './ContextMenuTypes'

export type MenuAction = 'delete' | 'duplicate' | 'disconnect'

const MENU_ITEMS: Record<ContextMenuTarget['kind'], MenuAction[]> = {
  node: ['duplicate', 'delete', 'disconnect'],
  edge: ['delete'],
}

export function menuFor(
  kind: ContextMenuTarget['kind'],
  hasEdges = true,
): MenuAction[] {
  const items = MENU_ITEMS[kind]
  if (kind === 'node' && !hasEdges) return items.filter((a) => a !== 'disconnect')
  return items
}
