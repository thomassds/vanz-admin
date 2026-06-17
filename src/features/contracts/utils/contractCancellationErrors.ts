const CANCELLATION_ERROR_MESSAGES: Record<string, string> = {
  CONTRACT_NOT_FOUND: 'Contrato não encontrado.',
  CONTRACT_ALREADY_CANCELED: 'Este contrato já foi cancelado.',
  INVALID_CANCEL_REASON: 'Motivo deve ter entre 3 e 500 caracteres.',
  TENANT_ACCESS_DENIED: 'Acesso negado.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
}

export function getCancellationErrorMessage(code?: string): string {
  if (!code) return 'Algo deu errado. Tente novamente.'
  return CANCELLATION_ERROR_MESSAGES[code] ?? 'Algo deu errado. Tente novamente.'
}
