const CONTRACT_ERROR_MESSAGES: Record<string, string> = {
  CONTRACT_NOT_FOUND: 'Contrato não encontrado.',
  CLIENT_NOT_FOUND: 'Cliente não encontrado.',
  INVALID_CONTRACT_DATA: 'Verifique os campos e tente novamente.',
  TENANT_ACCESS_DENIED: 'Acesso negado.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
}

export function getContractErrorMessage(code?: string): string {
  if (!code) return 'Algo deu errado. Tente novamente.'
  return CONTRACT_ERROR_MESSAGES[code] ?? 'Algo deu errado. Tente novamente.'
}
