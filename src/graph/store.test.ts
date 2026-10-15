import { beforeEach, describe, expect, it } from 'vitest'
import { registerNode, clearRegistry, getNodeDef } from './registry'
import type { NodeDef } from './types'
import { createGraphStore, type GraphStore } from './store'
import type { ParamValues } from './types'

function fakeDef(type: string, outputs: NodeDef['outputs'], inputs: NodeDef['inputs']): NodeDef {
  return {
    type,
    code: `XX.${type}`,
    family: 'source',
    nameKey: `ui.nodes.${type}.name`,
    descKey: `ui.nodes.${type}.desc`,
    exampleKey: `ui.nodes.${type}.example`,
    outputs,
    inputs,
    params: [
      {
        id: 'value',
        kind: 'range',
        labelKey: `ui.params.${type}.value.label`,
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.42,
      },
    ],
  }
}

let store: GraphStore

beforeEach(() => {
  clearRegistry()
  registerNode(
    fakeDef('srcA', [{ id: 'out', kind: 'image', labelKey: 'ui.ports.out' }], []),
  )
  registerNode(fakeDef('dstB', [], [{ id: 'in', kind: 'image', labelKey: 'ui.ports.in' }]))
  registerNode(fakeDef('dstC', [], [{ id: 'in', kind: 'signal', labelKey: 'ui.ports.in' }]))
  store = createGraphStore()
})

function add(type: string, x = 0, y = 0): string {
  return store.getState().addNode(type, { x, y })
}

describe('addNode', () => {
  it('creates a node with id, type, position and param defaults', () => {
    const id = add('srcA', 40, 120)
    const node = store.getState().nodes.find((n) => n.id === id)
    expect(node).toBeDefined()
    expect(node?.type).toBe('srcA')
    expect(node?.position).toEqual({ x: 40, y: 120 })
    expect(node?.params).toEqual({ value: 0.42 } satisfies ParamValues)
  })

  it('rejects an unregistered type', () => {
    expect(() => add('nope')).toThrow()
  })

  it('records history', () => {
    add('srcA')
    expect(store.getState().canUndo()).toBe(true)
  })
})

describe('removeNodes', () => {
  it('removes nodes and cascades attached edges', () => {
    const a = add('srcA')
    const b = add('dstB')
    expect(store.getState().connect({ source: { nodeId: a, portId: 'out' }, target: { nodeId: b, portId: 'in' } }).ok).toBe(true)
    store.getState().removeNodes([a])
    expect(store.getState().nodes).toHaveLength(1)
    expect(store.getState().edges).toHaveLength(0)
  })
})

describe('connect', () => {
  it('checkConnection validates without mutating history', () => {
    const a = add('srcA')
    const c = add('dstC')
    const s = store.getState()
    const before = s.past.length
    expect(
      s.checkConnection({ source: { nodeId: a, portId: 'out' }, target: { nodeId: c, portId: 'in' } }),
    ).toEqual({ ok: false, reason: 'incompatible' })
    add('dstB')
    expect(
      store
        .getState()
        .checkConnection({
          source: { nodeId: c, portId: 'value' },
          target: { nodeId: a, portId: 'out' },
        }),
    ).toEqual({ ok: false, reason: 'unknown-port' })
    expect(store.getState().past).toHaveLength(before + 1)
  })

  it('connects compatible ports', () => {
    const a = add('srcA')
    const b = add('dstB')
    expect(
      store.getState().connect({ source: { nodeId: a, portId: 'out' }, target: { nodeId: b, portId: 'in' } }),
    ).toEqual({ ok: true })
    expect(store.getState().edges).toHaveLength(1)
  })

  it('rejects incompatible kinds without touching history', () => {
    const a = add('srcA')
    const c = add('dstC')
    const histDepth = store.getState().past.length
    const r = store
      .getState()
      .connect({ source: { nodeId: a, portId: 'out' }, target: { nodeId: c, portId: 'in' } })
    expect(r).toEqual({ ok: false, reason: 'incompatible' })
    expect(store.getState().edges).toHaveLength(0)
    expect(store.getState().past).toHaveLength(histDepth)
  })

  it('rejects into an occupied input', () => {
    const a = add('srcA')
    const a2 = add('srcA')
    const b = add('dstB')
    const s = store.getState()
    expect(
      s.connect({ source: { nodeId: a, portId: 'out' }, target: { nodeId: b, portId: 'in' } }).ok,
    ).toBe(true)
    expect(
      s.connect({ source: { nodeId: a2, portId: 'out' }, target: { nodeId: b, portId: 'in' } }),
    ).toEqual({ ok: false, reason: 'input-occupied' })
  })
})

