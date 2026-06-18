const ERROR_MESSAGES: Record<string, string> = {
  VEHICLE_NOT_FOUND: 'Veículo não encontrado.',
  VEHICLE_PLATE_ALREADY_EXISTS: 'Já existe um veículo com esta placa.',
  INVALID_VEHICLE_DATA: 'Dados inválidos. Verifique os campos.',
  TENANT_ACCESS_DENIED: 'Acesso negado.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
}

export function getVehicleErrorMessage(code?: string): string {
  if (!code) return 'Ocorreu um erro inesperado. Tente novamente.'
  return ERROR_MESSAGES[code] ?? 'Ocorreu um erro inesperado. Tente novamente.'
}
