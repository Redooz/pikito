import { useEffect } from 'react'
import { useStore } from 'zustand'
import { graphStore } from '../graph/store'
import { handleKey } from './shortcuts'

export function useKeyboardShortcuts(onPickerOpen: () => void): void {
  const undo = useStore(graphStore, (s) => s.undo)
  const redo = useStore(graphStore, (s) => s.redo)
  const removeNodes = useStore(graphStore, (s) => s.removeNodes)
  const duplicateNodes = useStore(graphStore, (s) => s.duplicateNodes)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      handleKey(e, {
        onPicker: onPickerOpen,
        remove: removeNodes,
        duplicate: duplicateNodes,
        undo,
        redo,
        getSelection: () => graphStore.getState().selection,
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, removeNodes, duplicateNodes, onPickerOpen])
}
