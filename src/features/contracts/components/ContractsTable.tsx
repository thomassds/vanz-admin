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
        <p className="text-sm text-gray-600">Erro ao carregar contratos.</p>
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
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Valor
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Início
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Vencimento
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
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))
              : contracts?.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {contract?.client?.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatCurrency(contract?.value ?? 0)}
                    </td>
                    <td className="px-4 py-3">
                      <ContractStatusBadge status={contract?.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(contract?.startDate ?? "")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(contract?.endDate ?? "")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          void navigate(`/contracts/${contract.id}`)
                        }
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Ver detalhe
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!isLoading && contracts?.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-600">Nenhum contrato cadastrado.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <span className="text-xs text-gray-500">
            {total} contrato{total !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="flex items-center px-3 text-xs text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
