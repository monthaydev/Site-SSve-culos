import VeiculoForm from "../VeiculoForm";
import { criarVeiculoAction } from "../actions";
import { getMarcas } from "@/lib/marcas";
import { getCores } from "@/lib/cores";

export const metadata = { title: "Novo Veículo — Admin SS Veículos" };

export default async function NovoVeiculoPage() {
  const [marcas, cores] = await Promise.all([getMarcas(), getCores()]);

  return (
    <div>
      <div className="mb-8">
        <p className="text-brand-red text-xs uppercase tracking-widest font-bold mb-1">Estoque</p>
        <h1 className="text-c-text text-2xl font-bold uppercase tracking-wide">Novo Veículo</h1>
      </div>
      <VeiculoForm
        action={criarVeiculoAction}
        submitLabel="Cadastrar veículo"
        marcas={marcas}
        cores={cores}
      />
    </div>
  );
}
