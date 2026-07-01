import { createClient } from "@/lib/supabase/server";
import { criarMarcaAction, excluirMarcaAction, editarMarcaAction } from "./actions";
import { Pencil, Plus } from "lucide-react";
import BotaoExcluir from "../BotaoExcluir";

export const metadata = { title: "Marcas — Admin SS Veículos" };

const inputCls = "bg-c-bg border border-c-border rounded-lg text-c-text px-3 py-2 text-sm outline-none focus:border-brand-red transition-colors w-full";

export default async function MarcasPage() {
  const supabase = await createClient();
  const { data: marcas } = await supabase
    .from("marcas")
    .select("id, nome")
    .order("nome");

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <p className="text-brand-red text-xs uppercase tracking-widest font-bold mb-1">Catálogo</p>
        <h1 className="text-c-text text-2xl font-bold uppercase tracking-wide">Marcas</h1>
        <p className="text-c-text3 text-sm mt-1">
          Gerencie as marcas disponíveis no formulário de cadastro de veículos.
        </p>
      </div>

      <form
        action={criarMarcaAction}
        className="bg-c-surface rounded-xl shadow-card p-5 mb-6"
      >
        <h2 className="text-c-text font-bold uppercase tracking-wide text-xs mb-4 pb-3 border-b border-c-border">
          Adicionar marca
        </h2>
        <div className="flex gap-2">
          <input
            name="nome"
            required
            placeholder="Ex: Honda"
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
        {!marcas?.length && (
          <p className="px-5 py-8 text-center text-c-text3 text-sm">
            Nenhuma marca cadastrada ainda.
          </p>
        )}
        {marcas?.map((m) => (
          <div key={m.id} className="flex items-center gap-3 px-5 py-3 group">
            <span className="flex-1 text-c-text text-sm font-medium">{m.nome}</span>

            <form action={editarMarcaAction.bind(null, m.id)} className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                name="nome"
                defaultValue={m.nome}
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

            <BotaoExcluir action={excluirMarcaAction.bind(null, m.id)} nome={m.nome} />
          </div>
        ))}
      </div>

      <p className="text-c-text4 text-xs mt-4">
        {marcas?.length ?? 0} marca{marcas?.length !== 1 ? "s" : ""} cadastrada{marcas?.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
