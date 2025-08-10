export function addDays(yyyyMmDd: string, delta: number) {
  const d = new Date(yyyyMmDd)
  d.setDate(d.getDate() + delta)
  return d.toISOString().slice(0, 10)
}

export function formatISO(d: Date) {
  return d.toISOString().slice(0, 10)
}
