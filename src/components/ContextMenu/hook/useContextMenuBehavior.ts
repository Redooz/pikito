import { useEffect, type RefObject } from 'react'

export function useContextMenuPositioning(
  ref: RefObject<HTMLDivElement | null>,
  x: number,
  y: number,
): void {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const box = el.getBoundingClientRect()
    el.style.left = `${Math.min(x, window.innerWidth - box.width - 8)}px`
    el.style.top = `${Math.min(y, window.innerHeight - box.height - 8)}px`
  }, [x, y, ref])
}

export function useContextMenuDismiss(
  ref: RefObject<HTMLDivElement | null>,
  onClose: () => void,
): void {
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
  }, [onClose, ref])
}
