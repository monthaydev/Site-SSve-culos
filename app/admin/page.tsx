import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Car,
  TrendingUp,
  Tag,
  EyeOff,
  ExternalLink,
  DollarSign,
  LayoutGrid,
  Plus,
} from "lucide-react";

export const metadata = { title: "Dashboard — Admin SS Veículos" };

const BADGE_COLOR: Record<string, string> = {
  destaque: "bg-yellow-500/20 text-yellow-600",
  novo: "bg-blue-500/20 text-blue-600",
  oferta: "bg-green-500/20 text-green-600",
  reservado: "bg-brand-red/20 text-brand-red",
};

const BADGE_LABEL: Record<string, string> = {
  destaque: "Destaque",
  novo: "Novo",
  oferta: "Oferta",
  reservado: "Reservado",
};

const CAT_LABEL: Record<string, string> = {
  Carro: "Carros",
  "Caminhão": "Caminhões",
  "Utilitário": "Utilitários",
  Van: "Vans",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: total },
    { count: ativos },
    { count: destaques },
    { count: ocultos },
    { data: recentes },
    { data: estoqueAtivo },
  ] = await Promise.all([
    supabase.from("veiculos").select("*", { count: "exact", head: true }),
    supabase
      .from("veiculos")
      .select("*", { count: "exact", head: true })
      .eq("ativo", true),
    supabase
      .from("veiculos")
      .select("*", { count: "exact", head: true })
      .not("badge", "is", null)
      .eq("ativo", true),
    supabase
      .from("veiculos")
      .select("*", { count: "exact", head: true })
      .eq("ativo", false),
    supabase
      .from("veiculos")
      .select("id,marca,modelo,versao,preco,badge,ativo,categoria,fotos")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("veiculos").select("preco,categoria").eq("ativo", true).limit(1000),
  ]);

  const valorTotal =
    estoqueAtivo?.reduce((acc, v) => acc + (v.preco ?? 0), 0) ?? 0;

  const porCategoria = (estoqueAtivo ?? []).reduce<Record<string, number>>(
    (acc, v) => {
      if (v.categoria) acc[v.categoria] = (acc[v.categoria] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const kpis = [
    {
      label: "Total no estoque",
      value: total ?? 0,
      icon: Car,
      accent: "text-c-text",
      ring: "border-c-border",
      dot: "bg-c-border3",
    },
    {
      label: "Ativos no site",
      value: ativos ?? 0,
      icon: TrendingUp,
      accent: "text-green-600",
      ring: "border-green-500/20",
      dot: "bg-green-500",
    },
    {
      label: "Ocultos",
      value: ocultos ?? 0,
      icon: EyeOff,
      accent: "text-yellow-600",
      ring: "border-yellow-500/20",
      dot: "bg-yellow-500",
    },
    {
      label: "Com badge",
      value: destaques ?? 0,
      icon: Tag,
      accent: "text-brand-red",
      ring: "border-brand-red/20",
      dot: "bg-brand-red",
    },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-brand-red text-xs uppercase tracking-widest font-bold mb-1">
            Painel
          </p>
          <h1 className="text-c-text text-2xl font-bold uppercase tracking-wide">
            Dashboard
          </h1>
        </div>
        <Link
          href="/estoque"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 border border-c-border rounded-lg text-c-text3 hover:text-c-text hover:border-c-border3 text-xs font-bold uppercase tracking-widest px-3 py-2.5 transition-colors"
        >
          <ExternalLink size={12} />
          Ver site
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="bg-c-surface rounded-xl shadow-card p-5 flex flex-col gap-4"
          >
            <k.icon size={18} className={k.accent} />
            <div>
              <p className="text-4xl font-black text-c-text leading-none tabular-nums">
                {k.value}
              </p>
              <p className="text-c-text3 text-xs mt-2 leading-tight">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-c-surface rounded-xl shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={14} className="text-green-600" />
            <p className="text-c-text3 text-xs uppercase tracking-widest font-bold">
              Valor total em estoque
            </p>
          </div>
          <p className="text-3xl font-black text-c-text tabular-nums">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            }).format(valorTotal)}
          </p>
          <p className="text-c-text4 text-xs mt-2">
            {ativos ?? 0} veículo{(ativos ?? 0) !== 1 ? "s" : ""} ativo
            {(ativos ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-c-surface rounded-xl shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid size={14} className="text-brand-red" />
            <p className="text-c-text3 text-xs uppercase tracking-widest font-bold">
              Por categoria
            </p>
          </div>
          {Object.keys(porCategoria).length === 0 ? (
            <p className="text-c-text4 text-sm">Nenhum veículo ativo cadastrado.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(porCategoria)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, qtd]) => (
                  <div
                    key={cat}
                    className="flex items-center gap-2 bg-c-surface2 rounded-lg px-3 py-2"
                  >
                    <span className="text-c-text text-sm font-black tabular-nums">
                      {qtd}
                    </span>
                    <span className="text-c-text3 text-xs">
                      {CAT_LABEL[cat] ?? cat}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-c-text font-bold uppercase tracking-wide text-sm">
            Cadastrados recentemente
          </h2>
          <Link
            href="/admin/veiculos"
            className="text-brand-red text-xs hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        {!recentes || recentes.length === 0 ? (
          <div className="bg-c-surface rounded-xl shadow-card p-12 text-center">
            <p className="text-c-text3 text-sm">
              Nenhum veículo cadastrado ainda.
            </p>
            <Link
              href="/admin/veiculos/novo"
              className="inline-flex items-center gap-2 mt-4 border border-brand-red text-brand-red hover:bg-brand-red hover:text-white text-xs font-bold uppercase tracking-widest px-4 py-2 transition-colors"
            >
              <Plus size={12} /> Cadastrar primeiro veículo
            </Link>
          </div>
        ) : (
          <div className="bg-c-surface rounded-xl shadow-card divide-y divide-c-border2 overflow-hidden">
            {recentes.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between px-5 py-3 gap-4 hover:bg-c-bg-alt transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {v.fotos?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.fotos[0]}
                      alt=""
                      loading="lazy"
                      className="w-10 h-7 object-cover shrink-0 bg-c-border"
                    />
                  ) : (
                    <div className="w-10 h-7 bg-c-border shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-c-text text-sm font-medium truncate">
                      {v.marca} {v.modelo}
                      {v.versao ? (
                        <span className="text-c-text3 font-normal">
                          {" "}
                          — {v.versao}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-c-text3 text-xs flex items-center gap-1.5 flex-wrap">
                      <span>
                        {v.preco != null
                          ? new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              maximumFractionDigits: 0,
                            }).format(v.preco)
                          : "Locação"}
                      </span>
                      <span>·</span>
                      <span>{v.categoria}</span>
                      {v.badge && (
                        <>
                          <span>·</span>
                          <span
                            className={`text-xs font-bold uppercase px-1.5 py-0.5 rounded-sm ${BADGE_COLOR[v.badge] ?? ""}`}
                          >
                            {BADGE_LABEL[v.badge]}
                          </span>
                        </>
                      )}
                      {!v.ativo && (
                        <span className="text-yellow-500">· oculto</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${v.ativo ? "bg-green-500" : "bg-c-border3"}`}
                  />
                  <Link
                    href={`/admin/veiculos/${v.id}/editar`}
                    className="text-c-text3 hover:text-brand-red text-xs transition-colors"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
