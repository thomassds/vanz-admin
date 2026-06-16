const AUTH_ERROR_MESSAGES: Record<string, string> = {
  USER_NOT_FOUND: 'E-mail não cadastrado na plataforma.',
  INVALID_CREDENTIALS: 'Senha incorreta.',
  EMAIL_NOT_VALIDATED: 'Seu e-mail ainda não foi validado. Verifique sua caixa de entrada.',
  VALIDATION_ERROR: 'Verifique os campos e tente novamente.',
  EMAIL_ALREADY_EXISTS: 'Este e-mail já está cadastrado.',
  INVALID_EMAIL_FORMAT: 'Formato de e-mail inválido.',
  PHONE_ALREADY_EXISTS: 'Este telefone já está cadastrado.',
  INVALID_PHONE_FORMAT: 'Formato de telefone inválido.',
  INVALID_CODE: 'Código inválido.',
  CODE_EXPIRED: 'Código expirado. Solicite um novo.',
  CODE_MAX_ATTEMPTS_EXCEEDED: 'Número máximo de tentativas atingido. Solicite um novo código.',
  PHONE_NOT_VALIDATED: 'Seu telefone ainda não foi validado.',
  COMPANY_NAME_REQUIRED: 'Nome da empresa obrigatório.',
  INVALID_COMPANY_DATA: 'Dados da empresa inválidos ou incompletos.',
  INVALID_TAX_IDENTIFIER: 'CPF/CNPJ inválido.',
  WEAK_PASSWORD: 'A senha não atende aos requisitos mínimos.',
  USER_ALREADY_ONBOARDED: 'Usuário já completou o cadastro.',
}

export function getAuthErrorMessage(code?: string): string {
  if (!code) return 'Algo deu errado. Tente novamente.'
  return AUTH_ERROR_MESSAGES[code] ?? 'Algo deu errado. Tente novamente.'
}
