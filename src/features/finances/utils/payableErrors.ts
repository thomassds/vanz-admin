const PAYABLE_ERROR_MESSAGES: Record<string, string> = {
  PAYABLE_NOT_FOUND: 'Despesa não encontrada.',
  CONTRACT_NOT_FOUND: 'Contrato não encontrado.',
  INVALID_PAYABLE_DATA: 'Dados inválidos. Verifique os campos.',
  PAYABLE_ALREADY_PAID: 'Despesas pagas não podem ser alteradas.',
  PAYABLE_ALREADY_CANCELED: 'Despesas canceladas não podem ser alteradas.',
  INVALID_STATUS_TRANSITION: 'Esta transição de status não é permitida.',
  TENANT_ACCESS_DENIED: 'Acesso negado.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
}

export function getPayableErrorMessage(code?: string): string {
  if (!code) return 'Algo deu errado. Tente novamente.'
  return PAYABLE_ERROR_MESSAGES[code] ?? 'Algo deu errado. Tente novamente.'
}
