"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { excluirVeiculoAction } from "./actions";

interface Props {
  id: string;
  label?: boolean;
}

export default function BotaoExcluir({ id, label = false }: Props) {
  const [confirmando, setConfirmando] = useState(false);

  if (confirmando) {
    return (
      <div className="flex items-center gap-1">
        <form action={excluirVeiculoAction.bind(null, id)}>
          <button
            type="submit"
            className="flex items-center gap-1 text-xs font-black uppercase tracking-widest bg-brand-red text-white px-2 py-1 rounded-md hover:bg-brand-red-hover transition-colors"
          >
            <AlertTriangle size={10} />
            Excluir
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          className="text-xs font-bold uppercase tracking-widest text-c-text3 hover:text-c-text px-2 py-1 rounded-md transition-colors border border-c-border"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirmando(true)}
      className={
        label
          ? "text-c-text3 text-xs hover:text-brand-red transition-colors"
          : "p-1.5 text-c-text3 hover:text-brand-red transition-colors"
      }
      title="Excluir veículo"
    >
      {label ? "Excluir" : <Trash2 size={14} />}
    </button>
  );
}
