import { Suspense } from "react";
import EstoqueClient from "./EstoqueClient";
import { getTodosVeiculos } from "@/lib/veiculos";

export const revalidate = 60;

async function EstoqueData() {
  const veiculos = await getTodosVeiculos();
  const marcas = [...new Set(veiculos.map((v) => v.marca))].sort();
  const cores = [...new Set(veiculos.map((v) => v.cor))].sort();
  return <EstoqueClient veiculos={veiculos} marcas={marcas} cores={cores} />;
}

export default function EstoquePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="h-8 w-48 bg-[#1A1A1A] animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1A1A1A] border border-[#2A2A2A] aspect-[4/5] animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <EstoqueData />
    </Suspense>
  );
}
