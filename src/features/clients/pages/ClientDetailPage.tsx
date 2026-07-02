import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toast } from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { useGetClientQuery, useGetDependentsQuery } from "../store/clientsApi";
import { ClientFormModal } from "../components/ClientFormModal";
import { DependentsTable } from "../components/DependentsTable";
import { DependentFormModal } from "../components/DependentFormModal";
import { DeleteDependentDialog } from "../components/DeleteDependentDialog";
import type { Dependent } from "../types/client.types";
import { formatPhone } from "@/shared/utils/phone";
import { formatTaxIdentifier } from "@/shared/utils/taxIdentifier";

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="grid gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
        {label}
      </span>
      <span className="text-sm font-medium text-text">{value || "—"}</span>
    </div>
  );
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast, showToast, dismissToast } = useToast();

  const [formModal, setFormModal] = useState(false);
  const [dependentModal, setDependentModal] = useState<{
    isOpen: boolean;
    dependent?: Dependent;
  }>({ isOpen: false });
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    dependent?: Dependent;
  }>({ isOpen: false });

  const {
    data: client,
    isLoading: clientLoading,
    isError: clientError,
  } = useGetClientQuery(id!, { skip: !id });

  const {
    data: dependents,
    isLoading: dependentsLoading,
    isError: dependentsError,
    refetch: refetchDependents,
  } = useGetDependentsQuery({ clientId: id! }, { skip: !id });

  if (clientError) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm text-text-muted">Cliente não encontrado.</p>
        <button
          type="button"
          onClick={() => void navigate("/clients")}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover"
        >
          Voltar para clientes
        </button>
      </div>
    );
  }

  return (
    <div>
      {toast && <Toast {...toast} onDismiss={dismissToast} />}

      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void navigate("/clients")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-text-muted transition-colors hover:bg-card-hover hover:text-text"
          aria-label="Voltar"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path
              fill="currentColor"
              d="m10.8 12 4.6-4.6L14 6l-6 6 6 6 1.4-1.4L10.8 12Z"
            />
          </svg>
        </button>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-info font-heading text-lg font-bold text-white shadow-sm shadow-primary/25">
          {client?.name?.charAt(0).toUpperCase() ?? "?"}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-heading text-2xl font-bold text-text">
              {clientLoading
                ? "Carregando..."
                : (client?.name ?? "Detalhes do cliente")}
            </h2>
            {client && (
              <span
                className={
                  client.isActive
                    ? "inline-flex shrink-0 rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success"
                    : "inline-flex shrink-0 rounded-full bg-card-hover px-2.5 py-0.5 text-xs font-semibold text-text-muted"
                }
              >
                {client.isActive ? "Ativo" : "Inativo"}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-text-muted">Detalhes do cliente</p>
        </div>
      </div>

      {/* Client card */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-text">
            Dados do cliente
          </h3>
          <button
            type="button"
            onClick={() => setFormModal(true)}
            disabled={clientLoading || !client}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover disabled:opacity-50"
          >
            Editar
          </button>
        </div>

        {clientLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid gap-1">
                <div className="h-3 w-16 animate-pulse rounded bg-card-hover" />
                <div className="h-4 w-32 animate-pulse rounded bg-card-hover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <DetailItem label="Nome" value={client?.name} />
            <DetailItem
              label="CPF / CNPJ"
              value={
                client?.taxIdentifier
                  ? formatTaxIdentifier(client.taxIdentifier)
                  : null
              }
            />
            <DetailItem
              label="Telefone"
              value={client?.phone ? formatPhone(client.phone) : null}
            />
            <DetailItem label="E-mail" value={client?.email} />
          </div>
        )}
      </div>

      {/* Dependents section */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-heading text-sm font-bold text-text">
            Dependentes
          </h3>
          <button
            type="button"
            onClick={() => setDependentModal({ isOpen: true })}
            className="rounded-xl bg-primary px-3.5 py-2 text-sm font-bold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary-hover"
          >
            + Adicionar dependente
          </button>
        </div>

        <DependentsTable
          dependents={dependents}
          isLoading={dependentsLoading}
          isError={dependentsError}
          onRefetch={refetchDependents}
          onEdit={(dep) => setDependentModal({ isOpen: true, dependent: dep })}
          onDelete={(dep) => setDeleteDialog({ isOpen: true, dependent: dep })}
          onNew={() => setDependentModal({ isOpen: true })}
        />
      </div>

      {client && (
        <ClientFormModal
          isOpen={formModal}
          client={client}
          onClose={() => setFormModal(false)}
          onSuccess={(msg) => {
            setFormModal(false);
            showToast(msg, "success");
          }}
        />
      )}

      <DependentFormModal
        isOpen={dependentModal.isOpen}
        clientId={id!}
        dependent={dependentModal.dependent}
        onClose={() => setDependentModal({ isOpen: false })}
        onSuccess={(msg) => {
          setDependentModal({ isOpen: false });
          showToast(msg, "success");
        }}
      />

      <DeleteDependentDialog
        isOpen={deleteDialog.isOpen}
        dependent={deleteDialog.dependent ?? null}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onSuccess={(msg) => {
          setDeleteDialog({ isOpen: false });
          showToast(msg, "success");
        }}
      />
    </div>
  );
}
