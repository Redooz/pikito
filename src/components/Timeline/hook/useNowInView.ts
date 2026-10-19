import { useEffect } from 'react'
import { nowScrollTop } from '../nowScrollTop'

interface Measurable {
  offsetTop: number
  offsetHeight: number
}

function read(el: HTMLElement): {
  scrollTop: number
  clientHeight: number
  scrollHeight: number
  nowOffsetTop: number
  nowHeight: number
} {
  const now = el.querySelector('.timeline-now') as Measurable | null
  return {
    scrollTop: el.scrollTop,
    clientHeight: el.clientHeight,
    scrollHeight: el.scrollHeight,
    nowOffsetTop: now?.offsetTop ?? 0,
    nowHeight: now?.offsetHeight ?? 0,
  }
}

export function useNowInView(
  containerRef: React.RefObject<HTMLDivElement | null>,
  deps: readonly unknown[],
): void {
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.scrollTop = nowScrollTop(read(el))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
