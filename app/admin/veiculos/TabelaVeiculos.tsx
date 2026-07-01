"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pencil, Eye, EyeOff, Search, X } from "lucide-react";
import { toggleAtivoAction } from "./actions";
import BotaoExcluir from "./BotaoExcluir";

interface Veiculo {
  id: string;
  slug: string;
  marca: string;
  modelo: string;
  versao: string | null;
  ano_mod: number;
  preco: number | null;
  badge: string | null;
  ativo: boolean;
  categoria: string | null;
  fotos: string[] | null;
  para_venda: boolean;
  para_locacao: boolean;
  preco_diaria: number | null;
  preco_mensal: number | null;
}

const BADGE_LABEL: Record<string, string> = {
  destaque: "Destaque",
  novo: "Novo",
  oferta: "Oferta",
  reservado: "Reservado",
};

const BADGE_COLOR: Record<string, string> = {
  destaque: "bg-yellow-500/20 text-yellow-600",
  novo: "bg-blue-500/20 text-blue-600",
  oferta: "bg-green-500/20 text-green-600",
  reservado: "bg-brand-red/20 text-brand-red",
};

const BRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(v);

// Texto do preço na tabela: venda usa preço de venda; só-locação mostra a locação
const precoLabel = (v: Veiculo): string => {
  if (v.para_venda && v.preco != null) return BRL(v.preco);
  if (v.para_locacao && v.preco_diaria != null) return `${BRL(v.preco_diaria)}/dia`;
  if (v.para_locacao && v.preco_mensal != null) return `${BRL(v.preco_mensal)}/mês`;
  return "—";
};

const CATS = ["Carro", "Caminhão", "Utilitário", "Van"] as const;
type StatusFiltro = "" | "ativo" | "oculto";
type DispFiltro = "" | "venda" | "locacao";

function DispTags({ v }: { v: Veiculo }) {
  return (
    <div className="flex flex-wrap gap-1">
      {v.para_venda && (
        <span className="text-[0.72rem] font-black uppercase px-1.5 py-0.5 bg-blue-500/15 text-blue-600">
          Venda
        </span>
      )}
      {v.para_locacao && (
        <span className="text-[0.72rem] font-black uppercase px-1.5 py-0.5 bg-brand-red/15 text-brand-red">
          Locação
        </span>
      )}
      {!v.para_venda && !v.para_locacao && (
        <span className="text-c-text4 text-xs">—</span>
      )}
    </div>
  );
}

