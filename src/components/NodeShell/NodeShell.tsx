import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'
import { useTranslation } from 'react-i18next'
import { useStore } from 'zustand'
import { graphStore } from '../../graph/store'
import { getNodeDef } from '../../graph/registry'
import { FAMILY_TOKENS } from '../familyTokens'
import type { NodeDef } from '../../graph/types'
import { formatValue } from './nodeFormat'
import { Ports } from './components/Ports'
import { ThumbPattern } from './components/ThumbPattern'
import { HelpPopover } from './components/HelpPopover'
import { useHelpToggle } from './hook/useHelpToggle'

export const DeviceNode = memo(function DeviceNode({ id, selected }: NodeProps) {
  const { t } = useTranslation()
  const node = useStore(graphStore, (s) => s.nodes.find((n) => n.id === id))
  const [helpOpen, , toggleHelp] = useHelpToggle()
  const def: NodeDef | undefined = node ? getNodeDef(node.type) : undefined
  if (!node || !def) return null

  const firstParam = def.params[0]
  const readout = firstParam && node.params[firstParam.id] !== undefined ? formatValue(node.params[firstParam.id] as number, firstParam.step) : undefined

  return (
    <div className={`device-node ${selected ? 'is-selected' : ''}`} data-node={def.type}>
      <Ports ports={def.inputs} side="in" />
      <div className="head">
        <span className="tab" style={{ background: FAMILY_TOKENS[def.family] }} />
        <span className="code">{def.code}</span>
        <span className="name">{t(def.nameKey)}</span>
        <button
          className={`btn-i ${helpOpen ? 'on' : ''}`}
          onClick={toggleHelp}
          aria-expanded={helpOpen}
          aria-label={t('ui.inspector.info')}
        >
          i
        </button>
      </div>
      <div className="lcd">
        <ThumbPattern family={def.family} />
        <span className="type-lcd">{readout ?? t('ui.status.fake')}</span>
      </div>
      <div className="foot">
        <span>{t(`ui.families.${def.family}`)}</span>
        <span className="val">{readout ?? '---'}</span>
      </div>
      {helpOpen ? <HelpPopover def={def} /> : null}
      <Ports ports={def.outputs} side="out" />
    </div>
  )
})
