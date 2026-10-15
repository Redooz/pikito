export type SignalKind = 'image' | 'signal' | 'note' | 'audio'
export type PortKind = SignalKind | 'any'
export type NodeFamily = 'source' | 'vision' | 'control' | 'music' | 'synth' | 'fx' | 'out'

export interface PortDef {
  id: string
  kind: PortKind
  labelKey: string
}

export type ParamKind = 'range' | 'select'

export interface ParamOption {
  value: string
  labelKey: string
}

export interface ParamDef {
  id: string
  kind: ParamKind
  labelKey: string
  helpKey?: string
  min?: number
  max?: number
  step?: number
  options?: ParamOption[]
  defaultValue: number | string
}

export type ParamValues = Record<string, number | string>

export interface NodeDef {
  type: string
  code: string
  family: NodeFamily
  nameKey: string
  descKey: string
  exampleKey: string
  inputs: PortDef[]
  outputs: PortDef[]
  params: ParamDef[]
}

export interface GraphNode {
  id: string
  type: string
  position: { x: number; y: number }
  params: ParamValues
}

export interface GraphEdge {
  id: string
  source: string
  sourcePort: string
  target: string
  targetPort: string
}

export const SIGNAL_TOKENS: Record<SignalKind, string> = {
  image: 'var(--y-signal-visual)',
  signal: 'var(--y-signal-data)',
  note: 'var(--y-signal-note)',
  audio: 'var(--y-signal-audio)',
}
