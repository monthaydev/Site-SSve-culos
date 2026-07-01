import { cache } from "react";
import { createClient } from "./supabase/server";
import type { Veiculo } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Veiculo {
  return {
    id: String(row.id),
    slug: String(row.slug),
    marca: String(row.marca),
    modelo: String(row.modelo),
    versao: String(row.versao),
    anoFab: Number(row.ano_fab),
    anoMod: Number(row.ano_mod),
    km: Number(row.km),
    preco: row.preco != null ? Number(row.preco) : undefined,
    precoAnterior: row.preco_anterior ? Number(row.preco_anterior) : undefined,
    paraVenda: row.para_venda !== false,
    paraLocacao: row.para_locacao === true,
    precoDiaria: row.preco_diaria != null ? Number(row.preco_diaria) : undefined,
    precoMensal: row.preco_mensal != null ? Number(row.preco_mensal) : undefined,
    combustivel: row.combustivel as Veiculo["combustivel"],
    cambio: row.cambio as Veiculo["cambio"],
    cor: String(row.cor),
    portas: Number(row.portas),
    categoria: row.categoria as Veiculo["categoria"],
    condicao: row.condicao as Veiculo["condicao"],
    badge: row.badge ?? undefined,
    fotos: Array.isArray(row.fotos) && row.fotos.length > 0 ? row.fotos : [],
    opcionais: Array.isArray(row.opcionais) ? row.opcionais : [],
    descricao: String(row.descricao ?? ""),
  };
}

export async function getTodosVeiculos(): Promise<Veiculo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("veiculos")
    .select("*")
    .eq("ativo", true)
    .eq("para_venda", true)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapRow);
}

export async function getVeiculosLocacao(): Promise<Veiculo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("veiculos")
    .select("*")
    .eq("ativo", true)
    .eq("para_locacao", true)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapRow);
}

export async function getDestaques(limit = 6): Promise<Veiculo[]> {
  const supabase = await createClient();

  // Busca o dobro do limite para ter pool suficiente para priorização
  const { data } = await supabase
    .from("veiculos")
    .select("*")
    .eq("ativo", true)
    .eq("para_venda", true)
    .order("created_at", { ascending: false })
    .limit(limit * 2);

  if (!data || data.length === 0) return [];

  // Prioriza veículos com badge; complementa com os demais se necessário
  const comBadge = data.filter((v) => v.badge);
  const semBadge = data.filter((v) => !v.badge);
  const resultado = [
    ...comBadge,
    ...semBadge.slice(0, Math.max(0, limit - comBadge.length)),
  ].slice(0, limit);

  return resultado.map(mapRow);
}

// Deduplica a query dentro da mesma request (generateMetadata + page chamam
// o mesmo slug) — evita 2 idas idênticas ao Supabase em série.
export const getVeiculoBySlug = cache(
  async (slug: string): Promise<Veiculo | null> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("veiculos")
      .select("*")
      .eq("slug", slug)
      .eq("ativo", true)
      .maybeSingle();
    return data ? mapRow(data) : null;
  }
);

export async function getMarcas(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("veiculos")
    .select("marca")
    .eq("ativo", true)
    .eq("para_venda", true);
  const marcas = [...new Set((data ?? []).map((v) => String(v.marca)))];
  return marcas.sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function getCategoriasCount(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("veiculos")
    .select("categoria")
    .eq("ativo", true)
    .eq("para_venda", true);
  return (data ?? []).reduce<Record<string, number>>((acc, v) => {
    if (v.categoria) acc[v.categoria] = (acc[v.categoria] ?? 0) + 1;
    return acc;
  }, {});
}

export async function getVeiculosSimilares(
  veiculo: Veiculo,
  limit = 3
): Promise<Veiculo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("veiculos")
    .select("*")
    .eq("ativo", true)
    .eq("para_venda", true)
    .neq("id", veiculo.id)
    .or(`categoria.eq.${veiculo.categoria},marca.eq.${veiculo.marca}`)
    .limit(limit);
  return (data ?? []).map(mapRow);
}

export async function getLocacaoSimilares(
  veiculo: Veiculo,
  limit = 3
): Promise<Veiculo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("veiculos")
    .select("*")
    .eq("ativo", true)
    .eq("para_locacao", true)
    .neq("id", veiculo.id)
    .or(`categoria.eq.${veiculo.categoria},marca.eq.${veiculo.marca}`)
    .limit(limit);
  return (data ?? []).map(mapRow);
}
