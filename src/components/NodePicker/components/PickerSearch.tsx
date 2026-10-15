import { useTranslation } from 'react-i18next'
import type { RefObject } from 'react'
import type { PickerNavApi } from '../hook/usePickerNav'

export function PickerSearch({ nav }: { nav: PickerNavApi }) {
  const { t } = useTranslation()
  return (
    <div className="search">
      <input
        ref={nav.inputRef as RefObject<HTMLInputElement>}
        autoFocus
        value={nav.query}
        onChange={(e) => nav.onQueryChange(e.target.value)}
        placeholder={t('ui.picker.search')}
        onKeyDown={nav.onSearchKeyDown}
      />
    </div>
  )
}
