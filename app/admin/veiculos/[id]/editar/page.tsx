import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VeiculoForm from "../../VeiculoForm";
import { editarVeiculoAction } from "../../actions";
import { getMarcas } from "@/lib/marcas";
import { getCores } from "@/lib/cores";

export const metadata = { title: "Editar Veículo — Admin SS Veículos" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarVeiculoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: v }, marcas, cores] = await Promise.all([
    supabase.from("veiculos").select("*").eq("id", id).single(),
    getMarcas(),
    getCores(),
  ]);

  if (!v) notFound();

  const actionComId = editarVeiculoAction.bind(null, id);

  return (
    <div>
      <div className="mb-8">
        <p className="text-brand-red text-xs uppercase tracking-widest font-bold mb-1">Estoque</p>
        <h1 className="text-c-text text-2xl font-bold uppercase tracking-wide">
          Editar — {v.marca} {v.modelo}
        </h1>
      </div>
      <VeiculoForm
        action={actionComId}
        submitLabel="Salvar alterações"
        marcas={marcas}
        cores={cores}
        defaultValues={{
          marca: v.marca,
          modelo: v.modelo,
          versao: v.versao,
          ano_fab: v.ano_fab,
          ano_mod: v.ano_mod,
          km: v.km,
          preco: v.preco,
          preco_anterior: v.preco_anterior,
          combustivel: v.combustivel,
          cambio: v.cambio,
          cor: v.cor,
          portas: v.portas,
          categoria: v.categoria,
          condicao: v.condicao,
          badge: v.badge,
          fotos: v.fotos,
          opcionais: v.opcionais,
          descricao: v.descricao,
          ativo: v.ativo,
          para_venda: v.para_venda,
          para_locacao: v.para_locacao,
          preco_diaria: v.preco_diaria,
          preco_mensal: v.preco_mensal,
        }}
      />
    </div>
  );
}