describe('disconnect', () => {
  it('removes an edge by id', () => {
    const a = add('srcA')
    const b = add('dstB')
    store.getState().connect({ source: { nodeId: a, portId: 'out' }, target: { nodeId: b, portId: 'in' } })
    const e = store.getState().edges[0]
    if (!e) throw new Error('expected one edge')
    store.getState().disconnect(e.id)
    expect(store.getState().edges).toHaveLength(0)
  })
})

describe('moveNodes and history', () => {
  it('moving without a transaction is not undoable', () => {
    const a = add('srcA')
    store.getState().resetHistory()
    store.getState().moveNodes([{ id: a, position: { x: 9, y: 9 } }])
    expect(store.getState().nodes[0]?.position).toEqual({ x: 9, y: 9 })
    expect(store.getState().canUndo()).toBe(false)
  })

  it('a move transaction restores the pre-drag state on undo', () => {
    const a = add('srcA', 0, 0)
    store.getState().resetHistory()
    store.getState().beginMove()
    store.getState().moveNodes([{ id: a, position: { x: 100, y: -3 } }])
    store.getState().moveNodes([{ id: a, position: { x: 150, y: 7 } }])
    expect(store.getState().nodes[0]?.position).toEqual({ x: 150, y: 7 })
    store.getState().undo()
    expect(store.getState().nodes[0]?.position).toEqual({ x: 0, y: 0 })
  })
})

describe('undo/redo', () => {
  it('undoes and redoes node creation', () => {
    add('srcA')
    add('dstB')
    expect(store.getState().nodes).toHaveLength(2)
    store.getState().undo()
    expect(store.getState().nodes).toHaveLength(1)
    store.getState().redo()
    expect(store.getState().nodes).toHaveLength(2)
  })

  it('does nothing when past is empty', () => {
    store.getState().undo()
    expect(store.getState().nodes).toHaveLength(0)
    expect(store.getState().canRedo()).toBe(false)
  })

  it('drops the redo stack on a new operation', () => {
    add('srcA')
    store.getState().undo()
    expect(store.getState().canRedo()).toBe(true)
    add('dstB')
    expect(store.getState().canRedo()).toBe(false)
    expect(store.getState().nodes).toHaveLength(1)
  })

  it('caps history at 50 steps', () => {
    for (let i = 0; i < 60; i++) add('srcA', i, 0)
    for (let i = 0; i < 50; i++) store.getState().undo()
    const s = store.getState()
    expect(s.nodes).toHaveLength(10)
    expect(s.canUndo()).toBe(false)
    expect(s.canRedo()).toBe(true)
  })
})

