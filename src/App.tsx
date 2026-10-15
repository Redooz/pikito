import { useCallback, useEffect, useState } from 'react'
import { ReactFlowProvider, useReactFlow } from '@xyflow/react'
import { useStore } from 'zustand'
import { graphStore } from './graph/store'
import { NodePicker } from './components/NodePicker'
import { Inspector } from './components/Inspector'
import { TopBar } from './components/TopBar'
import { GraphCanvas } from './components/GraphCanvas'
import { applyTheme, getTheme, type Theme } from './design/theme'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

function Shell({ theme, setThemeState }: { theme: Theme; setThemeState: (t: Theme) => void }) {
  const addNode = useStore(graphStore, (s) => s.addNode)
  const { screenToFlowPosition } = useReactFlow()
  const [pickerOpen, setPickerOpen] = useState(false)

  const openPicker = useCallback(() => setPickerOpen(true), [])
  useKeyboardShortcuts(openPicker)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const addAtCenter = useCallback(
    (type: string) => {
      const pos = screenToFlowPosition({
        x: (window.innerWidth - 300) / 2 + (Math.random() - 0.5) * 120,
        y: (window.innerHeight - 44) / 2 + (Math.random() - 0.5) * 120,
      })
      addNode(type, { x: Math.round(pos.x / 8) * 8, y: Math.round(pos.y / 8) * 8 })
      setPickerOpen(false)
    },
    [addNode, screenToFlowPosition],
  )

  return (
    <div className="app">
      <TopBar
        theme={theme}
        onAddNode={openPicker}
        onToggleTheme={() => setThemeState(theme === 'dark' ? 'light' : 'dark')}
      />
      <div className="stage">
        <GraphCanvas />
        <Inspector />
      </div>
      <NodePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={addAtCenter} />
    </div>
  )
}

export default function App() {
  const [theme, setThemeState] = useState<Theme>(getTheme)
  return (
    <ReactFlowProvider>
      <Shell theme={theme} setThemeState={setThemeState} />
    </ReactFlowProvider>
  )
}
