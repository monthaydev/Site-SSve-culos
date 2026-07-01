"use client";

import Image from "next/image";
import ListagemVeiculos from "@/components/ListagemVeiculos";
import type { Veiculo } from "@/lib/types";
import type { FiltroConfig } from "@/lib/hooks/useFiltrosVeiculos";

const valorLocacao = (v: Veiculo) => v.precoMensal ?? v.precoDiaria ?? 0;

const CONFIG: FiltroConfig = {
  campos: [
    "categoria", "marca", "modelo",
    "anoMin", "anoMax", "combustivel", "cambio",
    "cor", "mensalMax", "portas",
  ],
  sortOptions: [
    { value: "recent",     label: "Mais recentes" },
    { value: "price_asc",  label: "Menor valor" },
    { value: "price_desc", label: "Maior valor" },
    { value: "year_desc",  label: "Mais novos (ano)" },
  ],
  valorOrdenacao: valorLocacao,
};

const CABECALHO = (
  <>
    <div className="inline-flex bg-white rounded-xl shadow-card px-4 py-3 mb-4">
      <Image
        src="/logo-ss-locadora.png"
        alt="SS Veículos Locadora"
        width={788}
        height={552}
        priority
        className="h-14 w-auto"
      />
    </div>
    <h1 className="font-display text-4xl md:text-5xl text-c-text leading-none uppercase">
      Veículos para Locação
    </h1>
    <p className="font-sans text-sm text-c-text2 mt-3 max-w-xl">
      Diárias e planos mensais com a confiança de quem está há mais de 22 anos
      no mercado. Escolha o veículo e fale com a gente.
    </p>
  </>
);

export default function LocadoraClient({
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
      modo="locacao"
      config={CONFIG}
      cabecalho={CABECALHO}
      emptyMsg="Em breve, novos veículos para locação."
    />
  );
}
