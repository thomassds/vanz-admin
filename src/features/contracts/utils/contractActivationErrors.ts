const ACTIVATION_ERROR_MESSAGES: Record<string, string> = {
  CONTRACT_NOT_FOUND: 'Contrato não encontrado.',
  CONTRACT_CANCELED: 'Contratos cancelados não podem ser ativados.',
  INVALID_CONTRACT_STATUS: 'Este contrato já está ativo.',
  TENANT_ACCESS_DENIED: 'Acesso negado.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
}

export function getActivationErrorMessage(code?: string): string {
  if (!code) return 'Algo deu errado. Tente novamente.'
  return ACTIVATION_ERROR_MESSAGES[code] ?? 'Algo deu errado. Tente novamente.'
}