export default function TabelaVeiculos({ veiculos }: { veiculos: Veiculo[] }) {
  const [busca, setBusca] = useState("");
  const [catFiltro, setCatFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("");
  const [dispFiltro, setDispFiltro] = useState<DispFiltro>("");

  const filtrados = useMemo(() => {
    return veiculos.filter((v) => {
      if (catFiltro && v.categoria !== catFiltro) return false;
      if (statusFiltro === "ativo" && !v.ativo) return false;
      if (statusFiltro === "oculto" && v.ativo) return false;
      if (dispFiltro === "venda" && !v.para_venda) return false;
      if (dispFiltro === "locacao" && !v.para_locacao) return false;
      if (busca.trim()) {
        const q = busca.toLowerCase();
        return (
          v.marca.toLowerCase().includes(q) ||
          v.modelo.toLowerCase().includes(q) ||
          (v.versao ?? "").toLowerCase().includes(q) ||
          (v.categoria ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [veiculos, busca, catFiltro, statusFiltro, dispFiltro]);

  const filtrosAtivos = [busca, catFiltro, statusFiltro, dispFiltro].filter(Boolean).length;

  const limparTudo = () => {
    setBusca("");
    setCatFiltro("");
    setStatusFiltro("");
    setDispFiltro("");
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {(["", ...CATS] as const).map((c) => {
          const count = veiculos.filter((v) => (c ? v.categoria === c : true)).length;
          return (
            <button
              key={c}
              onClick={() => setCatFiltro(c)}
              className={`font-condensed text-sm font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors ${
                catFiltro === c
                  ? "bg-brand-red text-white"
                  : "border border-c-border text-c-text3 hover:border-c-border3 hover:text-c-text"
              }`}
            >
              {c || "Todos"} <span className="opacity-60">({count})</span>
            </button>
          );
        })}

        <div className="w-px h-4 bg-c-border mx-1 hidden sm:block" />

        {(
          [
            ["", "Todos"],
            ["ativo", "Ativos"],
            ["oculto", "Ocultos"],
          ] as [StatusFiltro, string][]
        ).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setStatusFiltro(val)}
            className={`font-condensed text-sm font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors ${
              statusFiltro === val
                ? val === "ativo"
                  ? "bg-green-500/20 text-green-600 border border-green-500/30"
                  : val === "oculto"
                    ? "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30"
                    : "bg-brand-red text-white"
                : "border border-c-border text-c-text3 hover:border-c-border3 hover:text-c-text"
            }`}
          >
            {label}
          </button>
        ))}

        <div className="w-px h-4 bg-c-border mx-1 hidden sm:block" />

        {(
          [
            ["", "Todos"],
            ["venda", "À venda"],
            ["locacao", "Locação"],
          ] as [DispFiltro, string][]
        ).map(([val, label]) => {
          const count =
            val === "venda"
              ? veiculos.filter((v) => v.para_venda).length
              : val === "locacao"
                ? veiculos.filter((v) => v.para_locacao).length
                : veiculos.length;
          return (
            <button
              key={val}
              onClick={() => setDispFiltro(val)}
              className={`font-condensed text-sm font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors ${
                dispFiltro === val
                  ? val === ""
                    ? "bg-brand-red text-white"
                    : "bg-brand-red/15 text-brand-red border border-brand-red/30"
                  : "border border-c-border text-c-text3 hover:border-c-border3 hover:text-c-text"
              }`}
            >
              {label} <span className="opacity-60">({count})</span>
            </button>
          );
        })}

        {filtrosAtivos > 0 && (
          <button
            onClick={limparTudo}
            className="ml-auto flex items-center gap-1 font-condensed text-sm text-brand-red hover:text-c-text transition-colors uppercase tracking-wider"
          >
            <X size={11} /> Limpar ({filtrosAtivos})
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-c-text4 pointer-events-none"
        />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por marca, modelo ou versão..."
          className="w-full bg-c-surface border border-c-border rounded-lg text-c-text pl-9 pr-9 py-2.5 text-sm outline-none focus:border-brand-red transition-colors placeholder:text-c-text4"
        />
        {busca && (
          <button
            type="button"
            onClick={() => setBusca("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-c-text4 hover:text-c-text transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <p className="text-c-text4 text-xs mb-3">
        {filtrados.length} veículo{filtrados.length !== 1 ? "s" : ""} encontrado{filtrados.length !== 1 ? "s" : ""}
      </p>

      {filtrados.length === 0 ? (
        <div className="bg-c-surface rounded-xl shadow-card p-12 text-center">
          <p className="text-c-text3 text-sm">Nenhum veículo encontrado.</p>
          <button
            type="button"
            onClick={limparTudo}
            className="mt-3 text-brand-red text-xs hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-c-surface rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-c-border">
                  {[
                    "Veículo",
                    "Categoria",
                    "Disponib.",
                    "Ano",
                    "Preço",
                    "Badge",
                    "Status",
                    "Ações",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-c-text3 text-sm uppercase tracking-widest font-bold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-c-border2">
                {filtrados.map((v) => (
                  <tr key={v.id} className="hover:bg-c-surface2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {v.fotos?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={v.fotos[0]}
                            alt=""
                            loading="lazy"
                            className="w-12 h-9 object-cover shrink-0 bg-c-border"
                          />
                        ) : (
                          <div className="w-12 h-9 bg-c-surface2 shrink-0 flex items-center justify-center border border-c-border">
                            <span className="text-c-text4 text-[0.72rem] font-bold uppercase">
                              foto
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-c-text font-medium">
                            {v.marca} {v.modelo}
                          </p>
                          <p className="text-c-text3 text-xs">{v.versao}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-c-text3 text-xs">
                      {v.categoria ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <DispTags v={v} />
                    </td>
                    <td className="px-4 py-3 text-c-text3 text-xs tabular-nums">
                      {v.ano_mod}
                    </td>
                    <td className="px-4 py-3 text-c-text text-xs font-bold tabular-nums">
                      {precoLabel(v)}
                    </td>
                    <td className="px-4 py-3">
                      {v.badge ? (
                        <span
                          className={`text-xs font-black uppercase px-2 py-0.5 ${BADGE_COLOR[v.badge] ?? ""}`}
                        >
                          {BADGE_LABEL[v.badge]}
                        </span>
                      ) : (
                        <span className="text-c-text4 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-black uppercase px-2 py-0.5 ${
                          v.ativo
                            ? "bg-green-500/15 text-green-600"
                            : "bg-c-surface2 text-c-text3"
                        }`}
                      >
                        {v.ativo ? "Ativo" : "Oculto"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        <Link
                          href={`/admin/veiculos/${v.id}/editar`}
                          className="p-1.5 text-c-text3 hover:text-c-text transition-colors rounded-sm hover:bg-c-border"
                          title="Editar"
                        >
                          <Pencil size={13} />
                        </Link>
                        <form action={toggleAtivoAction.bind(null, v.id, v.ativo)}>
                          <button
                            type="submit"
                            className="p-1.5 text-c-text3 hover:text-yellow-600 transition-colors rounded-sm hover:bg-c-border"
                            title={v.ativo ? "Ocultar do site" : "Publicar no site"}
                          >
                            {v.ativo ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </form>
                        <BotaoExcluir id={v.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-2">
            {filtrados.map((v) => (
              <div
                key={v.id}
                className="bg-c-surface rounded-xl shadow-card p-4 flex gap-3"
              >
                {v.fotos?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={v.fotos[0]}
                    alt=""
                    loading="lazy"
                    className="w-20 h-14 object-cover shrink-0 bg-c-border"
                  />
                ) : (
                  <div className="w-20 h-14 bg-c-surface2 shrink-0 border border-c-border flex items-center justify-center">
                    <span className="text-c-text4 text-[0.72rem] font-bold uppercase">
                      sem foto
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-c-text text-sm font-medium truncate">
                      {v.marca} {v.modelo}
                    </p>
                    <span
                      className={`text-[0.72rem] font-black uppercase px-1.5 py-0.5 shrink-0 ${
                        v.ativo
                          ? "bg-green-500/15 text-green-600"
                          : "bg-c-surface2 text-c-text3"
                      }`}
                    >
                      {v.ativo ? "Ativo" : "Oculto"}
                    </span>
                  </div>
                  <p className="text-c-text3 text-xs truncate">
                    {v.versao} · {v.ano_mod} · {v.categoria}
                  </p>
                  <div className="mt-1">
                    <DispTags v={v} />
                  </div>
                  <p className="text-c-text text-sm font-black mt-1 tabular-nums">
                    {precoLabel(v)}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Link
                      href={`/admin/veiculos/${v.id}/editar`}
                      className="text-brand-red text-xs hover:underline"
                    >
                      Editar
                    </Link>
                    <form action={toggleAtivoAction.bind(null, v.id, v.ativo)}>
                      <button
                        type="submit"
                        className="text-c-text3 text-xs hover:text-yellow-600 transition-colors"
                      >
                        {v.ativo ? "Ocultar" : "Publicar"}
                      </button>
                    </form>
                    <BotaoExcluir id={v.id} label />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
