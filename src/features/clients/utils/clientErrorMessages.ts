const CLIENT_ERROR_MESSAGES: Record<string, string> = {
  CLIENT_ALREADY_EXISTS: 'Já existe um cliente com este documento.',
  CLIENT_NOT_FOUND: 'Cliente não encontrado.',
  DEPENDENT_ALREADY_EXISTS: 'Já existe um dependente com este documento.',
  DEPENDENT_NOT_FOUND: 'Dependente não encontrado.',
  TENANT_ACCESS_DENIED: 'Acesso negado.',
  INVALID_CLIENT_DATA: 'Verifique os campos e tente novamente.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
}

export function getClientErrorMessage(code?: string): string {
  if (!code) return 'Algo deu errado. Tente novamente.'
  return CLIENT_ERROR_MESSAGES[code] ?? 'Algo deu errado. Tente novamente.'
}
