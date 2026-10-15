import { registerNode } from '../graph/registry'
import type { NodeDef } from '../graph/types'

export const constDef: NodeDef = {
  type: 'const',
  code: 'CTRL.01',
  family: 'control',
  nameKey: 'ui.nodes.const.name',
  descKey: 'ui.nodes.const.desc',
  exampleKey: 'ui.nodes.const.example',
  inputs: [],
  outputs: [{ id: 'out', kind: 'signal', labelKey: 'ui.ports.const.out' }],
  params: [
    {
      id: 'value',
      kind: 'range',
      labelKey: 'ui.params.const.value.label',
      helpKey: 'ui.params.const.value.help',
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.5,
    },
  ],
}

export const vizDef: NodeDef = {
  type: 'viz',
  code: 'OUT.01',
  family: 'out',
  nameKey: 'ui.nodes.viz.name',
  descKey: 'ui.nodes.viz.desc',
  exampleKey: 'ui.nodes.viz.example',
  inputs: [{ id: 'in', kind: 'any', labelKey: 'ui.ports.viz.in' }],
  outputs: [],
  params: [
    {
      id: 'gain',
      kind: 'range',
      labelKey: 'ui.params.viz.gain.label',
      helpKey: 'ui.params.viz.gain.help',
      min: 0.1,
      max: 4,
      step: 0.1,
      defaultValue: 1,
    },
  ],
}

export const masterDef: NodeDef = {
  type: 'master',
  code: 'OUT.00',
  family: 'out',
  nameKey: 'ui.nodes.master.name',
  descKey: 'ui.nodes.master.desc',
  exampleKey: 'ui.nodes.master.example',
  inputs: [{ id: 'in', kind: 'audio', labelKey: 'ui.ports.master.in' }],
  outputs: [],
  params: [
    {
      id: 'volume',
      kind: 'range',
      labelKey: 'ui.params.master.volume.label',
      helpKey: 'ui.params.master.volume.help',
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.8,
    },
  ],
}

registerNode(constDef)
registerNode(vizDef)
registerNode(masterDef)
