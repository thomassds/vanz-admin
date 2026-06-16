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

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-['Montserrat',sans-serif] text-2xl font-bold text-navy">
          Clientes
        </h2>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          + Novo cliente
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
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
