import { describe, expect, it } from 'vitest'
import '../../nodes'
import { getNodeDefs } from '../../graph/registry'
import { buildPickerIndex, FAMILY_ORDER } from './pickerData'

const identity = (k: string) => k

const defs = getNodeDefs()
const defOf = (type: string) => {
  const d = defs.find((x) => x.type === type)
  if (!d) throw new Error(`missing def: ${type}`)
  return d
}

describe('FAMILY_ORDER', () => {
  it('orders the seven picker families', () => {
    expect(FAMILY_ORDER).toEqual(['source', 'vision', 'control', 'music', 'synth', 'fx', 'out'])
  })
})

describe('buildPickerIndex', () => {
  it('groups by family in FAMILY_ORDER, omitting empty families', () => {
    const { groups, flat } = buildPickerIndex([defOf('const'), defOf('master')], '', identity)
    expect(groups.map((g) => g.family)).toEqual(['control', 'out'])
    expect(groups.map((g) => g.defs.map((d) => d.type))).toEqual([['const'], ['master']])
    expect(flat.map((d) => d.type)).toEqual(['const', 'master'])
  })

  it('filters by node code case-insensitively', () => {
    const { flat } = buildPickerIndex(defs, 'out.0', identity)
    expect(flat.map((d) => d.type)).toContain('viz')
  })

  it('filters by translated name and description', () => {
    const byName = buildPickerIndex(defs, 'ui.nodes.viz.nA', identity)
    const byDesc = buildPickerIndex(defs, 'ui.nodes.viz.des', identity)
    expect(byName.flat.map((d) => d.type)).toEqual(['viz'])
    expect(byDesc.flat.map((d) => d.type)).toEqual(['viz'])
  })

  it('returns empty groups and flat lists for a no-match query', () => {
    const { groups, flat } = buildPickerIndex([defOf('const')], 'zzz', identity)
    expect(groups).toEqual([])
    expect(flat).toEqual([])
  })

  it('deduplicates nothing but keeps def order within a family', () => {
    const { groups } = buildPickerIndex([defOf('master'), defOf('viz')], '', identity)
    expect(groups).toEqual([{ family: 'out', defs: [defOf('master'), defOf('viz')] }])
  })
})
