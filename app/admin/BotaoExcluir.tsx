"use client";

import { Trash2 } from "lucide-react";

export default function BotaoExcluir({
  action,
  nome,
}: {
  action: () => Promise<void>;
  nome: string;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        title="Excluir"
        className="text-c-text4 hover:text-brand-red transition-colors p-1"
        onClick={(e) => {
          if (!confirm(`Excluir "${nome}"?`)) e.preventDefault();
        }}
      >
        <Trash2 size={14} />
      </button>
    </form>
  );
}
