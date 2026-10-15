import { createStore, type StoreApi } from 'zustand/vanilla'
import { getNodeDef } from './registry'
import { validateConnection, type ConnectionAttempt, type ConnectionVerdict } from './validate'
import type { GraphEdge, GraphNode, ParamValues } from './types'

interface Snapshot {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export type HistoryKind =
  | 'addNode'
  | 'removeNodes'
  | 'duplicate'
  | 'connect'
  | 'disconnect'
  | 'move'
  | 'params'

export type MoveUpdate = { id: string; position: { x: number; y: number } }

export interface HistoryEvent {
  kind: HistoryKind
  ts: number
}

const PARAM_COALESCE_MS = 700

export interface GraphState {
  nodes: GraphNode[]
  edges: GraphEdge[]
  selection: string[]
  past: Snapshot[]
  future: Snapshot[]
  events: { past: HistoryEvent[]; future: HistoryEvent[] }
  addNode: (type: string, position?: { x: number; y: number }) => string
  removeNodes: (ids: string[]) => void
  duplicateNodes: (ids: string[]) => string[]
  moveNodes: (updates: MoveUpdate[]) => void
  beginMove: () => void
  connect: (attempt: ConnectionAttempt) => ConnectionVerdict
  checkConnection: (attempt: ConnectionAttempt) => ConnectionVerdict
  disconnect: (edgeId: string) => void
  setNodeParams: (id: string, values: ParamValues) => void
  setSelection: (ids: string[]) => void
  toggleSelection: (ids: string[]) => void
  clearSelection: () => void
  undo: () => void
  redo: () => void
  jumpToPast: (steps: number) => void
  jumpToFuture: (steps: number) => void
  canUndo: () => boolean
  canRedo: () => boolean
  resetHistory: () => void
}

export type GraphStore = StoreApi<GraphState>

const HISTORY_LIMIT = 50

function clone(s: Snapshot): Snapshot {
  return {
    nodes: structuredClone(s.nodes),
    edges: structuredClone(s.edges),
  }
}

export interface GraphStoreOptions {
  now?: () => number
}

export function createGraphStore(options: GraphStoreOptions = {}): GraphStore {
  return createStore<GraphState>((set, get) => {
    const now = options.now ?? Date.now
    let pendingParamKey: string | null = null
    let pendingParamTs = 0

    const pushHistory = (kind: HistoryKind) => {
      const s = get()
      const past = s.past.concat(clone({ nodes: s.nodes, edges: s.edges }))
      while (past.length > HISTORY_LIMIT) past.shift()
      const pastEvents = s.events.past.concat({ kind, ts: now() })
      while (pastEvents.length > HISTORY_LIMIT) pastEvents.shift()
      set({
        past,
        future: [],
        events: { past: pastEvents, future: [] },
      })
      pendingParamKey = null
    }

    const pushCoalesced = (key: string | null, ts: number) => {
      if (key !== null && pendingParamKey === key && ts - pendingParamTs <= PARAM_COALESCE_MS) {
        set({ future: [] })
        return
      }
      pushHistory('params')
      pendingParamKey = key
      pendingParamTs = ts
    }
    const newId = (prefix: string) =>
      `${prefix}_${crypto.randomUUID().slice(0, 8)}`

    return {
      nodes: [],
      edges: [],
      selection: [],
      past: [],
      future: [],
      events: { past: [], future: [] },

      addNode: (type, position) => {
        const def = getNodeDef(type)
        if (!def) throw new Error(`unknown node type: ${type}`)
        pushHistory('addNode')
        const id = newId(type)
        const params: ParamValues = {}
        for (const p of def.params) params[p.id] = p.defaultValue
        set((s) => ({
          nodes: s.nodes.concat({
            id,
            type,
            position: position ?? { x: 120 + Math.round(Math.random() * 200), y: 120 + Math.round(Math.random() * 200) },
            params,
          }),
        }))
        return id
      },

      removeNodes: (ids) => {
        if (ids.length === 0) return
        pushHistory('removeNodes')
        set((s) => ({
          nodes: s.nodes.filter((n) => !ids.includes(n.id)),
          edges: s.edges.filter((e) => !ids.includes(e.source) && !ids.includes(e.target)),
          selection: s.selection.filter((id) => !ids.includes(id)),
        }))
      },

      duplicateNodes: (ids) => {
        if (ids.length === 0) return []
        const s = get()
        const defs = s.nodes.filter((n) => ids.includes(n.id))
        if (defs.length === 0) return []
        pushHistory('duplicate')
        const created = defs.map((n) => ({
          ...structuredClone(n),
          id: newId(n.type),
          position: { x: n.position.x + 24, y: n.position.y + 24 },
        }))
        set((cur) => ({
          nodes: cur.nodes.concat(created),
          selection: created.map((n) => n.id),
        }))
        return created.map((n) => n.id)
      },

      moveNodes: (updates) => {
        set((s) => ({
          nodes: s.nodes.map((n) => {
            const u = updates.find((m) => m.id === n.id)
            return u ? { ...n, position: u.position } : n
          }),
        }))
      },

      beginMove: () => pushHistory('move'),

      connect: (attempt) => {
        const s = get()
        const verdict = s.checkConnection(attempt)
        if (!verdict.ok) return verdict
        pushHistory('connect')
        set((cur) => ({
          edges: cur.edges.concat({
            id: newId('e'),
            source: attempt.source.nodeId,
            sourcePort: attempt.source.portId,
            target: attempt.target.nodeId,
            targetPort: attempt.target.portId,
          }),
        }))
        return verdict
      },

      checkConnection: (attempt) => {
        const s = get()
        const kindOf = (nodeId: string, portId: string, dir: 'out' | 'in') => {
          const node = s.nodes.find((n) => n.id === nodeId)
          const def = node && getNodeDef(node.type)
          if (!def) return undefined
          const ports = dir === 'out' ? def.outputs : def.inputs
          const port = ports.find((p) => p.id === portId)
          return port?.kind
        }
        return validateConnection(attempt, {
          edges: s.edges,
          resolve: kindOf,
        })
      },

      disconnect: (edgeId) => {
        if (!get().edges.some((e) => e.id === edgeId)) return
        pushHistory('disconnect')
        set((s) => ({ edges: s.edges.filter((e) => e.id !== edgeId) }))
      },

      setNodeParams: (id, values) => {
        const ts = now()
        const paramIds = Object.keys(values).sort().join(',')
        pushCoalesced(`${id}:${paramIds}`, ts)
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === id ? { ...n, params: { ...n.params, ...values } } : n,
          ),
        }))
      },

