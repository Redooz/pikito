import { describe, expect, it, vi } from 'vitest'
import { applyMenuAction, nodeMenuTarget } from './menuActions'
import type { ContextMenuTarget } from '../components/ContextMenu'

function storeState(edges = [{ id: 'e1', source: 'a', sourcePort: 'out', target: 'b', targetPort: 'in' }]) {
  return {
    edges,
    selection: ['a', 'c'],
    disconnect: vi.fn(),
    removeNodes: vi.fn(),
    duplicateNodes: vi.fn(),
    setSelection: vi.fn(),
  }
}

describe('applyMenuAction', () => {
  it('edge menu target: disconnects every listed edge id', () => {
    const s = storeState()
    const target: ContextMenuTarget = { kind: 'edge', ids: ['e1', 'e2'], hasEdges: true, x: 0, y: 0 }
    applyMenuAction('delete', target, s)
    expect(s.disconnect).toHaveBeenCalledTimes(2)
    expect(s.disconnect).toHaveBeenNthCalledWith(1, 'e1')
    expect(s.disconnect).toHaveBeenNthCalledWith(2, 'e2')
  })

  it('node delete removes the node ids', () => {
    const s = storeState()
    const target: ContextMenuTarget = { kind: 'node', ids: ['a'], hasEdges: true, x: 0, y: 0 }
    applyMenuAction('delete', target, s)
    expect(s.removeNodes).toHaveBeenCalledWith(['a'])
  })

  it('node duplicate duplicates the node ids', () => {
    const s = storeState()
    const target: ContextMenuTarget = { kind: 'node', ids: ['a', 'c'], hasEdges: false, x: 0, y: 0 }
    applyMenuAction('duplicate', target, s)
    expect(s.duplicateNodes).toHaveBeenCalledWith(['a', 'c'])
  })

  it('node disconnect removes edges touching any of the ids', () => {
    const s = storeState([
      { id: 'e1', source: 'a', sourcePort: 'out', target: 'b', targetPort: 'in' },
      { id: 'e2', source: 'd', sourcePort: 'out', target: 'c', targetPort: 'in' },
      { id: 'e3', source: 'x', sourcePort: 'out', target: 'y', targetPort: 'in' },
    ] as { id: string; source: string; sourcePort: string; target: string; targetPort: string }[])
    const target: ContextMenuTarget = { kind: 'node', ids: ['a', 'c'], hasEdges: true, x: 0, y: 0 }
    applyMenuAction('disconnect', target, s)
    expect(s.disconnect).toHaveBeenCalledTimes(2)
    expect(s.disconnect).toHaveBeenCalledWith('e1')
    expect(s.disconnect).toHaveBeenCalledWith('e2')
  })
})

describe('nodeMenuTarget', () => {
  it('uses the existing selection when the right-clicked node is selected', () => {
    const s = storeState()
    const target = nodeMenuTarget('a', s, 10, 20)
    expect(target).toEqual({ kind: 'node', ids: ['a', 'c'], hasEdges: true, x: 10, y: 20 })
    expect(s.setSelection).not.toHaveBeenCalled()
  })

  it('falls back to the single node and selects it when not selected', () => {
    const s = storeState()
    const target = nodeMenuTarget('d', s, 0, 0)
    expect(target).toEqual({ kind: 'node', ids: ['d'], hasEdges: false, x: 0, y: 0 })
    expect(s.setSelection).toHaveBeenCalledWith(['d'])
  })

  it('computes hasEdges from edges touching the ids', () => {
    const s = storeState()
    expect(nodeMenuTarget('c', s, 0, 0)?.hasEdges).toBe(true)
    expect(nodeMenuTarget('z', s, 0, 0)?.hasEdges).toBe(false)
  })
})
