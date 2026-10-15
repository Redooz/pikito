import { describe, expect, it } from 'vitest'
import { pad, stamp } from './timelineStamp'

describe('pad', () => {
  it('zero-pads single digits', () => {
    expect(pad(3)).toBe('03')
    expect(pad(0)).toBe('00')
  })

  it('keeps double digits as-is', () => {
    expect(pad(59)).toBe('59')
  })
})

describe('stamp', () => {
  it('formats local time as hh:mm:ss', () => {
    const d = new Date(2026, 0, 2, 7, 5, 42)
    expect(stamp(d.getTime())).toBe('07:05:42')
  })
})
