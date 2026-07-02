import { useState } from "react";
import { Toast } from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { useGetClientsQuery } from "../store/clientsApi";
import { ClientFilters } from "../components/ClientFilters";
import { ClientsTable } from "../components/ClientsTable";
import { ClientFormModal } from "../components/ClientFormModal";
import { DisableClientDialog } from "../components/DisableClientDialog";
import type { Client } from "../types/client.types";

const PAGE_LIMIT = 10;

export default function ClientsPage() {
  const [filters, setFilters] = useState({
    name: "",
    taxIdentifier: "",
    status: "",
    page: 1,
  });
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    client?: Client;
  }>({
    isOpen: false,
  });
  const [disableDialog, setDisableDialog] = useState<{
    isOpen: boolean;
    client?: Client;
  }>({
    isOpen: false,
  });
  const { toast, showToast, dismissToast } = useToast();

  const { data, isLoading, isFetching, isError, refetch } = useGetClientsQuery({
    page: filters.page,
    limit: PAGE_LIMIT,
    name: filters.name || undefined,
    taxIdentifier: filters.taxIdentifier || undefined,
    status: filters.status || undefined,
  });

  const openCreate = () => setFormModal({ isOpen: true });
  const openEdit = (client: Client) => setFormModal({ isOpen: true, client });
  const closeForm = () => setFormModal({ isOpen: false });

  const openDisable = (client: Client) =>
    setDisableDialog({ isOpen: true, client });
  const closeDisable = () => setDisableDialog({ isOpen: false });

  return (
    <div>
      {toast && <Toast {...toast} onDismiss={dismissToast} />}

      <div className="mb-6 flex items-center justify-between gap-3">
        <header>
          <h2 className="font-heading text-2xl font-bold text-text">Clientes</h2>
          <p className="mt-1 text-sm text-text-muted">
            Gerencie os responsáveis e seus dependentes
          </p>
        </header>
        <button
          type="button"
          onClick={openCreate}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary-hover"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
          </svg>
          Novo cliente
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <ClientFilters
          onFilter={(f) => setFilters((prev) => ({ ...prev, ...f, page: 1 }))}
        />
        <ClientsTable
          data={data}
          isLoading={isLoading || isFetching}
          isError={isError}
          onRefetch={refetch}
          onEdit={openEdit}
          onDisable={openDisable}
          onNew={openCreate}
          page={filters.page}
          limit={PAGE_LIMIT}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      </div>

      <ClientFormModal
        isOpen={formModal.isOpen}
        client={formModal.client}
        onClose={closeForm}
        onSuccess={(msg) => {
          closeForm();
          showToast(msg, "success");
        }}
      />

      <DisableClientDialog
        isOpen={disableDialog.isOpen}
        client={disableDialog.client ?? null}
        onClose={closeDisable}
        onSuccess={(msg) => {
          closeDisable();
          showToast(msg, "success");
        }}
      />
    </div>
  );
}
