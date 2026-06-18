const ERROR_MESSAGES: Record<string, string> = {
  DEVICE_NOT_FOUND: 'Dispositivo não encontrado.',
  DEVICE_ALREADY_EXISTS: 'Este veículo já possui um dispositivo cadastrado.',
  DEVICE_UNIQUE_ID_ALREADY_EXISTS: 'Este identificador já está em uso por outro dispositivo.',
  VEHICLE_NOT_FOUND: 'Veículo não encontrado.',
  TRACKING_PROVIDER_ERROR: 'Erro ao comunicar com o serviço de rastreamento. Tente novamente.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
}

export function getDeviceErrorMessage(code?: string): string {
  if (!code) return 'Ocorreu um erro inesperado. Tente novamente.'
  return ERROR_MESSAGES[code] ?? 'Ocorreu um erro inesperado. Tente novamente.'
}
