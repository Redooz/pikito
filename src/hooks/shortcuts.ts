export interface ShortcutActions {
  onPicker: () => void
  remove: (ids: string[]) => void
  duplicate: (ids: string[]) => void
  undo: () => void
  redo: () => void
  getSelection: () => string[]
}

interface TypingTarget {
  tagName: string
  isContentEditable: boolean
}

export function isTypingTarget(target: unknown): boolean {
  const t = target as TypingTarget | null
  if (!t) return false
  return t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || Boolean(t.isContentEditable)
}

export function handleKey(e: KeyboardEvent, actions: ShortcutActions): void {
  const typing = isTypingTarget(e.target)
  const mod = e.metaKey || e.ctrlKey
  const key = e.key.toLowerCase()
  if (mod && key === 'k' && !typing) {
    e.preventDefault()
    actions.onPicker()
    return
  }
  if ((e.key === 'Delete' || e.key === 'Backspace') && !typing) {
    e.preventDefault()
    actions.remove(actions.getSelection())
    return
  }
  if (mod && key === 'z') {
    if (typing) return
    e.preventDefault()
    if (e.shiftKey) actions.redo()
    else actions.undo()
    return
  }
  if (mod && key === 'y') {
    if (typing) return
    e.preventDefault()
    actions.redo()
    return
  }
  if (mod && key === 'd' && !typing) {
    e.preventDefault()
    actions.duplicate(actions.getSelection())
  }
}
