const SUSPENSION_ERROR_MESSAGES: Record<string, string> = {
  CONTRACT_NOT_FOUND: 'Contrato não encontrado.',
  CONTRACT_ALREADY_SUSPENDED: 'Este contrato já está suspenso.',
  INVALID_CONTRACT_STATUS: 'Apenas contratos ativos podem ser suspensos.',
  VALIDATION_ERROR: 'Motivo deve ter entre 3 e 500 caracteres.',
  TENANT_ACCESS_DENIED: 'Acesso negado.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
}

export function getSuspensionErrorMessage(code?: string): string {
  if (!code) return 'Algo deu errado. Tente novamente.'
  return SUSPENSION_ERROR_MESSAGES[code] ?? 'Algo deu errado. Tente novamente.'
}
