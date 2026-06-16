import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useDisableClientMutation } from '../store/clientsApi'
import { getClientErrorMessage } from '../utils/clientErrorMessages'
import type { Client } from '../types/client.types'
import type { ApiError } from '@/shared/types/api.types'

interface DisableClientDialogProps {
  isOpen: boolean
  client: Client | null
  onClose: () => void
  onSuccess: (message: string) => void
}

export function DisableClientDialog({ isOpen, client, onClose, onSuccess }: DisableClientDialogProps) {
  const [disableClient, { isLoading }] = useDisableClientMutation()

  const handleConfirm = async () => {
    if (!client) return
    try {
      await disableClient(client.id).unwrap()
      onSuccess('Cliente desativado com sucesso.')
    } catch (err) {
      const apiError = err as ApiError
      alert(getClientErrorMessage(apiError.code))
    }
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Desativar cliente"
      description={
        client
          ? `Tem certeza que deseja desativar ${client.name}? O histórico será mantido.`
          : 'Tem certeza que deseja desativar este cliente?'
      }
      confirmLabel="Desativar"
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  )
}
