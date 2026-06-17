const RECEIVABLE_ERROR_MESSAGES: Record<string, string> = {
  RECEIVABLE_NOT_FOUND: 'Recebível não encontrado.',
  CONTRACT_NOT_FOUND: 'Contrato não encontrado.',
  RECEIVABLE_DUPLICATE_DUE_DATE: 'Já existe um recebível com esta data de vencimento para este contrato.',
  RECEIVABLE_ALREADY_PAID: 'Recebíveis pagos não podem ser alterados.',
  RECEIVABLE_ALREADY_CANCELED: 'Recebíveis cancelados não podem ser alterados.',
  INVALID_STATUS_TRANSITION: 'Esta transição de status não é permitida.',
  TENANT_ACCESS_DENIED: 'Acesso negado.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
}

export function getReceivableErrorMessage(code?: string): string {
  if (!code) return 'Algo deu errado. Tente novamente.'
  return RECEIVABLE_ERROR_MESSAGES[code] ?? 'Algo deu errado. Tente novamente.'
}
