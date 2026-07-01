"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Veiculo } from "@/lib/types";

export type SortKey = "recent" | "price_asc" | "price_desc" | "year_desc" | "km_asc";

export interface FiltroConfig {
  campos: (keyof FiltrosBase)[];
  sortOptions: { value: SortKey; label: string }[];
  valorOrdenacao: (v: Veiculo) => number;
}

export interface FiltrosBase {
  categoria: string;
  condicao: string;
  marca: string;
  modelo: string;
  anoMin: string;
  anoMax: string;
  combustivel: string;
  cambio: string;
  cor: string;
  precoMax: string;
  kmMax: string;
  mensalMax: string;
  portas: string;
}

const FILTROS_VAZIOS: FiltrosBase = {
  categoria: "", condicao: "", marca: "", modelo: "",
  anoMin: "", anoMax: "", combustivel: "", cambio: "",
  cor: "", precoMax: "", kmMax: "", mensalMax: "", portas: "",
};

const ANO_ATUAL = new Date().getFullYear();
export const ANOS = Array.from({ length: ANO_ATUAL - 1999 }, (_, i) => ANO_ATUAL - i);

function filtrarVeiculos(veiculos: Veiculo[], filtros: FiltrosBase, campos: (keyof FiltrosBase)[], valorOrd: (v: Veiculo) => number): Veiculo[] {
  return veiculos.filter((v) => {
    if (campos.includes("categoria")   && filtros.categoria   && v.categoria   !== filtros.categoria)           return false;
    if (campos.includes("condicao")    && filtros.condicao    && v.condicao    !== filtros.condicao)            return false;
    if (campos.includes("marca")       && filtros.marca       && v.marca       !== filtros.marca)               return false;
    if (campos.includes("modelo")      && filtros.modelo      && v.modelo      !== filtros.modelo)              return false;
    if (campos.includes("anoMin")      && filtros.anoMin      && v.anoMod < Number(filtros.anoMin))             return false;
    if (campos.includes("anoMax")      && filtros.anoMax      && v.anoMod > Number(filtros.anoMax))             return false;
    if (campos.includes("combustivel") && filtros.combustivel && v.combustivel !== filtros.combustivel)         return false;
    if (campos.includes("cambio")      && filtros.cambio      && v.cambio      !== filtros.cambio)              return false;
    if (campos.includes("cor")         && filtros.cor         && v.cor         !== filtros.cor)                 return false;
    if (campos.includes("precoMax")    && filtros.precoMax    && (v.preco ?? 0) > Number(filtros.precoMax))    return false;
    if (campos.includes("kmMax")       && filtros.kmMax       && v.km > Number(filtros.kmMax))                 return false;
    if (campos.includes("mensalMax")   && filtros.mensalMax   && valorOrd(v) > Number(filtros.mensalMax))      return false;
    if (campos.includes("portas")      && filtros.portas      && v.portas !== Number(filtros.portas))          return false;
    return true;
  });
}

export function useFiltrosVeiculos(veiculos: Veiculo[], config: FiltroConfig) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { campos, sortOptions, valorOrdenacao } = config;

  const sortKeys = sortOptions.map((o) => o.value);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [sort, setSort] = useState<SortKey>(() => {
    const s = searchParams.get("sort") as SortKey | null;
    return s && sortKeys.includes(s) ? s : "recent";
  });

  const filtrosIniciais = useMemo(() => {
    const init = { ...FILTROS_VAZIOS };
    (Object.keys(FILTROS_VAZIOS) as (keyof FiltrosBase)[]).forEach((k) => {
      init[k] = searchParams.get(k) || "";
    });
    return init;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [filtros, setFiltros] = useState<FiltrosBase>(filtrosIniciais);

  useEffect(() => {
    const params = new URLSearchParams();
    (Object.keys(filtros) as (keyof FiltrosBase)[]).forEach((k) => {
      if (filtros[k]) params.set(k, filtros[k]);
    });
    if (sort !== "recent") params.set("sort", sort);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [filtros, sort, pathname, router]);

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filtersOpen]);

  const set = (key: keyof FiltrosBase, val: string) =>
    setFiltros((f) => ({ ...f, [key]: val }));

  const setMarca = (val: string) =>
    setFiltros((f) => ({ ...f, marca: val, modelo: "" }));

  const limpar = () => setFiltros({ ...FILTROS_VAZIOS });

  const modelosDaMarca = useMemo(() => {
    if (!filtros.marca) return [];
    return [...new Set(veiculos.filter((v) => v.marca === filtros.marca).map((v) => v.modelo))].sort();
  }, [filtros.marca, veiculos]);

  const resultado = useMemo(() => {
    const filtered = filtrarVeiculos(veiculos, filtros, campos, valorOrdenacao);
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "price_asc":  return valorOrdenacao(a) - valorOrdenacao(b);
        case "price_desc": return valorOrdenacao(b) - valorOrdenacao(a);
        case "year_desc":  return b.anoMod - a.anoMod;
        case "km_asc":     return a.km - b.km;
        default:           return 0;
      }
    });
  }, [filtros, sort, veiculos, campos, valorOrdenacao]);

  const ativosCount = (Object.keys(filtros) as (keyof FiltrosBase)[])
    .filter((k) => campos.includes(k) && filtros[k]).length;

  return {
    filtros, set, setMarca, limpar,
    sort, setSort,
    filtersOpen, setFiltersOpen,
    modelosDaMarca,
    resultado,
    ativosCount,
    sortOptions,
    ANOS,
  };
}
