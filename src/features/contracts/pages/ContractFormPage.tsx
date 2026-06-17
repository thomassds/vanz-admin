import { useNavigate } from 'react-router-dom'
import { Toast } from '@/shared/components/Toast'
import { useToast } from '@/shared/hooks/useToast'
import { ContractForm } from '../components/ContractForm'
import { useCreateContractMutation } from '../store/contractsApi'
import type { CreateContractFormData } from '../schemas/create-contract.schema'

export default function ContractFormPage() {
  const navigate = useNavigate()
  const { toast, showToast, dismissToast } = useToast()
  const [createContract, { isLoading }] = useCreateContractMutation()

  async function handleSubmit(data: CreateContractFormData) {
    const contract = await createContract(data).unwrap()
    showToast('Contrato criado com sucesso.', 'success')
    setTimeout(() => void navigate(`/contracts/${contract.id}`), 800)
  }

  return (
    <div>
      {toast && <Toast {...toast} onDismiss={dismissToast} />}

      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void navigate('/contracts')}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
          aria-label="Voltar"
        >
          ←
        </button>
        <h2 className="font-['Montserrat',sans-serif] text-2xl font-bold text-navy">
          Novo contrato
        </h2>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ContractForm
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={() => void navigate('/contracts')}
        />
      </div>
    </div>
  )
}
