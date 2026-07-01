"use client";

import ListagemVeiculos from "@/components/ListagemVeiculos";
import type { Veiculo } from "@/lib/types";
import type { FiltroConfig } from "@/lib/hooks/useFiltrosVeiculos";

const CONFIG: FiltroConfig = {
  campos: [
    "categoria", "condicao", "marca", "modelo",
    "anoMin", "anoMax", "combustivel", "cambio",
    "cor", "precoMax", "kmMax", "portas",
  ],
  sortOptions: [
    { value: "recent",     label: "Mais recentes" },
    { value: "price_asc",  label: "Menor preço" },
    { value: "price_desc", label: "Maior preço" },
    { value: "year_desc",  label: "Mais novos (ano)" },
    { value: "km_asc",     label: "Menor KM" },
  ],
  valorOrdenacao: (v: Veiculo) => v.preco ?? 0,
};

const CABECALHO = (
  <>
    <p className="font-condensed font-bold uppercase tracking-widest text-xs text-brand-red mb-2">
      Nossa Frota
    </p>
    <h1 className="font-display text-4xl md:text-5xl text-c-text leading-none uppercase">
      Todos os Veículos
    </h1>
  </>
);

export default function EstoqueClient({
  veiculos,
  marcas,
  cores,
}: {
  veiculos: Veiculo[];
  marcas: string[];
  cores: string[];
}) {
  return (
    <ListagemVeiculos
      veiculos={veiculos}
      marcas={marcas}
      cores={cores}
      modo="venda"
      config={CONFIG}
      cabecalho={CABECALHO}
      emptyMsg="Tente remover alguns filtros."
    />
  );
}
