import { useEffect, useRef, useState, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { getNodeDefs } from '../../../graph/registry'
import { buildPickerIndex, type PickerGroup } from '../pickerData'
import { moveHighlight, nextEscape, pickTarget } from '../pickerNav'
import type { NodeDef } from '../../../graph/types'

export type PickerItemRefs = RefObject<Map<string, HTMLElement>>

export interface PickerNavApi {
  query: string
  onQueryChange: (value: string) => void
  highlight: number
  groups: PickerGroup[]
  flatIndex: Map<string, number>
  inputRef: RefObject<HTMLInputElement | null>
  itemRefs: PickerItemRefs
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  pick: (def: NodeDef) => void
  pickHighlighted: () => void
  requestClose: () => void
}

export function usePickerNav(onPick: (type: string) => void, onClose: () => void): PickerNavApi {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(-1)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const itemRefs = useRef(new Map<string, HTMLElement>())

  const { groups, flat } = buildPickerIndex(getNodeDefs(), query, t)

  const flatIndex = new Map(flat.map((d, i) => [d.type, i] as const))

  const reset = () => {
    setHighlight(-1)
    setQuery('')
  }

  const pick = (def: NodeDef) => {
    onPick(def.type)
    reset()
  }

  const pickHighlighted = () => {
    const target = pickTarget(flat, highlight)
    if (target) pick(target)
  }

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      pickHighlighted()
      return
    }
    if (e.key === 'Escape') {
      if (nextEscape(highlight) === 'search') {
        setHighlight(-1)
        inputRef.current?.focus()
      } else {
        onClose()
        reset()
      }
    }
  }

  const onQueryChange = (value: string) => {
    setQuery(value)
    setHighlight(-1)
  }

  const highlightedType = highlight >= 0 ? flat[highlight]?.type : undefined
  useEffect(() => {
    if (!highlightedType) return
    itemRefs.current?.get(highlightedType)?.scrollIntoView({ block: 'nearest' })
  }, [highlightedType])

  return {
    query,
    onQueryChange,
    highlight,
    groups,
    flatIndex,
    inputRef,
    itemRefs,
    onSearchKeyDown,
    pick,
    pickHighlighted,
    requestClose: onClose,
  }
}
