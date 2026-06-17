const RENEWAL_ERROR_MESSAGES: Record<string, string> = {
  CONTRACT_NOT_FOUND: 'Contrato não encontrado.',
  CONTRACT_CANCELED: 'Contratos cancelados não podem ser renovados.',
  INVALID_CONTRACT_PERIOD: 'O período informado é inválido.',
  INVALID_CONTRACT_DATA: 'Desconto não pode ser maior que o valor.',
  TENANT_ACCESS_DENIED: 'Acesso negado.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
}

export function getRenewalErrorMessage(code?: string): string {
  if (!code) return 'Algo deu errado. Tente novamente.'
  return RENEWAL_ERROR_MESSAGES[code] ?? 'Algo deu errado. Tente novamente.'
}
