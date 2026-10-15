import { useTranslation } from 'react-i18next'
import { PickerItem } from './PickerItem'
import type { NodeDef } from '../../../graph/types'
import type { PickerGroup } from '../pickerData'
import type { PickerItemRefs } from '../hook/usePickerNav'

export function PickerList(props: {
  groups: PickerGroup[]
  highlight: number
  flatIndex: Map<string, number>
  itemRefs: PickerItemRefs
  onPick: (def: NodeDef) => void
}) {
  const { t } = useTranslation()
  if (props.groups.length === 0) return <div className="no-results">{t('ui.picker.empty')}</div>
  return (
    <>
      {props.groups.map(({ family, defs }) => (
        <div key={family}>
          <div className="family-row">
            <span>{t(`ui.families.${family}`)}</span>
          </div>
          {defs.map((def) => (
            <PickerItem
              key={def.type}
              def={def}
              highlighted={props.flatIndex.get(def.type) === props.highlight}
              itemRefs={props.itemRefs}
              onPick={props.onPick}
            />
          ))}
        </div>
      ))}
    </>
  )
}
