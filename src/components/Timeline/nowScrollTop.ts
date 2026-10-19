export function nowScrollTop(input: {
  scrollTop: number
  clientHeight: number
  scrollHeight: number
  nowOffsetTop: number
  nowHeight: number
}): number {
  const target = input.nowOffsetTop + input.nowHeight - input.clientHeight
  const max = Math.max(0, input.scrollHeight - input.clientHeight)
  return Math.min(Math.max(target, 0), max)
}
