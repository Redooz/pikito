import { describe, expect, it } from 'vitest'
import { moveHighlight, nextEscape, pickTarget } from './pickerNav'

describe('moveHighlight', () => {
  it('moves down within bounds', () => {
    expect(moveHighlight(0, 1, 5)).toBe(1)
    expect(moveHighlight(2, 1, 5)).toBe(3)
  })
  it('moves up within bounds and wraps from the top', () => {
    expect(moveHighlight(3, -1, 5)).toBe(2)
    expect(moveHighlight(0, -1, 5)).toBe(4)
  })
  it('wraps from the bottom', () => {
    expect(moveHighlight(4, 1, 5)).toBe(0)
  })
  it('starts at 0 from a void highlight', () => {
    expect(moveHighlight(-1, 1, 5)).toBe(0)
    expect(moveHighlight(-1, -1, 5)).toBe(4)
  })
  it('stays empty when there are no items', () => {
    expect(moveHighlight(-1, 1, 0)).toBe(-1)
    expect(moveHighlight(2, -1, 0)).toBe(-1)
  })
})

describe('nextEscape', () => {
  it('falls back to the search stage when an item is highlighted', () => {
    expect(nextEscape(3)).toBe('search')
    expect(nextEscape(0)).toBe('search')
  })

  it('closes when nothing is highlighted or the list is void', () => {
    expect(nextEscape(-1)).toBe('close')
  })
})

describe('pickTarget', () => {
  it('picks the highlighted item', () => {
    const flat = ['a', 'b', 'c']
    expect(pickTarget(flat, 1)).toBe('b')
  })

  it('falls back to the first item from a void highlight', () => {
    expect(pickTarget(['x'], -1)).toBe('x')
  })

  it('returns undefined for an empty list', () => {
    expect(pickTarget([], 0)).toBeUndefined()
    expect(pickTarget([], -1)).toBeUndefined()
  })
})
