import { usePickerNav } from './hook/usePickerNav'
import { PickerHeader } from './components/PickerHeader'
import { PickerSearch } from './components/PickerSearch'
import { PickerList } from './components/PickerList'
import { PickerKbdRow } from './components/PickerKbdRow'

export interface NodePickerProps {
  open: boolean
  onClose: () => void
  onPick: (type: string) => void
}

export function NodePicker({ open, onClose, onPick }: NodePickerProps) {
  const nav = usePickerNav(onPick, onClose)

  if (!open) return null

  return (
    <div
      className="picker-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="picker crop-marks">
        <PickerHeader />
        <PickerSearch nav={nav} />
        <div className="list">
          <PickerList
            groups={nav.groups}
            highlight={nav.highlight}
            flatIndex={nav.flatIndex}
            itemRefs={nav.itemRefs}
            onPick={nav.pick}
          />
        </div>
        <PickerKbdRow onPick={nav.pickHighlighted} onClose={nav.requestClose} />
      </div>
    </div>
  )
}
