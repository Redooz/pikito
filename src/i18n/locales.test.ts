import { describe, expect, it } from 'vitest'
import es from './locales/es.json'
import fr from './locales/fr.json'
import en from './locales/en.json'

type DeepRecord = { [k: string]: string | DeepRecord }

function keyPaths(tree: DeepRecord, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k
    if (typeof v === 'string') return [path]
    if (v == null || typeof v !== 'object') throw new Error(`invalid value at ${path}`)
    return keyPaths(v as DeepRecord, path)
  })
}

function readAt(tree: DeepRecord, path: string): string {
  let node: string | DeepRecord = tree
  for (const part of path.split('.')) {
    if (typeof node === 'string') throw new Error(`traversal broke at ${path}`)
    const next: string | DeepRecord | undefined = node[part]
    if (next === undefined) throw new Error(`missing key ${path}`)
    node = next
  }
  if (typeof node !== 'string') throw new Error(`not a leaf: ${path}`)
  return node
}

const locales = { es, fr, en } as const
const names: Array<keyof typeof locales> = ['es', 'fr', 'en'].map((n) => n as keyof typeof locales)

describe('locale key parity', () => {
  it('ships exactly es, fr and en', () => {
    expect(names.sort()).toEqual(['en', 'es', 'fr'])
  })

  it('has non-empty string leaves everywhere', () => {
    for (const name of names) {
      for (const path of keyPaths(locales[name])) {
        expect(readAt(locales[name], path), `${name}:${path}`).not.toBe('')
      }
    }
  })

  it('exposes the same key set in es, fr and en', () => {
    const base = keyPaths(locales[names[0]!]).sort()
    for (const name of names.slice(1)) {
      expect(keyPaths(locales[name]).sort()).toEqual(base)
    }
  })

  it('has the product surface keys', () => {
    for (const name of names) {
      for (const path of [
        'ui.app.title',
        'ui.picker.title',
        'ui.help.example',
        'ui.nodes.const.name',
        'ui.nodes.const.example',
        'ui.nodes.viz.desc',
        'ui.nodes.master.desc',
      ]) {
        expect(readAt(locales[name], path), `${name}:${path}`).toBeTruthy()
      }
    }
  })
})
