import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal } from '@/shared/components/Modal'
import { Toast } from '@/shared/components/Toast'
import { useToast } from '@/shared/hooks/useToast'
import { isoToBR } from '@/shared/utils/date'
import { ContractStatusBadge } from '../components/ContractStatusBadge'
import { ContractForm } from '../components/ContractForm'
import { ContractHistorySection } from '../components/ContractHistorySection'
import { RenewContractModal } from '../components/RenewContractModal'
import { CancelContractModal } from '../components/CancelContractModal'
import { SuspendContractModal } from '../components/SuspendContractModal'
import { useGetContractByIdQuery, useUpdateContractMutation, useActivateContractMutation } from '../store/contractsApi'
import { getActivationErrorMessage } from '../utils/contractActivationErrors'
import type { CreateContractFormData } from '../schemas/create-contract.schema'
import type { ApiError } from '@/shared/types/api.types'

function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="grid gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
        {label}
      </span>
      <span className="text-sm font-medium text-text">{value || '—'}</span>
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
  const [renewModalOpen, setRenewModalOpen] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [suspendModalOpen, setSuspendModalOpen] = useState(false)

  const {
    data: contract,
    isLoading,
    isError,
  } = useGetContractByIdQuery(id!, { skip: !id })

  const [updateContract, { isLoading: isUpdating }] = useUpdateContractMutation()
  const [activateContract, { isLoading: isActivating }] = useActivateContractMutation()

  async function handleUpdate(data: CreateContractFormData) {
    await updateContract({ id: id!, ...data }).unwrap()
    setEditModalOpen(false)
    showToast('Contrato atualizado com sucesso.', 'success')
  }

  async function handleActivate() {
    try {
      await activateContract({ id: id! }).unwrap()
      showToast('Contrato ativado com sucesso.', 'success')
    } catch (err) {
      showToast(getActivationErrorMessage((err as ApiError).code), 'error')
    }
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm text-text-muted">Contrato não encontrado.</p>
        <button
          type="button"
          onClick={() => void navigate('/contracts')}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover"
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
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-text-muted transition-colors hover:bg-card-hover hover:text-text"
          aria-label="Voltar"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path fill="currentColor" d="m10.8 12 4.6-4.6L14 6l-6 6 6 6 1.4-1.4L10.8 12Z" />
          </svg>
        </button>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-info shadow-sm shadow-primary/25">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
            <path fill="currentColor" d="M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5ZM8 12h8v1.5H8V12Zm0 4h8v1.5H8V16Z" />
          </svg>
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-heading text-2xl font-bold text-text">
              {isLoading ? 'Carregando...' : (contract?.client?.name ?? 'Contrato')}
            </h2>
            {contract && <ContractStatusBadge status={contract.status} />}
          </div>
          <p className="mt-0.5 text-sm text-text-muted">Detalhes do contrato</p>
        </div>
      </div>

      {/* Dados do contrato */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-text">
            Dados do contrato
          </h3>
          {contract && contract.status !== 'canceled' && (
            <div className="flex gap-2">
              {contract.status !== 'active' && (
                <button
                  type="button"
                  onClick={() => void handleActivate()}
                  disabled={isActivating}
                  className="rounded-lg border border-success/40 px-3 py-1.5 text-sm font-medium text-success transition-colors hover:bg-success-soft disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isActivating ? 'Ativando...' : 'Ativar contrato'}
                </button>
              )}
              {contract.status === 'active' && (
                <button
                  type="button"
                  onClick={() => setSuspendModalOpen(true)}
                  className="rounded-lg border border-warning/40 px-3 py-1.5 text-sm font-medium text-warning transition-colors hover:bg-warning-soft"
                >
                  Suspender contrato
                </button>
              )}
              {contract.status !== 'inactive' && (
                <button
                  type="button"
                  onClick={() => setRenewModalOpen(true)}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover"
                >
                  Renovar contrato
                </button>
              )}
              <button
                type="button"
                onClick={() => setEditModalOpen(true)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover"
              >
                Editar contrato
              </button>
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="rounded-lg border border-danger/40 px-3 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
              >
                Cancelar contrato
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid gap-1">
                <div className="h-3 w-16 animate-pulse rounded bg-card-hover" />
                <div className="h-4 w-32 animate-pulse rounded bg-card-hover" />
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
              <span className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
                Dependentes
              </span>
              {contract?.dependents && contract.dependents.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {contract.dependents.map((d) => (
                    <span
                      key={d.id}
                      className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {d.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-text">—</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Link para recebíveis */}
      {contract && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-text">
                Recebíveis
              </h3>
              <p className="mt-0.5 text-xs text-text-subtle">
                Visualize os recebíveis vinculados a este contrato.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void navigate(`/finances/receivables?contractId=${contract.id}`)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover"
            >
              Ver recebíveis →
            </button>
          </div>
        </div>
      )}

      {/* Histórico */}
      {id && (
        <div className="mt-6">
          <ContractHistorySection contractId={id} />
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

      {contract && (
        <RenewContractModal
          contract={contract}
          isOpen={renewModalOpen}
          onClose={() => setRenewModalOpen(false)}
          onSuccess={() => showToast('Contrato renovado com sucesso.', 'success')}
        />
      )}

      {id && (
        <CancelContractModal
          contractId={id}
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onSuccess={() => showToast('Contrato cancelado com sucesso.', 'success')}
        />
      )}

      {id && (
        <SuspendContractModal
          contractId={id}
          isOpen={suspendModalOpen}
          onClose={() => setSuspendModalOpen(false)}
          onSuccess={() => showToast('Contrato suspenso com sucesso.', 'success')}
        />
      )}
    </div>
  )
}