      setSelection: (ids) => set({ selection: ids }),

      toggleSelection: (ids) =>
        set((s) => {
          const sel = new Set(s.selection)
          for (const id of ids) {
            if (sel.has(id)) sel.delete(id)
            else sel.add(id)
          }
          return { selection: [...sel] }
        }),

      clearSelection: () => set({ selection: [] }),

      undo: () => {
        const s = get()
        if (s.past.length === 0 || s.events.past.length === 0) return
        const past = [...s.past]
        const snapshot = past.pop()
        if (!snapshot) return
        const pastEvents = [...s.events.past]
        const event = pastEvents.pop()
        if (!event) return
        pendingParamKey = null
        set({
          nodes: snapshot.nodes,
          edges: snapshot.edges,
          past,
          future: s.future.concat({ nodes: structuredClone(s.nodes), edges: structuredClone(s.edges) }),
          events: { past: pastEvents, future: s.events.future.concat([event]) },
        })
      },

      redo: () => {
        const s = get()
        if (s.future.length === 0) return
        const future = [...s.future]
        const snapshot = future.pop()
        if (!snapshot) return
        const futureEvents = [...s.events.future]
        const event = futureEvents.pop()
        if (!event) return
        pendingParamKey = null
        set({
          nodes: snapshot.nodes,
          edges: snapshot.edges,
          future,
          past: s.past.concat({ nodes: structuredClone(s.nodes), edges: structuredClone(s.edges) }),
          events: { past: s.events.past.concat([event]), future: futureEvents },
        })
      },

      jumpToPast: (steps) => {
        const s = get()
        const n = Math.min(Math.max(steps | 0, 0), s.past.length)
        if (n === 0) return
        pendingParamKey = null
        const past = s.past.slice()
        const pastEvents = s.events.past.slice()
        const future = s.future.slice()
        const futureEvents = s.events.future.slice()
        let current: Snapshot = { nodes: structuredClone(s.nodes), edges: structuredClone(s.edges) }
        for (let i = 0; i < n; i++) {
          const snapshot = past.pop()
          const event = pastEvents.pop()
          if (!snapshot || !event) break
          future.push(current)
          current = snapshot
          futureEvents.push(event)
        }
        set({
          nodes: current.nodes,
          edges: current.edges,
          past,
          future,
          events: { past: pastEvents, future: futureEvents },
        })
      },

      jumpToFuture: (steps) => {
        const s = get()
        const n = Math.min(Math.max(steps | 0, 0), s.future.length)
        if (n === 0) return
        pendingParamKey = null
        const future = s.future.slice()
        const futureEvents = s.events.future.slice()
        const past = s.past.slice()
        const pastEvents = s.events.past.slice()
        let current: Snapshot = { nodes: structuredClone(s.nodes), edges: structuredClone(s.edges) }
        for (let i = 0; i < n; i++) {
          const snapshot = future.pop()
          const event = futureEvents.pop()
          if (!snapshot || !event) break
          past.push(current)
          current = snapshot
          pastEvents.push(event)
        }
        set({
          nodes: current.nodes,
          edges: current.edges,
          future,
          past,
          events: { past: pastEvents, future: futureEvents },
        })
      },

      canUndo: () => get().past.length > 0,
      canRedo: () => get().future.length > 0,

      resetHistory: () => {
        pendingParamKey = null
        set({ past: [], future: [], events: { past: [], future: [] } })
      },
    }
  })
}

export const graphStore = createGraphStore()
