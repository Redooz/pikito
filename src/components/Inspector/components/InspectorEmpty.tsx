import { useTranslation } from 'react-i18next'

export function InspectorEmpty() {
  const { t } = useTranslation()
  return (
    <div className="empty">
      <p className="type-faceplate" style={{ marginBottom: 8 }}>
        {t('ui.inspector.noSelection')}
      </p>
      <p style={{ fontSize: 11, lineHeight: 1.5 }}>{t('ui.inspector.noSelectionHint')}</p>
    </div>
  )
}
