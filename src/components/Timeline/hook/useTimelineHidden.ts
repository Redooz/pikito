import { useState } from 'react'

const STORE_KEY = 'yukon.timeline.hidden'

export function useTimelineHidden(): [hidden: boolean, toggle: () => void] {
  const [hidden, setHidden] = useState(() => localStorage.getItem(STORE_KEY) === '1')
  const toggle = () => {
    const next = !hidden
    setHidden(next)
    localStorage.setItem(STORE_KEY, next ? '1' : '0')
  }
  return [hidden, toggle]
}
