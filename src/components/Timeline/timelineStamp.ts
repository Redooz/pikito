export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function stamp(ts: number): string {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
