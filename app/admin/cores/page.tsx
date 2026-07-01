import { createClient } from "@/lib/supabase/server";
import { criarCorAction, excluirCorAction, editarCorAction } from "./actions";
import { Pencil, Plus } from "lucide-react";
import BotaoExcluir from "../BotaoExcluir";

export const metadata = { title: "Cores — Admin SS Veículos" };

const AMOSTRA: Record<string, string> = {
  Branco: "#FFFFFF", "Branco Perolizado": "#F8F8F2",
  Preto: "#1A1A1A", "Preto Fosco": "#2C2C2C",
  Prata: "#C0C0C0", Cinza: "#808080", "Cinza Escuro": "#4B4B4B",
  Vermelho: "#C8102E", Vinho: "#7B1C30",
  Azul: "#1E40AF", "Azul Metálico": "#2563EB",
  Verde: "#15803D", Amarelo: "#FACC15", Laranja: "#EA580C",
  Marrom: "#7C3F00", Bege: "#D9C4A0", Dourado: "#B8860B",
  Champagne: "#E8D5B0", Bronze: "#9C5E2B", Grafite: "#555555",
};

const inputCls = "bg-c-bg border border-c-border rounded-lg text-c-text px-3 py-2 text-sm outline-none focus:border-brand-red transition-colors w-full";

export default async function CoresPage() {
  const supabase = await createClient();
  const { data: cores } = await supabase
    .from("cores")
    .select("id, nome")
    .order("nome");

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <p className="text-brand-red text-xs uppercase tracking-widest font-bold mb-1">Catálogo</p>
        <h1 className="text-c-text text-2xl font-bold uppercase tracking-wide">Cores</h1>
        <p className="text-c-text3 text-sm mt-1">
          Gerencie as cores disponíveis no formulário de cadastro de veículos.
        </p>
      </div>

      <form
        action={criarCorAction}
        className="bg-c-surface rounded-xl shadow-card p-5 mb-6"
      >
        <h2 className="text-c-text font-bold uppercase tracking-wide text-xs mb-4 pb-3 border-b border-c-border">
          Adicionar cor
        </h2>
        <div className="flex gap-2">
          <input
            name="nome"
            required
            placeholder="Ex: Azul Turquesa"
            className={inputCls}
            autoComplete="off"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Plus size={14} /> Adicionar
          </button>
        </div>
      </form>

      <div className="bg-c-surface rounded-xl shadow-card divide-y divide-c-border overflow-hidden">
        {!cores?.length && (
          <p className="px-5 py-8 text-center text-c-text3 text-sm">
            Nenhuma cor cadastrada ainda.
          </p>
        )}
        {cores?.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-5 py-3 group">
            <span
              className="w-5 h-5 rounded-full border border-c-border3 shrink-0"
              style={{ background: AMOSTRA[c.nome] ?? "#ccc" }}
            />
            <span className="flex-1 text-c-text text-sm font-medium">{c.nome}</span>

            <form action={editarCorAction.bind(null, c.id)} className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                name="nome"
                defaultValue={c.nome}
                className="bg-c-bg border border-c-border rounded text-c-text text-xs px-2 py-1 outline-none focus:border-brand-red w-36"
              />
              <button
                type="submit"
                title="Salvar"
                className="text-c-text3 hover:text-brand-red transition-colors"
              >
                <Pencil size={13} />
              </button>
            </form>

            <BotaoExcluir action={excluirCorAction.bind(null, c.id)} nome={c.nome} />
          </div>
        ))}
      </div>

      <p className="text-c-text4 text-xs mt-4">
        {cores?.length ?? 0} cor{cores?.length !== 1 ? "es" : ""} cadastrada{cores?.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
