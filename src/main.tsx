import { createRoot } from 'react-dom/client'
import '@fontsource/martian-mono/400.css'
import '@fontsource/martian-mono/500.css'
import '@fontsource/martian-mono/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/silkscreen/400.css'
import '@fontsource/noto-sans-jp/400.css'
import '@xyflow/react/dist/style.css'
import './design/tokens.css'
import './design/global.css'
import { initI18n } from './i18n'
import App from './App'
import './nodes'

initI18n()

createRoot(document.getElementById('root')!).render(<App />)
