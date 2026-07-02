import { useNavigate } from "react-router-dom";
import { ContractStatusBadge } from "./ContractStatusBadge";
import type { Contract } from "../types/contract.types";
import { isoToBR } from "@/shared/utils/date";

interface ContractsTableProps {
  contracts: Contract[] | undefined;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isError: boolean;
  onRefetch: () => void;
  onPageChange: (page: number) => void;
}

const SKELETON_ROWS = 5;

function formatDate(dateStr: string): string {
  return isoToBR(dateStr.slice(0, 10));
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ContractsTable({
  contracts,
  total,
  page,
  limit,
  isLoading,
  isError,
  onRefetch,
  onPageChange,
}: ContractsTableProps) {
  const navigate = useNavigate();
  const totalPages = Math.ceil(total / limit);

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-text-muted">Erro ao carregar contratos.</p>
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
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">
                Valor
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">
                Início
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">
                Vencimento
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
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-card-hover" />
                      </td>
                    ))}
                  </tr>
                ))
              : contracts?.map((contract) => (
                  <tr
                    key={contract.id}
                    onClick={() => void navigate(`/contracts/${contract.id}`)}
                    title="Ver detalhes do contrato"
                    className="group cursor-pointer transition-colors hover:bg-card-hover"
                  >
                    <td className="px-4 py-3 font-medium text-text transition-colors group-hover:text-primary">
                      {contract?.client?.name}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-text-muted">
                      {formatCurrency(contract?.value ?? 0)}
                    </td>
                    <td className="px-4 py-3">
                      <ContractStatusBadge status={contract?.status} />
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {formatDate(contract?.startDate ?? "")}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {formatDate(contract?.endDate ?? "")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <span className="flex items-center gap-1 rounded-lg bg-primary-soft px-2.5 py-1.5 text-xs font-bold text-primary transition-all group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-white">
                          Detalhes
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                            <path
                              fill="currentColor"
                              d="M9.4 6 8 7.4l4.6 4.6L8 16.6 9.4 18l6-6-6-6Z"
                            />
                          </svg>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!isLoading && contracts?.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm text-text-muted">Nenhum contrato cadastrado.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-xs text-text-subtle">
            {total} contrato{total !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-card-hover disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="flex items-center px-3 text-xs text-text-muted">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-card-hover disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
