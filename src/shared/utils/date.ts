export function maskDateBR(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

export function brToISO(br: string): string {
  const [day, month, year] = br.split('/')
  if (!day || !month || !year || year.length < 4) return ''
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export function isoToBR(iso: string): string {
  if (!iso) return ''
  const [year, month, day] = iso.split('-')
  if (!year || !month || !day) return ''
  return `${day}/${month}/${year}`
}
