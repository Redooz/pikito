export interface ContextMenuTarget {
  kind: 'node' | 'edge'
  ids: string[]
  hasEdges?: boolean
  x: number
  y: number
}
