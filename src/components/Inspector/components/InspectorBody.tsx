import { useTranslation } from 'react-i18next'
import type { ResolvedSelection } from '../inspectorData'
import { ParamRow } from './ParamRow'

export function InspectorBody({ resolved }: { resolved: ResolvedSelection }) {
  const { t } = useTranslation()
  const { node, def } = resolved
  return (
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
  )
}
