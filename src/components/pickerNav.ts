export function moveHighlight(current: number, delta: -1 | 1, count: number): number {
  if (count === 0) return -1
  if (current < 0) return delta === 1 ? 0 : count - 1
  const next = current + delta
  if (next < 0) return count - 1
  if (next >= count) return 0
  return next
}
