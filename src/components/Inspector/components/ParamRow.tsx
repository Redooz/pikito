import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from 'zustand'
import { graphStore } from '../../../graph/store'
import { getNodeDef } from '../../../graph/registry'

export function ParamRow(props: { nodeId: string; paramId: string }) {
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
