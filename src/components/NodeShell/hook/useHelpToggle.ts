import { useState } from 'react'

export function useHelpToggle(): [open: boolean, setOpen: (open: boolean) => void, toggle: () => void] {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((v) => !v)
  return [open, setOpen, toggle]
}
