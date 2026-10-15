import { memo } from 'react'
import { BaseEdge, getSmoothStepPath, useStore as useFlowStore, type EdgeProps } from '@xyflow/react'

export const SchematicEdge = memo(function SchematicEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, selected, data } =
    props
  const zoom = useFlowStore((s) => s.transform[2])
  const token = (data?.token as string | undefined) ?? 'var(--y-ink)'
  const [path, labelX] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 0,
  })

  const isFlat = Math.abs(sourceY - targetY) < 4
  const dotR = 3 / Math.max(zoom, 0.2)

  return (
    <g className={selected ? 'edge selected' : 'edge'} style={{ color: token }}>
      <BaseEdge path={path} className="edge-path" />
      {!isFlat ? (
        <>
          <circle className="edge-dot" cx={labelX} cy={sourceY} r={dotR} />
          <circle className="edge-dot" cx={labelX} cy={targetY} r={dotR} />
        </>
      ) : null}
    </g>
  )
})
