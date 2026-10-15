import { useTranslation } from 'react-i18next'
import type { NodeDef } from '../../../graph/types'

interface HelpPopoverProps {
  def: NodeDef
}

export function HelpPopover({ def }: HelpPopoverProps) {
  const { t } = useTranslation()
  return (
    <div className="help-pop">
      <span className="help-label">{t('ui.help.what')}</span>
      <p>{t(def.descKey)}</p>
      <span className="help-label">{t('ui.help.example')}</span>
      <p className="example">{t(def.exampleKey)}</p>
    </div>
  )
}
