import type { NodeDef, NodeFamily } from '../../graph/types'

export const FAMILY_ORDER: NodeFamily[] = ['source', 'vision', 'control', 'music', 'synth', 'fx', 'out']

export interface PickerGroup {
  family: NodeFamily
  defs: NodeDef[]
}

function matches(def: NodeDef, q: string, translate: (key: string) => string): boolean {
  return (
    def.code.toLowerCase().includes(q) ||
    translate(def.nameKey).toLowerCase().includes(q) ||
    translate(def.descKey).toLowerCase().includes(q)
  )
}

export function buildPickerIndex(
  defs: NodeDef[],
  query: string,
  translate: (key: string) => string,
): { groups: PickerGroup[]; flat: NodeDef[] } {
  const q = query.trim().toLowerCase()
  const filtered = q ? defs.filter((d) => matches(d, q, translate)) : defs
  const byFamily = new Map<NodeFamily, PickerGroup>()
  for (const d of filtered) {
    let group = byFamily.get(d.family)
    if (!group) {
      group = { family: d.family, defs: [] }
      byFamily.set(d.family, group)
    }
    group.defs.push(d)
  }
  const groups = [...byFamily.values()].sort(
    (a, b) => FAMILY_ORDER.indexOf(a.family) - FAMILY_ORDER.indexOf(b.family),
  )
  const flat = groups.flatMap((g) => g.defs)
  return { groups, flat }
}
