export function formatTaxIdentifier(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 14)

  if (d.length <= 11) {
    // CPF: 000.000.000-00
    if (d.length <= 3) return d
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
  }

  // CNPJ: 00.000.000/0000-00
  return [
    d.slice(0, 2),
    d.length > 2 ? '.' + d.slice(2, 5) : '',
    d.length > 5 ? '.' + d.slice(5, 8) : '',
    d.length > 8 ? '/' + d.slice(8, 12) : '',
    d.length > 12 ? '-' + d.slice(12, 14) : '',
  ].join('')
}
