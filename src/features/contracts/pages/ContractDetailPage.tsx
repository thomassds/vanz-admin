import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal } from '@/shared/components/Modal'
import { Toast } from '@/shared/components/Toast'
import { useToast } from '@/shared/hooks/useToast'
import { isoToBR } from '@/shared/utils/date'
import { ContractStatusBadge } from '../components/ContractStatusBadge'
import { ContractForm } from '../components/ContractForm'
import { useGetContractByIdQuery, useUpdateContractMutation } from '../store/contractsApi'
import type { CreateContractFormData } from '../schemas/create-contract.schema'

function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="grid gap-0.5">
      <span className="text-xs font-semibold text-gray-400">{label}</span>
      <span className="text-sm text-gray-900">{value || '—'}</span>
    </div>
  )
}

function formatDate(dateStr: string): string {
  return isoToBR(dateStr.slice(0, 10))
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast, showToast, dismissToast } = useToast()
  const [editModalOpen, setEditModalOpen] = useState(false)

  const {
    data: contract,
    isLoading,
    isError,
  } = useGetContractByIdQuery(id!, { skip: !id })

  const [updateContract, { isLoading: isUpdating }] = useUpdateContractMutation()

  async function handleUpdate(data: CreateContractFormData) {
    await updateContract({ id: id!, ...data }).unwrap()
    setEditModalOpen(false)
    showToast('Contrato atualizado com sucesso.', 'success')
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm text-gray-600">Contrato não encontrado.</p>
        <button
          type="button"
          onClick={() => void navigate('/contracts')}
          className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Voltar para contratos
        </button>
      </div>
    )
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
          {isLoading ? 'Carregando...' : `Contrato — ${contract?.client?.name ?? ''}`}
        </h2>
        {contract && <ContractStatusBadge status={contract.status} />}
      </div>

      {/* Dados do contrato */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-['Montserrat',sans-serif] text-sm font-bold text-navy">
            Dados do contrato
          </h3>
          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            disabled={isLoading || !contract}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Editar contrato
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid gap-1">
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <DetailItem label="Cliente" value={contract?.client?.name} />
            <DetailItem
              label="Valor mensal"
              value={contract?.value != null ? formatCurrency(contract.value) : null}
            />
            <DetailItem
              label="Desconto"
              value={contract?.discount != null ? formatCurrency(contract.discount) : null}
            />
            <DetailItem
              label="Valor total"
              value={contract?.totalValue != null ? formatCurrency(contract.totalValue) : null}
            />
            <DetailItem
              label="Dia de vencimento"
              value={contract?.dueDay != null ? `Dia ${contract.dueDay}` : null}
            />
            <DetailItem
              label="Início"
              value={contract?.startDate ? formatDate(contract.startDate) : null}
            />
            <DetailItem
              label="Vencimento"
              value={contract?.endDate ? formatDate(contract.endDate) : null}
            />
            <DetailItem
              label="Primeiro pagamento"
              value={contract?.firstPaymentDate ? formatDate(contract.firstPaymentDate) : null}
            />
            <DetailItem
              label="Duração"
              value={contract?.durationMonths != null ? `${contract.durationMonths} meses` : null}
            />
            <div className="col-span-2 grid gap-0.5 sm:col-span-3">
              <span className="text-xs font-semibold text-gray-400">Dependentes</span>
              {contract?.dependents && contract.dependents.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {contract.dependents.map((d) => (
                    <span
                      key={d.id}
                      className="inline-flex items-center rounded-full border border-primary bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary"
                    >
                      {d.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-900">—</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Link para recebíveis */}
      {contract && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Montserrat',sans-serif] text-sm font-bold text-navy">
                Recebíveis
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Visualize os recebíveis vinculados a este contrato.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void navigate(`/finances/receivables?contractId=${contract.id}`)}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Ver recebíveis →
            </button>
          </div>
        </div>
      )}

      {contract && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Editar contrato"
        >
          <ContractForm
            contract={contract}
            isLoading={isUpdating}
            onSubmit={handleUpdate}
            onCancel={() => setEditModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}
