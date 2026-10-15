import { useTranslation } from 'react-i18next'

export function PickerHeader() {
  const { t } = useTranslation()
  return (
    <header>
      <span className="type-faceplate">{t('ui.picker.title')}</span>
      <span className="type-micro">CTRL+K · ESC</span>
    </header>
  )
}
