import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getNodeDefs } from '../graph/registry'
import { FAMILY_TOKENS } from './familyTokens'
import type { NodeFamily } from '../graph/types'

const FAMILY_ORDER: NodeFamily[] = ['source', 'vision', 'control', 'music', 'synth', 'fx', 'out']

interface NodePickerProps {
  open: boolean
  onClose: () => void
  onPick: (type: string) => void
}

export function NodePicker({ open, onClose, onPick }: NodePickerProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const defs = getNodeDefs().filter((d) => {
      if (!q) return true
      return (
        d.code.toLowerCase().includes(q) ||
        t(d.nameKey).toLowerCase().includes(q) ||
        t(d.descKey).toLowerCase().includes(q)
      )
    })
    const byFamily = new Map<NodeFamily, typeof defs>()
    for (const d of defs) {
      const arr = byFamily.get(d.family) ?? []
      arr.push(d)
      byFamily.set(d.family, arr)
    }
    return [...byFamily.entries()].sort(
      (a, b) => FAMILY_ORDER.indexOf(a[0]) - FAMILY_ORDER.indexOf(b[0]),
    )
  }, [query, t])

  if (!open) return null

  return (
    <div
      className="picker-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="picker crop-marks">
        <header>
          <span className="type-faceplate">{t('ui.picker.title')}</span>
          <span className="type-micro">TAB · ESC</span>
        </header>
        <div className="search">
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('ui.picker.search')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const first = groups[0]?.[1][0]
                if (first) {
                  onPick(first.type)
                  setQuery('')
                }
              }
              if (e.key === 'Escape') {
                onClose()
                setQuery('')
              }
            }}
          />
        </div>
        <div className="list">
          {groups.map(([family, defs]) => (
            <div key={family}>
              <div className="family-row">
                <span>{t(`ui.families.${family}`)}</span>
              </div>
              {defs.map((def) => (
                <button
                  key={def.type}
                  className="item"
                  onMouseDown={() => {
                    onPick(def.type)
                    setQuery('')
                  }}
                >
                  <span className="fam-tab" style={{ background: FAMILY_TOKENS[def.family] }} />
                  <span className="code">{def.code}</span>
                  <span className="name">{t(def.nameKey)}</span>
                  <span className="desc">{t(def.descKey)}</span>
                </button>
              ))}
              {defs.length === 0 ? <div className="no-results">{t('ui.picker.empty')}</div> : null}
            </div>
          ))}
          {groups.length === 0 ? <div className="no-results">{t('ui.picker.empty')}</div> : null}
        </div>
        <div className="kbd-row">
          <span>↑↓ ⏎</span>
          <span>ESC</span>
        </div>
      </div>
    </div>
  )
}
