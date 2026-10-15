import { describe, expect, it } from 'vitest'
import { formatValue } from './nodeFormat'

describe('formatValue', () => {
  it('passes strings through untouched', () => {
    expect(formatValue('sine', 0.1)).toBe('sine')
  })

  it('uses the step fraction to pick decimals', () => {
    expect(formatValue(0.5, 0.01)).toBe('0.50')
    expect(formatValue(5, 0.01)).toBe('5.00')
  })

  it('uses zero decimals for integer steps or none', () => {
    expect(formatValue(2, 1)).toBe('2')
    expect(formatValue(3)).toBe('3')
  })

  it('clamps decimals to 3 digits', () => {
    expect(formatValue(0.123456, 0.0001)).toBe('0.123')
  })
})
