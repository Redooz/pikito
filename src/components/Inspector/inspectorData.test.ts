import { describe, expect, it } from 'vitest'
import '../../nodes'
import { resolveSelected } from './inspectorData'
import type { GraphNode } from '../../graph/types'

function node(id: string, type: string): GraphNode {
  return { id, type, position: { x: 0, y: 0 }, params: {} }
}

describe('resolveSelected', () => {
  it('resolves the first selected node and its def', () => {
    const result = resolveSelected([node('a', 'const'), node('b', 'viz')], ['b', 'a'])
    expect(result?.node.id).toBe('b')
    expect(result?.def.code).toBe('OUT.01')
  })

  it('ignores nodes beyond the first selection entry', () => {
    const result = resolveSelected([node('a', 'const'), node('b', 'viz')], ['a', 'b'])
    expect(result?.node.id).toBe('a')
  })

  it('returns undefined with an empty selection', () => {
    expect(resolveSelected([node('a', 'const')], [])).toBeUndefined()
  })

  it('returns undefined when the selected node is missing', () => {
    expect(resolveSelected([node('a', 'const')], ['ghost'])).toBeUndefined()
  })

  it('returns undefined when the node type has no registered def', () => {
    expect(resolveSelected([node('a', 'nope')], ['a'])).toBeUndefined()
  })
})
