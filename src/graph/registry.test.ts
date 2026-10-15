import { describe, expect, it } from 'vitest'
import { getNodeDefs } from './registry'
import '../nodes'
import es from '../i18n/locales/es.json'
import fr from '../i18n/locales/fr.json'
import en from '../i18n/locales/en.json'

type DeepRecord = { [k: string]: string | DeepRecord }

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

const locales: Record<'es' | 'fr' | 'en', DeepRecord> = { es, fr, en }

describe('node catalog', () => {
  const defs = getNodeDefs()

  it('ships the three placeholders', () => {
    expect(defs.map((d) => d.type).sort()).toEqual(['const', 'master', 'viz'].sort())
  })

  it('declares well-formed codes', () => {
    for (const def of defs) {
      expect(def.code).toMatch(/^[A-Z0-9]{2,4}\.\d{2}$/)
    }
  })

  it('has unique codes', () => {
    const codes = defs.map((d) => d.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('const emits a signal port only', () => {
    const def = defs.find((d) => d.type === 'const')
    expect(def?.inputs).toHaveLength(0)
    expect(def?.outputs.map((p) => p.kind)).toEqual(['signal'])
  })

  it('viz accepts any kind and has no outputs', () => {
    const def = defs.find((d) => d.type === 'viz')
    expect(def?.inputs.map((p) => p.kind)).toEqual(['any'])
    expect(def?.outputs).toHaveLength(0)
  })

  it('master receives audio and has no outputs', () => {
    const def = defs.find((d) => d.type === 'master')
    expect(def?.inputs.map((p) => p.kind)).toEqual(['audio'])
    expect(def?.outputs).toHaveLength(0)
  })

  it('const has a 0-1 range param with default inside bounds', () => {
    const def = defs.find((d) => d.type === 'const')
    const p = def?.params.find((q) => q.id === 'value')
    expect(p?.kind).toBe('range')
    expect(Number(p?.defaultValue)).toBeGreaterThanOrEqual(Number(p?.min))
    expect(Number(p?.defaultValue)).toBeLessThanOrEqual(Number(p?.max))
  })

  it('has every help and label key translated in es, fr and en', () => {
    for (const def of defs) {
      for (const key of [def.nameKey, def.descKey, def.exampleKey]) {
        for (const [lang, tree] of Object.entries(locales)) {
          expect(readAt(tree, key), `${lang}:${key}`).toBeTruthy()
        }
      }
      const ports = [...def.inputs, ...def.outputs]
      for (const port of ports) {
        for (const [lang, tree] of Object.entries(locales)) {
          expect(readAt(tree, port.labelKey), `${lang}:${port.labelKey}`).toBeTruthy()
        }
      }
      for (const param of def.params) {
        for (const [lang, tree] of Object.entries(locales)) {
          expect(readAt(tree, param.labelKey), `${lang}:${param.labelKey}`).toBeTruthy()
          if (param.helpKey) {
            expect(readAt(tree, param.helpKey), `${lang}:${param.helpKey}`).toBeTruthy()
          }
          for (const opt of param.options ?? []) {
            expect(readAt(tree, opt.labelKey), `${lang}:${opt.labelKey}`).toBeTruthy()
          }
        }
      }
    }
  })
})
