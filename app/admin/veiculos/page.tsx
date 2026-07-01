import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";
import TabelaVeiculos from "./TabelaVeiculos";

export const metadata = { title: "Veículos — Admin SS Veículos" };

interface Props {
  searchParams: Promise<{ erro?: string; ok?: string }>;
}

const MSGS_OK: Record<string, string> = {
  criado: "Veículo cadastrado com sucesso.",
  editado: "Veículo atualizado com sucesso.",
  excluido: "Veículo excluído permanentemente.",
};

export default async function AdminVeiculosPage({ searchParams }: Props) {
  const { erro, ok } = await searchParams;
  const supabase = await createClient();

  const { data: veiculos } = await supabase
    .from("veiculos")
    .select("id,slug,marca,modelo,versao,ano_mod,preco,badge,ativo,categoria,fotos,para_venda,para_locacao,preco_diaria,preco_mensal")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-brand-red text-xs uppercase tracking-widest font-bold mb-1">
            Estoque
          </p>
          <h1 className="text-c-text text-2xl font-bold uppercase tracking-wide">
            Veículos
          </h1>
        </div>
        <Link
          href="/admin/veiculos/novo"
          className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={14} />
          Novo veículo
        </Link>
      </div>

      {ok && MSGS_OK[ok] && (
        <div className="mb-5 flex items-center gap-2.5 border border-green-500/25 bg-green-500/8 rounded-lg px-4 py-3 text-green-600 text-sm">
          <CheckCircle2 size={15} className="shrink-0" />
          {MSGS_OK[ok]}
        </div>
      )}

      {erro && (
        <div className="mb-5 flex items-center gap-2.5 border border-brand-red/30 bg-brand-red/8 rounded-lg px-4 py-3 text-brand-red text-sm">
          <AlertCircle size={15} className="shrink-0" />
          Erro ao salvar. Verifique os dados e tente novamente.
        </div>
      )}

      {!veiculos || veiculos.length === 0 ? (
        <div className="bg-c-surface rounded-xl shadow-card p-16 text-center">
          <p className="text-c-text3 text-sm mb-4">
            Nenhum veículo cadastrado ainda.
          </p>
          <Link
            href="/admin/veiculos/novo"
            className="inline-flex items-center gap-2 border border-brand-red rounded-lg text-brand-red hover:bg-brand-red hover:text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 transition-colors"
          >
            <Plus size={12} /> Cadastrar agora
          </Link>
        </div>
      ) : (
        <TabelaVeiculos veiculos={veiculos} />
      )}

      {veiculos && veiculos.length > 0 && (
        <p className="text-c-text4 text-xs mt-4 text-right">
          {veiculos.length} veículo{veiculos.length !== 1 ? "s" : ""} no total
        </p>
      )}
    </div>
  );
}
