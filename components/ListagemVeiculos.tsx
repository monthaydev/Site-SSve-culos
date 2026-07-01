"use client";

import { SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import CardVeiculo from "@/components/CardVeiculo";
import SelectFiltro, { inputCls } from "@/components/filtros/SelectFiltro";
import { useFiltrosVeiculos, type FiltroConfig } from "@/lib/hooks/useFiltrosVeiculos";
import { formatPreco, formatKm } from "@/lib/utils";
import type { Veiculo } from "@/lib/types";

interface Props {
  veiculos: Veiculo[];
  marcas: string[];
  cores: string[];
  modo: "venda" | "locacao";
  config: FiltroConfig;
  cabecalho: React.ReactNode;
  emptyMsg?: string;
}

export default function ListagemVeiculos({
  veiculos, marcas, cores, modo, config, cabecalho, emptyMsg,
}: Props) {
  const {
    filtros, set, setMarca, limpar,
    sort, setSort,
    filtersOpen, setFiltersOpen,
    modelosDaMarca, resultado, ativosCount, sortOptions, ANOS,
  } = useFiltrosVeiculos(veiculos, config);

  const chipLabel = (k: keyof typeof filtros, val: string): string => {
    switch (k) {
      case "precoMax":  return "Até " + formatPreco(Number(val));
      case "kmMax":     return "Até " + formatKm(Number(val));
      case "mensalMax": return "Até " + formatPreco(Number(val)) + "/mês";
      case "anoMin":    return "De " + val;
      case "anoMax":    return "Até " + val;
      case "portas":    return val + " portas";
      default:          return val;
    }
  };

  const filtrosJSX = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-condensed font-bold uppercase tracking-widest text-sm text-c-text">
          Filtros
        </h2>
        {ativosCount > 0 && (
          <button
            onClick={limpar}
            className="flex items-center gap-1 font-condensed text-xs text-brand-red hover:text-c-text transition-colors uppercase tracking-wider"
          >
            <X size={12} /> Limpar ({ativosCount})
          </button>
        )}
      </div>

      {config.campos.includes("categoria") && (
        <SelectFiltro
          label="Categoria"
          value={filtros.categoria}
          onChange={(val) => set("categoria", val)}
          options={["Carro", "Caminhão", "Utilitário", "Van"].map((v) => ({ value: v, label: v }))}
        />
      )}

      {config.campos.includes("condicao") && (
        <SelectFiltro
          label="Condição"
          value={filtros.condicao}
          onChange={(val) => set("condicao", val)}
          options={["Novo", "Seminovo", "Usado"].map((v) => ({ value: v, label: v }))}
        />
      )}

      <div className="flex flex-col gap-1">
        <label className="font-condensed text-xs uppercase tracking-widest text-c-text3">Marca</label>
        <select
          value={filtros.marca}
          onChange={(e) => setMarca(e.target.value)}
          className={inputCls}
        >
          <option value="">Todas</option>
          {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <SelectFiltro
        label="Modelo"
        value={filtros.modelo}
        onChange={(val) => set("modelo", val)}
        disabled={!filtros.marca || modelosDaMarca.length === 0}
        options={modelosDaMarca.map((m) => ({ value: m, label: m }))}
      />

      <div className="flex flex-col gap-1">
        <label className="font-condensed text-xs uppercase tracking-widest text-c-text3">Ano (de / até)</label>
        <div className="flex gap-2">
          <select value={filtros.anoMin} onChange={(e) => set("anoMin", e.target.value)} className={inputCls}>
            <option value="">De</option>
            {ANOS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filtros.anoMax} onChange={(e) => set("anoMax", e.target.value)} className={inputCls}>
            <option value="">Até</option>
            {ANOS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <SelectFiltro
        label="Combustível"
        value={filtros.combustivel}
        onChange={(val) => set("combustivel", val)}
        options={["Flex", "Gasolina", "Diesel", "Elétrico", "Híbrido"].map((v) => ({ value: v, label: v }))}
      />

      <SelectFiltro
        label="Câmbio"
        value={filtros.cambio}
        onChange={(val) => set("cambio", val)}
        options={["Manual", "Automático", "CVT", "Automatizado"].map((v) => ({ value: v, label: v }))}
      />

      <SelectFiltro
        label="Cor"
        value={filtros.cor}
        onChange={(val) => set("cor", val)}
        options={cores.map((c) => ({ value: c, label: c }))}
      />

      {config.campos.includes("precoMax") && (
        <SelectFiltro
          label="Preço máximo"
          value={filtros.precoMax}
          onChange={(val) => set("precoMax", val)}
          options={[50000, 80000, 120000, 180000, 250000, 350000].map((v) => ({
            value: String(v),
            label: formatPreco(v),
          }))}
        />
      )}

      {config.campos.includes("kmMax") && (
        <SelectFiltro
          label="KM máximo"
          value={filtros.kmMax}
          onChange={(val) => set("kmMax", val)}
          options={[20000, 50000, 80000, 120000, 200000].map((v) => ({
            value: String(v),
            label: formatKm(v),
          }))}
        />
      )}

      {config.campos.includes("mensalMax") && (
        <SelectFiltro
          label="Valor mensal até"
          value={filtros.mensalMax}
          onChange={(val) => set("mensalMax", val)}
          options={[2000, 3000, 4500, 6000, 8000, 12000].map((v) => ({
            value: String(v),
            label: formatPreco(v),
          }))}
        />
      )}

      <SelectFiltro
        label="Nº de Portas"
        value={filtros.portas}
        onChange={(val) => set("portas", val)}
        options={[2, 4, 5].map((v) => ({ value: String(v), label: String(v) + " portas" }))}
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-end justify-between gap-4">
          <div>{cabecalho}</div>
          <span className="font-condensed text-sm text-c-text3 tabular-nums shrink-0 pb-1">
            {resultado.length} veículo{resultado.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-20">{filtrosJSX}</div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-c-border hover:border-brand-red text-c-text font-condensed font-semibold uppercase tracking-wider text-sm px-4 py-2.5 rounded-lg transition-colors"
            >
              <SlidersHorizontal size={14} className="text-brand-red" />
              Filtros {ativosCount > 0 && `(${ativosCount})`}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <ArrowUpDown size={13} className="text-c-text3 shrink-0" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="bg-c-surface border border-c-border text-c-text font-sans text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {ativosCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {(Object.keys(filtros) as (keyof typeof filtros)[])
                .filter((k) => config.campos.includes(k) && filtros[k])
                .map((k) => (
                  <button
                    key={k}
                    onClick={() => set(k, "")}
                    className="flex items-center gap-1 bg-c-surface2 border border-c-border rounded-full px-3 py-1 font-condensed text-sm uppercase tracking-wider text-c-text2 hover:border-brand-red hover:text-brand-red transition-colors"
                  >
                    {chipLabel(k, filtros[k])}
                    <X size={11} />
                  </button>
                ))}
              <button
                onClick={limpar}
                className="font-condensed text-sm text-brand-red hover:text-c-text uppercase tracking-wider"
              >
                Limpar tudo
              </button>
            </div>
          )}

          {resultado.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-display text-3xl text-c-border3 uppercase mb-3">Nenhum veículo</p>
              <p className="font-sans text-sm text-c-text3 mb-6">
                {ativosCount > 0 ? "Tente remover alguns filtros." : (emptyMsg ?? "Em breve novos veículos.")}
              </p>
              {ativosCount > 0 && (
                <button
                  onClick={limpar}
                  className="border border-c-border3 hover:border-brand-red text-c-text font-condensed font-semibold uppercase tracking-wider text-sm px-6 py-3 rounded-lg transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {resultado.map((v) => (
                <CardVeiculo key={v.id} v={v} modo={modo} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <button
            aria-label="Fechar filtros"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-black/60 anim-fade"
          />
          <div className="relative ml-auto w-[85%] max-w-sm h-full bg-c-surface border-l border-c-border shadow-2xl flex flex-col anim-drawer">
            <div className="flex items-center justify-between px-4 py-4 border-b border-c-border shrink-0">
              <span className="font-condensed font-bold uppercase tracking-widest text-sm text-c-text">
                Filtros {ativosCount > 0 && `(${ativosCount})`}
              </span>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-1.5 text-c-text2 hover:text-brand-red transition-colors"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">{filtrosJSX}</div>

            <div className="flex gap-2 px-4 py-4 border-t border-c-border shrink-0">
              <button
                onClick={limpar}
                className="flex-1 border border-c-border3 hover:border-brand-red text-c-text font-condensed font-semibold uppercase tracking-wider text-sm py-3 rounded-lg transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex-[2] bg-brand-red hover:bg-brand-red-hover text-white font-condensed font-bold uppercase tracking-widest text-sm py-3 rounded-lg transition-colors"
              >
                Ver {resultado.length} veículo{resultado.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
