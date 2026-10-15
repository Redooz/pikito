import { describe, expect, it } from 'vitest'
import { menuFor, type MenuAction } from './contextMenuData'

describe('menuFor', () => {
  it('node menu offers duplicate, delete and disconnect', () => {
    expect(menuFor('node')).toEqual<MenuAction[]>(['duplicate', 'delete', 'disconnect'])
  })
  it('node menu hides disconnect when the node has no edges', () => {
    expect(menuFor('node', false)).toEqual<MenuAction[]>(['duplicate', 'delete'])
  })
  it('edge menu offers just delete', () => {
    expect(menuFor('edge')).toEqual<MenuAction[]>(['delete'])
  })
})
