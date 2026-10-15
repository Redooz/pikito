import { describe, expect, it } from 'vitest'
import { moveHighlight } from './pickerNav'

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
