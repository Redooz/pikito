import { describe, expect, it } from 'vitest'
import { canConnect, validateConnection, type ConnectionAttempt } from './validate'
import type { GraphEdge, PortKind } from './types'

const kinds: PortKind[] = ['image', 'signal', 'note', 'audio', 'any']

function attempt(source: [string, string], target: [string, string]): ConnectionAttempt {
  return {
    source: { nodeId: source[0], portId: source[1] },
    target: { nodeId: target[0], portId: target[1] },
  }
}

describe('canConnect', () => {
  it('allows every same-kind pair', () => {
    expect(canConnect('image', 'image')).toBe(true)
    expect(canConnect('signal', 'signal')).toBe(true)
    expect(canConnect('note', 'note')).toBe(true)
    expect(canConnect('audio', 'audio')).toBe(true)
  })

  it('rejects every cross-kind pair', () => {
    for (const out of kinds.filter((k) => k !== 'any')) {
      for (const inK of kinds.filter((k) => k !== 'any' && k !== out)) {
        expect(canConnect(out, inK), `${out}→${inK}`).toBe(false)
      }
    }
  })

  it('accepts any output into a wildcard input', () => {
    for (const out of kinds) {
      expect(canConnect(out, 'any'), `${out}→any`).toBe(true)
    }
  })
})

describe('validateConnection', () => {
  const resolve =
    (map: Record<string, PortKind>) =>
    (nodeId: string, portId: string, dir: 'out' | 'in') =>
      map[`${nodeId}.${portId}.${dir}`]
  const edges: GraphEdge[] = [
    { id: 'e1', source: 'a', sourcePort: 'out', target: 'b', targetPort: 'in' },
  ]

  it('accepts a same-kind connection', () => {
    const r = validateConnection(attempt(['c', 'out'], ['d', 'in']), {
      edges,
      resolve: resolve({ 'c.out.out': 'signal', 'd.in.in': 'signal' }),
    })
    expect(r).toEqual({ ok: true })
  })

  it('rejects cross-kind with a reason', () => {
    const r = validateConnection(attempt(['c', 'out'], ['d', 'in']), {
      edges,
      resolve: resolve({ 'c.out.out': 'image', 'd.in.in': 'audio' }),
    })
    expect(r).toEqual({ ok: false, reason: 'incompatible' })
  })

  it('accepts any output into a wildcard input', () => {
    for (const out of ['image', 'signal', 'note', 'audio'] as PortKind[]) {
      const r = validateConnection(attempt(['c', 'out'], ['d', 'in']), {
        edges,
        resolve: (nodeId) => (nodeId === 'c' ? out : 'any'),
      })
      expect(r).toEqual({ ok: true })
    }
  })

  it('rejects self connections', () => {
    const r = validateConnection(attempt(['c', 'out'], ['c', 'in']), {
      edges,
      resolve: resolve({ 'c.out.out': 'signal', 'c.in.in': 'any' }),
    })
    expect(r).toEqual({ ok: false, reason: 'self' })
  })

  it('rejects unknown ports', () => {
    const r = validateConnection(attempt(['c', 'out'], ['d', 'fake-in']), {
      edges,
      resolve: resolve({ 'c.out.out': 'signal', 'd.in.in': 'signal' }),
    })
    expect(r).toEqual({ ok: false, reason: 'unknown-port' })
  })

  it('rejects connecting into an occupied input', () => {
    const r = validateConnection(attempt(['c', 'out'], ['b', 'in']), {
      edges,
      resolve: resolve({ 'c.out.out': 'signal', 'b.in.in': 'signal' }),
    })
    expect(r).toEqual({ ok: false, reason: 'input-occupied' })
  })

  it('allows fan-out from one output to two inputs', () => {
    const twoEdges: GraphEdge[] = edges.concat({
      id: 'e2',
      source: 'a',
      sourcePort: 'out',
      target: 'e',
      targetPort: 'in',
    })
    const r = validateConnection(attempt(['a', 'out'], ['f', 'in']), {
      edges: twoEdges,
      resolve: resolve({ 'a.out.out': 'signal', 'f.in.in': 'signal' }),
    })
    expect(r).toEqual({ ok: true })
  })
})
