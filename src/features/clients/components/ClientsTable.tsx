import { Link, useNavigate } from "react-router-dom";
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
        status ? "bg-success-soft text-success" : "bg-card-hover text-text-muted",
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
  const navigate = useNavigate();
  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-text-muted">Erro ao carregar clientes.</p>
        <button
          type="button"
          onClick={onRefetch}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover"
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
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">
                Nome
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">
                Documento
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-subtle">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-card-hover" />
                      </td>
                    ))}
                  </tr>
                ))
              : data?.items.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => void navigate(`/clients/${client.id}`)}
                    title="Ver detalhes do cliente"
                    className="group cursor-pointer transition-colors hover:bg-card-hover"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/clients/${client.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-medium text-text transition-colors group-hover:text-primary"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {formatTaxIdentifier(client.taxIdentifier)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={client.isActive} />
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className="flex items-center justify-end gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onEdit(client)}
                          className="text-xs font-medium text-text-muted transition-colors hover:text-text hover:underline"
                        >
                          Editar
                        </button>
                        {client.isActive && (
                          <button
                            type="button"
                            onClick={() => onDisable(client)}
                            className="text-xs font-medium text-danger transition-colors hover:underline"
                          >
                            Desativar
                          </button>
                        )}
                        <Link
                          to={`/clients/${client.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 rounded-lg bg-primary-soft px-2.5 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white group-hover:translate-x-0.5"
                        >
                          Detalhes
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                            <path
                              fill="currentColor"
                              d="M9.4 6 8 7.4l4.6 4.6L8 16.6 9.4 18l6-6-6-6Z"
                            />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!isLoading && data?.items.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-text-muted">Nenhum cliente cadastrado.</p>
          <button
            type="button"
            onClick={onNew}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary-hover"
          >
            Novo cliente
          </button>
        </div>
      )}

      {!isLoading && data && data.total > 0 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-xs text-text-muted">
            {data.total} {data.total === 1 ? "cliente" : "clientes"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-xs text-text-muted">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
