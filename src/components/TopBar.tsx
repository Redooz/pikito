import { useTranslation } from 'react-i18next'
import { useStore } from 'zustand'
import { graphStore } from '../graph/store'
import { LANGUAGES, LANGUAGE_LABELS, setLanguage, type Language } from '../i18n'
import type { Theme } from '../design/theme'

interface TopBarProps {
  theme: Theme
  onAddNode: () => void
  onToggleTheme: () => void
}

export function TopBar({ theme, onAddNode, onToggleTheme }: TopBarProps) {
  const { t, i18n } = useTranslation()
  const canUndo = useStore(graphStore, (s) => s.past.length > 0)
  const canRedo = useStore(graphStore, (s) => s.future.length > 0)
  const undo = useStore(graphStore, (s) => s.undo)
  const redo = useStore(graphStore, (s) => s.redo)
  const currentLang = i18n.language.slice(0, 2) as Language

  return (
    <header className="topbar">
      <span className="brand">PIKITO</span>
      <span className="patch type-micro">{t('ui.app.patchName')}</span>
      <span className="jp-deco">ユコン CV MUSIC</span>
      <span className="sep" />
      <button className="btn btn-live" disabled>
        {t('ui.topbar.play')}
      </button>
      <span className="bpm">120</span>
      <span className="meter">4/4</span>
      <span className="spacer" />
      <div className="btn-group">
        <button className="btn" disabled={!canUndo} onClick={undo} title="Ctrl+Z">
          UNDO
        </button>
        <button className="btn" disabled={!canRedo} onClick={redo} title="Ctrl+Shift+Z">
          REDO
        </button>
      </div>
      <div className="btn-group">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            className={`btn ${lang === currentLang ? 'on' : ''}`}
            onClick={() => setLanguage(lang)}
            title={t('ui.topbar.language')}
          >
            {LANGUAGE_LABELS[lang]}
          </button>
        ))}
      </div>
      <button className="btn" onClick={onToggleTheme} title={t('ui.topbar.theme')}>
        {theme === 'dark' ? t('ui.topbar.themeLight') : t('ui.topbar.themeDark')}
      </button>
      <button className="btn btn-live" onClick={onAddNode}>
        {t('ui.topbar.addNode')}
      </button>
    </header>
  )
}
