import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useDeleteDependentMutation } from '../store/clientsApi'
import { getClientErrorMessage } from '../utils/clientErrorMessages'
import type { Dependent } from '../types/client.types'
import type { ApiError } from '@/shared/types/api.types'

interface DeleteDependentDialogProps {
  isOpen: boolean
  dependent: Dependent | null
  onClose: () => void
  onSuccess: (message: string) => void
}

export function DeleteDependentDialog({
  isOpen,
  dependent,
  onClose,
  onSuccess,
}: DeleteDependentDialogProps) {
  const [deleteDependent, { isLoading }] = useDeleteDependentMutation()

  const handleConfirm = async () => {
    if (!dependent) return
    try {
      await deleteDependent(dependent.id).unwrap()
      onSuccess('Dependente excluído com sucesso.')
    } catch (err) {
      const apiError = err as ApiError
      alert(getClientErrorMessage(apiError.code))
    }
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Excluir dependente"
      description={
        dependent
          ? `Tem certeza que deseja excluir ${dependent.name}? Essa ação não pode ser desfeita.`
          : 'Tem certeza que deseja excluir este dependente?'
      }
      confirmLabel="Excluir"
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  )
}