describe('history events and param coalescing', () => {
  let clockNow: number
  const clock = () => clockNow

  beforeEach(() => {
    clearRegistry()
    registerNode(fakeDef('srcA', [{ id: 'out', kind: 'image', labelKey: 'ui.ports.out' }], []))
    clockNow = 1_000_000
    store = createGraphStore({ now: clock })
  })

  it('aligns events with snapshots on undo and redo', () => {
    store.getState().addNode('srcA')
    store.getState().addNode('srcA')
    expect(store.getState().events.past.map((e) => e.kind)).toEqual(['addNode', 'addNode'])
    store.getState().undo()
    expect(store.getState().events.past.map((e) => e.kind)).toEqual(['addNode'])
    expect(store.getState().events.future.map((e) => e.kind)).toEqual(['addNode'])
    store.getState().redo()
    expect(store.getState().events.past.map((e) => e.kind)).toEqual(['addNode', 'addNode'])
    expect(store.getState().events.future).toEqual([])
  })

  it('records specific kinds for mutations', () => {
    const a = store.getState().addNode('srcA')
    store.getState().beginMove()
    store.getState().moveNodes([{ id: a, position: { x: 5, y: 5 } }])
    store.getState().setNodeParams(a, { value: 0.2 })
    expect(store.getState().events.past.map((e) => e.kind)).toEqual([
      'addNode',
      'move',
      'params',
    ])
    store.getState().resetHistory()
    expect(store.getState().events.past).toEqual([])
  })

  it('coalesces rapid edits of the same param into one snapshot', () => {
    const a = store.getState().addNode('srcA')
    store.getState().resetHistory()
    clockNow += 100
    store.getState().setNodeParams(a, { value: 0.1 })
    clockNow += 100
    store.getState().setNodeParams(a, { value: 0.2 })
    clockNow += 100
    store.getState().setNodeParams(a, { value: 0.3 })
    expect(store.getState().past).toHaveLength(1)
    expect(store.getState().events.past).toHaveLength(1)
    expect(store.getState().nodes[0]?.params.value).toBe(0.3)
  })

  it('does not coalesce different params or distant edits', () => {
    const a = store.getState().addNode('srcA')
    store.getState().resetHistory()
    clockNow += 100
    store.getState().setNodeParams(a, { value: 0.1 })
    clockNow += 100
    store.getState().setNodeParams(a, { value: 0.2 })
    clockNow += 2000
    store.getState().setNodeParams(a, { value: 0.3 })
    expect(store.getState().past).toHaveLength(2)
    clockNow += 100
    store.getState().setNodeParams(a, { valueX: 0.4 })
    expect(store.getState().past).toHaveLength(3)
  })

  it('jumps N steps into the past atomically', () => {
    store.getState().addNode('srcA')
    store.getState().addNode('srcA')
    store.getState().addNode('srcA')
    store.getState().jumpToPast(2)
    expect(store.getState().nodes).toHaveLength(1)
    expect(store.getState().past).toHaveLength(1)
    expect(store.getState().future).toHaveLength(2)
    expect(store.getState().events.past.map((e) => e.kind)).toEqual(['addNode'])
    expect(store.getState().events.future.map((e) => e.kind)).toEqual(['addNode', 'addNode'])
    store.getState().undo()
    expect(store.getState().nodes).toHaveLength(0)
  })

  it('jumps N steps into the future atomically', () => {
    store.getState().addNode('srcA')
    store.getState().addNode('srcA')
    store.getState().addNode('srcA')
    store.getState().undo()
    store.getState().undo()
    store.getState().jumpToFuture(2)
    expect(store.getState().nodes).toHaveLength(3)
    expect(store.getState().past).toHaveLength(3)
    expect(store.getState().future).toHaveLength(0)
    expect(store.getState().events.past.map((e) => e.kind)).toEqual(['addNode', 'addNode', 'addNode'])
    expect(store.getState().events.future).toEqual([])
  })

  it('jump clamps to available history', () => {
    store.getState().addNode('srcA')
    store.getState().jumpToPast(5)
    expect(store.getState().nodes).toHaveLength(0)
    expect(store.getState().canUndo()).toBe(false)
    store.getState().undo()
    store.getState().jumpToFuture(9)
    expect(store.getState().canRedo()).toBe(false)
    expect(store.getState().nodes).toHaveLength(1)
  })

  it('new mutations after undo drop future events and snapshots', () => {
    store.getState().addNode('srcA')
    store.getState().undo()
    store.getState().addNode('srcA')
    expect(store.getState().events.future).toEqual([])
    expect(store.getState().future).toHaveLength(0)
    expect(store.getState().events.past).toHaveLength(1)
  })

  it('events cap in lockstep with snapshots', () => {
    for (let i = 0; i < 55; i++) {
      clockNow += 10
      store.getState().addNode('srcA')
    }
    expect(store.getState().past).toHaveLength(50)
    expect(store.getState().events.past).toHaveLength(50)
  })
})

describe('selection', () => {
  it('sets, adds and clears selection', () => {
    const a = add('srcA')
    const b = add('dstB')
    store.getState().setSelection([a])
    expect(store.getState().selection).toEqual([a])
    store.getState().toggleSelection([b])
    expect(store.getState().selection.sort()).toEqual([a, b].sort())
    store.getState().clearSelection()
    expect(store.getState().selection).toEqual([])
  })
})

describe('registry', () => {
  it('exposes registered defs', () => {
    const def = getNodeDef('srcA')
    expect(def?.type).toBe('srcA')
    expect(def?.outputs[0]?.kind).toBe('image')
  })
})
