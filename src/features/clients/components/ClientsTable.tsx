import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import type { Client } from "../types/client.types";
import type { PaginatedResponse } from "@/shared/types/api.types";
import { formatTaxIdentifier } from "@/shared/utils/taxIdentifier";

interface ClientsTableProps {
  data: PaginatedResponse<Client> | undefined;
  isLoading: boolean;
  isError: boolean;
  onRefetch: () => void;
  onEdit: (client: Client) => void;
  onDisable: (client: Client) => void;
  onNew: () => void;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const SKELETON_ROWS = 5;

function StatusBadge({ status }: { status: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        status ? "bg-success-light text-success" : "bg-gray-200 text-gray-600",
      )}
    >
      {status ? "Ativo" : "Inativo"}
    </span>
  );
}

export function ClientsTable({
  data,
  isLoading,
  isError,
  onRefetch,
  onEdit,
  onDisable,
  onNew,
  page,
  limit,
  onPageChange,
}: ClientsTableProps) {
  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-gray-600">Erro ao carregar clientes.</p>
        <button
          type="button"
          onClick={onRefetch}
          className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Nome
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Documento
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))
              : data?.items.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/clients/${client.id}`}
                        className="font-medium text-navy hover:text-primary hover:underline"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatTaxIdentifier(client.taxIdentifier)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={client.isActive} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(client)}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Editar
                        </button>
                        {client.isActive && (
                          <button
                            type="button"
                            onClick={() => onDisable(client)}
                            className="text-xs font-medium text-danger hover:underline"
                          >
                            Desativar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!isLoading && data?.items.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-gray-600">Nenhum cliente cadastrado.</p>
          <button
            type="button"
            onClick={onNew}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Novo cliente
          </button>
        </div>
      )}

      {!isLoading && data && data.total > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <span className="text-xs text-gray-600">
            {data.total} {data.total === 1 ? "cliente" : "clientes"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-xs text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
