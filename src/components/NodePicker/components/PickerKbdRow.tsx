import { useTranslation } from 'react-i18next'

export function PickerKbdRow(props: { onPick: () => void; onClose: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="kbd-row">
      <button
        className="kbd-btn"
        onMouseDown={(e) => {
          e.preventDefault()
          props.onPick()
        }}
        aria-label={t('ui.picker.pick')}
      >
        ↑↓ ⏎
      </button>
      <button className="kbd-btn" onMouseDown={props.onClose} aria-label={t('ui.picker.closeEsc')}>
        ESC
      </button>
    </div>
  )
}
