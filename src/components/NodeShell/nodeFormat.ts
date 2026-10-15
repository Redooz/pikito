export function formatValue(v: number | string, step?: number): string {
  if (typeof v === 'string') return v
  const decimals = step && step < 1 ? String(step).split('.')[1]?.length ?? 0 : 0
  return v.toFixed(Math.min(decimals, 3))
}
