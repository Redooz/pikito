import { describe, expect, it } from 'vitest'
import '../nodes'
import type { NodeChange } from '@xyflow/react'
import { getNodeDef } from './registry'
import {
  reduceSelection,
  toFlowEdges,
  toFlowNodes,
  type FlowEdgeInput,
} from './flowAdapters'
import type { GraphEdge, GraphNode } from './types'

function node(id: string, type: string, x = 0, y = 0): GraphNode {
  return { id, type, position: { x, y }, params: {} }
}

function edge(id: string, source: string, sourcePort: string, target: string, targetPort: string): GraphEdge {
  return { id, source, sourcePort, target, targetPort }
}

const SRC = 'const'
const OUT = 'viz'

describe('toFlowNodes', () => {
  it('maps graph nodes to device flow nodes with selection state', () => {
    const nodes = [node('a', SRC, 8, 16), node('b', OUT)]
    const result = toFlowNodes(nodes, ['b'])
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      id: 'a',
      type: 'device',
      position: { x: 8, y: 16 },
      data: {},
      selected: false,
    })
    expect(result[1]?.selected).toBe(true)
  })

  it('returns no flow nodes for an empty graph', () => {
    expect(toFlowNodes([], [])).toEqual([])
  })
})

describe('toFlowEdges', () => {
  it('colors edges by the source port signal kind', () => {
    const a = getNodeDef(SRC)
    const b = getNodeDef(OUT)
    if (!a || !b) throw new Error('node defs missing')
    const nodes = [node('a', SRC), node('b', OUT)]
    const edges = [
      edge('e1', 'a', a.outputs[0]!.id, 'b', b.inputs[0]!.id),
    ] satisfies FlowEdgeInput[]
    const result = toFlowEdges(edges as GraphEdge[], nodes)
    expect(result).toHaveLength(1)
    const e = result[0]!
    expect(e).toMatchObject({
      id: 'e1',
      type: 'schematic',
      source: 'a',
      sourceHandle: a.outputs[0]!.id,
      target: 'b',
      targetHandle: b.inputs[0]!.id,
    })
    expect((e.data as { token: string }).token).not.toBe('var(--y-ink)')
  })

  it('falls back to ink token for any-port or unknown source', () => {
    const nodes = [node('ghost', SRC)]
    const edges = [
      edge('e1', 'missing', 'out', 'ghost', 'in'),
    ] as GraphEdge[]
    const result = toFlowEdges(edges, nodes)
    expect((result[0]!.data as { token: string }).token).toBe('var(--y-ink)')
  })
})

describe('reduceSelection', () => {
  const select = (id: string, selected: boolean): NodeChange => ({
    id,
    type: 'select',
    selected,
  })

  it('adds and removes ids from select changes', () => {
    expect(reduceSelection(['a', 'b'], [select('b', false), select('c', true)])).toEqual(['a', 'c'])
  })

  it('starts from the current selection array when merged', () => {
    expect(reduceSelection(['a'], [select('d', true)])).toEqual(['a', 'd'])
  })

  it('returns an equivalent array when nothing changes (order preserved)', () => {
    const cur = ['a', 'b']
    expect(reduceSelection(cur, [select('a', true)])).toEqual(['a', 'b'])
  })

  it('ignores non-select changes', () => {
    const pos: NodeChange = { id: 'a', type: 'position', position: { x: 1, y: 1 } }
    expect(reduceSelection(['a'], [pos])).toEqual(['a'])
  })
})
