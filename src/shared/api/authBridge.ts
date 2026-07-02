/**
 * Ponte entre o axios e o Redux store, sem import circular.
 *
 * O store é a única fonte de verdade da sessão (persistida pelo
 * redux-persist em `persist:auth`). O axios lê o token daqui e,
 * ao receber 401, notifica o store para deslogar — nunca mexe
 * no localStorage diretamente.
 */
export interface AuthSnapshot {
  token: string | null
  tenantId: string | null
}

interface AuthBridge {
  getAuth: () => AuthSnapshot
  onUnauthorized: () => void
}

let bridge: AuthBridge | null = null

export function configureAuthBridge(next: AuthBridge): void {
  bridge = next
}

export function readAuth(): AuthSnapshot {
  return bridge?.getAuth() ?? { token: null, tenantId: null }
}

export function notifyUnauthorized(): void {
  bridge?.onUnauthorized()
}
