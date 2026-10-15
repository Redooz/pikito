export type Theme = 'light' | 'dark'

const KEY = 'yukon.theme'

export function getTheme(): Theme {
  const stored = localStorage.getItem(KEY)
  if (stored === 'dark' || stored === 'light') return stored
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

export function setTheme(theme: Theme): void {
  applyTheme(theme)
  localStorage.setItem(KEY, theme)
}
