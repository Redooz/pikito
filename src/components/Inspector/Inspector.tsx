import { useShallow } from 'zustand/react/shallow'
import { useStore } from 'zustand'
import { graphStore, type GraphState } from '../../graph/store'
import { Timeline } from '../Timeline'
import { InspectorHeader } from './components/InspectorHeader'
import { InspectorBody } from './components/InspectorBody'
import { InspectorEmpty } from './components/InspectorEmpty'
import { resolveSelected, type ResolvedSelection } from './inspectorData'

export function Inspector() {
  const resolved = useStore(
    graphStore,
    useShallow<GraphState, ResolvedSelection | undefined>((s) => resolveSelected(s.nodes, s.selection)),
  )
  return (
    <aside className="inspector">
      <InspectorHeader resolved={resolved} />
      {resolved ? <InspectorBody resolved={resolved} /> : <InspectorEmpty />}
      <Timeline />
    </aside>
  )
}
