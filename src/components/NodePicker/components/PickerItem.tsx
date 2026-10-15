import { useTranslation } from 'react-i18next'
import { FAMILY_TOKENS } from '../../familyTokens'
import type { NodeDef } from '../../../graph/types'
import type { PickerItemRefs } from '../hook/usePickerNav'

export function PickerItem(props: {
  def: NodeDef
  highlighted: boolean
  itemRefs: PickerItemRefs
  onPick: (def: NodeDef) => void
}) {
  const { t } = useTranslation()
  const { def } = props
  return (
    <button
      ref={(el) => {
        if (el) props.itemRefs.current?.set(def.type, el)
        else props.itemRefs.current?.delete(def.type)
      }}
      className={`item ${props.highlighted ? 'hl' : ''}`}
      onMouseDown={() => props.onPick(props.def)}
    >
      <span className="fam-tab" style={{ background: FAMILY_TOKENS[def.family] }} />
      <span className="code">{def.code}</span>
      <span className="name">{t(def.nameKey)}</span>
      <span className="desc">{t(def.descKey)}</span>
    </button>
  )
}
