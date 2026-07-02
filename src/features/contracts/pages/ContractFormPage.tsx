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
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-text-muted transition-colors hover:bg-card-hover hover:text-text"
          aria-label="Voltar"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path fill="currentColor" d="m10.8 12 4.6-4.6L14 6l-6 6 6 6 1.4-1.4L10.8 12Z" />
          </svg>
        </button>
        <header>
          <h2 className="font-heading text-2xl font-bold text-text">Novo contrato</h2>
          <p className="mt-0.5 text-sm text-text-muted">
            Preencha os dados para criar o contrato
          </p>
        </header>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <ContractForm
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={() => void navigate('/contracts')}
        />
      </div>
    </div>
  )
}
