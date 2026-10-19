import { describe, expect, it } from 'vitest'
import { nowScrollTop } from './nowScrollTop'

interface Box {
  scrollTop: number
  clientHeight: number
  scrollHeight: number
  nowOffsetTop: number
  nowHeight: number
}

const make = (over: Partial<Box> = {}): Box => ({
  scrollTop: 0,
  clientHeight: 184,
  scrollHeight: 184,
  nowOffsetTop: 0,
  nowHeight: 18,
  ...over,
})

describe('nowScrollTop', () => {
  it('returns 0 when content fits (no slider)', () => {
    const b = make({ scrollHeight: 100, nowOffsetTop: 82 })
    expect(nowScrollTop(b)).toBe(0)
  })

  it('pins NOW to the bottom when the slider appears', () => {
    const b = make({
      scrollHeight: 500,
      nowOffsetTop: 384,
      nowHeight: 18,
      clientHeight: 184,
    })
    expect(nowScrollTop(b)).toBe(384 + 18 - 184)
  })

  it('never returns more than the max scroll', () => {
    const b = make({ scrollHeight: 500, nowOffsetTop: 900, nowHeight: 18 })
    expect(nowScrollTop(b)).toBe(500 - 184)
  })

  it('clamps negative results to the top', () => {
    const b = make({
      scrollHeight: 300,
      nowOffsetTop: 10,
      nowHeight: 18,
      clientHeight: 184,
    })
    expect(nowScrollTop(b)).toBe(0)
  })
})
