import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from 'zustand'
import { graphStore } from '../graph/store'
import { getNodeDef } from '../graph/registry'

function ParamRow(props: { nodeId: string; paramId: string }) {
  const { t } = useTranslation()
  const { nodeId, paramId } = props
  const node = useStore(graphStore, (s) => s.nodes.find((n) => n.id === nodeId))
  const def = node ? getNodeDef(node.type) : undefined
  const param = def?.params.find((p) => p.id === paramId)
  const setNodeParams = useStore(graphStore, (s) => s.setNodeParams)
  const [helpOpen, setHelpOpen] = useState(false)
  if (!def || !param || !node) return null
  const value = node.params[param.id] as number

  return (
    <div className="param">
      <div className="param-head">
        <span className="param-label">{t(param.labelKey)}</span>
        {param.helpKey ? (
          <button
            className={`btn-i ${helpOpen ? 'on' : ''}`}
            onClick={() => setHelpOpen((v) => !v)}
            aria-label={t('ui.inspector.info')}
          >
            i
          </button>
        ) : null}
        <span className="param-value">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={param.min}
        max={param.max}
        step={param.step}
        value={value}
        onChange={(e) => setNodeParams(node.id, { [param.id]: Number(e.target.value) })}
      />
      {helpOpen && param.helpKey ? <span className="param-help">{t(param.helpKey)}</span> : null}
    </div>
  )
}

export function Inspector() {
  const { t } = useTranslation()
  const selection = useStore(graphStore, (s) => s.selection)
  const selectedId = selection[0]
  const node = useStore(graphStore, (s) =>
    selectedId ? s.nodes.find((n) => n.id === selectedId) : undefined,
  )
  const def = node ? getNodeDef(node.type) : undefined

  return (
    <aside className="inspector">
      <header>
        <span className="type-faceplate">{t('ui.inspector.title')}</span>
        <span className="type-micro" data-node-count={node?.type}>
          {def?.code ?? '---'}
        </span>
      </header>
      {node && def ? (
        <div className="body">
          <div className="node-head">
            <span className="code">{def.code}</span>
            <span className="name">{t(def.nameKey)}</span>
          </div>
          <div className="help-block">
            <span className="help-label">{t('ui.help.what')}</span>
            <p>{t(def.descKey)}</p>
            <span className="help-label">{t('ui.help.example')}</span>
            <p>{t(def.exampleKey)}</p>
          </div>
          <span className="type-faceplate param-label">{t('ui.inspector.params')}</span>
          {def.params.map((p) => (
            <ParamRow key={p.id} nodeId={node.id} paramId={p.id} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p className="type-faceplate" style={{ marginBottom: 8 }}>
            {t('ui.inspector.noSelection')}
          </p>
          <p style={{ fontSize: 11, lineHeight: 1.5 }}>{t('ui.inspector.noSelectionHint')}</p>
        </div>
      )}
    </aside>
  )
}
