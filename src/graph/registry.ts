import type { NodeDef } from './types'

export type { NodeDef }

const defs = new Map<string, NodeDef>()

export function registerNode(def: NodeDef): void {
  if (defs.has(def.type)) throw new Error(`duplicate node type: ${def.type}`)
  paramsSanity(def)
  defs.set(def.type, def)
}

export function clearRegistry(): void {
  defs.clear()
}

export function getNodeDef(type: string): NodeDef | undefined {
  return defs.get(type)
}

export function getNodeDefs(): NodeDef[] {
  return [...defs.values()]
}

function paramsSanity(def: NodeDef) {
  const ids = new Set<string>()
  for (const p of def.params) {
    if (ids.has(p.id)) throw new Error(`duplicate param ${p.id} in ${def.type}`)
    ids.add(p.id)
    if (p.kind === 'range' && (p.min === undefined || p.max === undefined)) {
      throw new Error(`range param ${def.type}.${p.id} needs min/max`)
    }
    if (p.kind === 'select' && (!p.options || p.options.length === 0)) {
      throw new Error(`select param ${def.type}.${p.id} needs options`)
    }
  }
}
