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
    <div className="grid gap-0.5">
      <span className="text-xs font-semibold text-gray-400">{label}</span>
      <span className="text-sm text-gray-900">{value || "—"}</span>
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
        <p className="text-sm text-gray-600">Cliente não encontrado.</p>
        <button
          type="button"
          onClick={() => void navigate("/clients")}
          className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
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
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
          aria-label="Voltar"
        >
          ←
        </button>
        <h2 className="font-['Montserrat',sans-serif] text-2xl font-bold text-navy">
          {clientLoading
            ? "Carregando..."
            : (client?.name ?? "Detalhes do cliente")}
        </h2>
      </div>

      {/* Client card */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-['Montserrat',sans-serif] text-sm font-bold text-navy">
            Dados do cliente
          </h3>
          <button
            type="button"
            onClick={() => setFormModal(true)}
            disabled={clientLoading || !client}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Editar
          </button>
        </div>

        {clientLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid gap-1">
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
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
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="font-['Montserrat',sans-serif] text-sm font-bold text-navy">
            Dependentes
          </h3>
          <button
            type="button"
            onClick={() => setDependentModal({ isOpen: true })}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-hover"
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
