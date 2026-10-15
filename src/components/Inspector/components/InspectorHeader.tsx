import { useTranslation } from 'react-i18next'
import type { ResolvedSelection } from '../inspectorData'

export function InspectorHeader({ resolved }: { resolved: ResolvedSelection | undefined }) {
  const { t } = useTranslation()
  return (
    <header>
      <span className="type-faceplate">{t('ui.inspector.title')}</span>
      <span className="type-micro" data-node-count={resolved?.node.type}>
        {resolved?.def.code ?? '---'}
      </span>
    </header>
  )
}
