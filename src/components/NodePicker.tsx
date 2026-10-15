import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getNodeDefs } from '../graph/registry'
import { FAMILY_TOKENS } from './familyTokens'
import { moveHighlight } from './pickerNav'
import type { NodeFamily, NodeDef } from '../graph/types'

const FAMILY_ORDER: NodeFamily[] = ['source', 'vision', 'control', 'music', 'synth', 'fx', 'out']

interface NodePickerProps {
  open: boolean
  onClose: () => void
  onPick: (type: string) => void
}

export function NodePicker({ open, onClose, onPick }: NodePickerProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef(new Map<string, HTMLElement>())

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
    const byFamily = new Map<NodeFamily, NodeDef[]>()
    for (const d of defs) {
      const arr = byFamily.get(d.family) ?? []
      arr.push(d)
      byFamily.set(d.family, arr)
    }
    return [...byFamily.entries()].sort(
      (a, b) => FAMILY_ORDER.indexOf(a[0]) - FAMILY_ORDER.indexOf(b[0]),
    )
  }, [query, t])

  const flat = useMemo(() => groups.flatMap(([, defs]) => defs), [groups])
  const flatIndex = useMemo(
    () => new Map(flat.map((d, i) => [d.type, i] as const)),
    [flat],
  )

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => moveHighlight(h, 1, flat.length))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => moveHighlight(h, -1, flat.length))
      return
    }
    if (e.key === 'Enter') {
      const picked = flat[highlight] ?? flat[0]
      if (picked) {
        onPick(picked.type)
        setHighlight(-1)
        setQuery('')
      }
      return
    }
    if (e.key === 'Escape') {
      if (highlight >= 0) {
        setHighlight(-1)
        inputRef.current?.focus()
      } else {
        onClose()
        setQuery('')
      }
    }
  }

  const pickItem = (def: NodeDef) => {
    onPick(def.type)
    setHighlight(-1)
    setQuery('')
  }

  const highlightedType = highlight >= 0 ? flat[highlight]?.type : undefined

  useEffect(() => {
    if (!highlightedType) return
    itemRefs.current.get(highlightedType)?.scrollIntoView({ block: 'nearest' })
  }, [highlightedType])

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
          <span className="type-micro">CTRL+K · ESC</span>
        </header>
        <div className="search">
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setHighlight(-1)
            }}
            placeholder={t('ui.picker.search')}
            onKeyDown={onSearchKey}
          />
        </div>
        <div className="list">
          {groups.map(([family, defs]) => (
            <div key={family}>
              <div className="family-row">
                <span>{t(`ui.families.${family}`)}</span>
              </div>
              {defs.map((def) => {
                const idx = flatIndex.get(def.type)
                return (
                  <button
                    key={def.type}
                    ref={(el) => {
                      if (el) itemRefs.current.set(def.type, el)
                      else itemRefs.current.delete(def.type)
                    }}
                    className={`item ${idx === highlight ? 'hl' : ''}`}
                    onMouseDown={() => pickItem(def)}
                  >
                    <span className="fam-tab" style={{ background: FAMILY_TOKENS[def.family] }} />
                    <span className="code">{def.code}</span>
                    <span className="name">{t(def.nameKey)}</span>
                    <span className="desc">{t(def.descKey)}</span>
                  </button>
                )
              })}
              {defs.length === 0 ? <div className="no-results">{t('ui.picker.empty')}</div> : null}
            </div>
          ))}
          {groups.length === 0 ? <div className="no-results">{t('ui.picker.empty')}</div> : null}
        </div>
        <div className="kbd-row">
          <button
            className="kbd-btn"
            onMouseDown={(e) => {
              e.preventDefault()
              const picked = flat[highlight] ?? flat[0]
              if (picked) pickItem(picked)
            }}
            aria-label={t('ui.picker.pick')}
          >
            ↑↓ ⏎
          </button>
          <button className="kbd-btn" onMouseDown={() => onClose()} aria-label={t('ui.picker.closeEsc')}>
            ESC
          </button>
        </div>
      </div>
    </div>
  )
}
