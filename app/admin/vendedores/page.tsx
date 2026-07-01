import { createClient } from "@/lib/supabase/server";
import {
  criarVendedorAction,
  excluirVendedorAction,
  editarVendedorAction,
  alternarAtivoVendedorAction,
} from "./actions";
import { formatWhatsapp } from "@/lib/utils";
import { Pencil, Plus, EyeOff, Eye } from "lucide-react";
import BotaoExcluir from "../BotaoExcluir";

export const metadata = { title: "Vendedores — Admin SS Veículos" };

const inputCls = "bg-c-bg border border-c-border rounded-lg text-c-text px-3 py-2 text-sm outline-none focus:border-brand-red transition-colors w-full";

export default async function VendedoresPage() {
  const supabase = await createClient();
  const { data: vendedores } = await supabase
    .from("vendedores")
    .select("id, nome, whatsapp, ativo")
    .order("ordem")
    .order("nome");

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <p className="text-brand-red text-xs uppercase tracking-widest font-bold mb-1">Equipe</p>
        <h1 className="text-c-text text-2xl font-bold uppercase tracking-wide">Vendedores</h1>
        <p className="text-c-text3 text-sm mt-1">
          Gerencie os vendedores exibidos na seção &quot;Nossa Equipe&quot; da página de Contato. Vendedores inativos ficam ocultos no site.
        </p>
      </div>

      <form
        action={criarVendedorAction}
        className="bg-c-surface rounded-xl shadow-card p-5 mb-6"
      >
        <h2 className="text-c-text font-bold uppercase tracking-wide text-xs mb-4 pb-3 border-b border-c-border">
          Adicionar vendedor
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            name="nome"
            required
            placeholder="Nome"
            className={inputCls}
            autoComplete="off"
          />
          <input
            name="whatsapp"
            required
            placeholder="Ex: (69) 99952-8051"
            className={inputCls}
            autoComplete="off"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Plus size={14} /> Adicionar
          </button>
        </div>
      </form>

      <div className="bg-c-surface rounded-xl shadow-card divide-y divide-c-border overflow-hidden">
        {!vendedores?.length && (
          <p className="px-5 py-8 text-center text-c-text3 text-sm">
            Nenhum vendedor cadastrado ainda.
          </p>
        )}
        {vendedores?.map((v) => (
          <div key={v.id} className="flex items-center gap-3 px-5 py-3 group">
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${v.ativo ? "text-c-text" : "text-c-text4 line-through"}`}>
                {v.nome}
              </p>
              <p className="text-c-text3 text-xs">{formatWhatsapp(v.whatsapp)}</p>
            </div>

            <form action={editarVendedorAction.bind(null, v.id)} className="hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                name="nome"
                defaultValue={v.nome}
                className="bg-c-bg border border-c-border rounded text-c-text text-xs px-2 py-1 outline-none focus:border-brand-red w-28"
              />
              <input
                name="whatsapp"
                defaultValue={formatWhatsapp(v.whatsapp)}
                className="bg-c-bg border border-c-border rounded text-c-text text-xs px-2 py-1 outline-none focus:border-brand-red w-32"
              />
              <button
                type="submit"
                title="Salvar"
                className="text-c-text3 hover:text-brand-red transition-colors"
              >
                <Pencil size={13} />
              </button>
            </form>

            <form action={alternarAtivoVendedorAction.bind(null, v.id, !v.ativo)}>
              <button
                type="submit"
                title={v.ativo ? "Ocultar do site" : "Exibir no site"}
                className="text-c-text3 hover:text-brand-red transition-colors p-1"
              >
                {v.ativo ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </form>

            <BotaoExcluir action={excluirVendedorAction.bind(null, v.id)} nome={v.nome} />
          </div>
        ))}
      </div>

      <p className="text-c-text4 text-xs mt-4">
        {vendedores?.length ?? 0} vendedor{vendedores?.length !== 1 ? "es" : ""} cadastrado{vendedores?.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
