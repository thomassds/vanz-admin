const AUTH_ERROR_MESSAGES: Record<string, string> = {
  USER_NOT_FOUND: 'E-mail não cadastrado na plataforma.',
  INVALID_CREDENTIALS: 'Senha incorreta.',
  EMAIL_NOT_VALIDATED: 'Seu e-mail ainda não foi validado. Verifique sua caixa de entrada.',
  VALIDATION_ERROR: 'Verifique os campos e tente novamente.',
}

export function getAuthErrorMessage(code?: string): string {
  if (!code) return 'Algo deu errado. Tente novamente.'
  return AUTH_ERROR_MESSAGES[code] ?? 'Algo deu errado. Tente novamente.'
}
