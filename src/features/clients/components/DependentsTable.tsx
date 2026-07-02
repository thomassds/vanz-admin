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
        <p className="text-sm text-text-muted">Erro ao carregar dependentes.</p>
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
                CPF
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">
                Data de nascimento
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
              : dependents?.map((dep) => (
                  <tr key={dep.id} className="transition-colors hover:bg-card-hover">
                    <td className="px-4 py-3 font-medium text-text">
                      {dep.name}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {formatTaxIdentifier(dep.taxIdentifier)}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
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
          <p className="text-sm text-text-muted">Nenhum dependente cadastrado.</p>
          <button
            type="button"
            onClick={onNew}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary-hover"
          >
            Adicionar dependente
          </button>
        </div>
      )}
    </div>
  );
}
