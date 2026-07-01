import { Suspense } from "react";
import LocadoraClient from "./LocadoraClient";
import { getVeiculosLocacao } from "@/lib/veiculos";

export const revalidate = 60;

export const metadata = {
  title: "Locadora — SS Veículos",
  description:
    "Aluguel de veículos em Cacoal–RO. Diárias e planos mensais com a confiança da SS Veículos, há mais de 22 anos no mercado.",
};

async function LocadoraData() {
  const veiculos = await getVeiculosLocacao();
  const marcas = [...new Set(veiculos.map((v) => v.marca))].sort();
  const cores = [...new Set(veiculos.map((v) => v.cor))].sort();
  return <LocadoraClient veiculos={veiculos} marcas={marcas} cores={cores} />;
}

export default function LocadoraPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="h-8 w-48 bg-c-surface2 animate-pulse mb-8 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-c-surface2 rounded-2xl aspect-[4/5] animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <LocadoraData />
    </Suspense>
  );
}
