import { formatTaxIdentifier } from "@/shared/utils/taxIdentifier";
import type { Dependent } from "../types/client.types";

interface DependentsTableProps {
  dependents: Dependent[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRefetch: () => void;
  onEdit: (dependent: Dependent) => void;
  onDelete: (dependent: Dependent) => void;
  onNew: () => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
}

const SKELETON_ROWS = 3;

export function DependentsTable({
  dependents,
  isLoading,
  isError,
  onRefetch,
  onEdit,
  onDelete,
  onNew,
}: DependentsTableProps) {
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-gray-600">Erro ao carregar dependentes.</p>
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
                CPF
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Data de nascimento
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
              : dependents?.map((dep) => (
                  <tr key={dep.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {dep.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatTaxIdentifier(dep.taxIdentifier)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(dep.birthDate)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(dep)}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(dep)}
                          className="text-xs font-medium text-danger hover:underline"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!isLoading && dependents?.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-gray-600">Nenhum dependente cadastrado.</p>
          <button
            type="button"
            onClick={onNew}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Adicionar dependente
          </button>
        </div>
      )}
    </div>
  );
}
