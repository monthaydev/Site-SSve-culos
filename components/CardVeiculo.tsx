import Image from "next/image";
import Link from "next/link";
import { Fuel, Gauge, Cog, ArrowRight, Car } from "lucide-react";
import Badge from "./Badge";
import { Veiculo } from "@/lib/types";
import { formatPreco, formatKm } from "@/lib/utils";

export default function CardVeiculo({
  v,
  modo = "venda",
}: {
  v: Veiculo;
  modo?: "venda" | "locacao";
}) {
  const href = modo === "locacao" ? `/locadora/${v.slug}` : `/estoque/${v.slug}`;
  return (
    <Link
      href={href}
      aria-label={`Ver detalhes do ${v.marca} ${v.modelo} ${v.versao} ${v.anoMod}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-c-surface shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Imagem — dimensão reservada (sem CLS) */}
      <div className="relative aspect-[4/3] overflow-hidden bg-c-surface2">
        {v.fotos[0] ? (
          <Image
            src={v.fotos[0]}
            alt={`${v.marca} ${v.modelo} ${v.versao}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Car size={36} className="text-c-border3" />
            <span className="font-condensed text-xs uppercase tracking-widest text-c-text3">
              Sem foto
            </span>
          </div>
        )}

        {v.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge status={v.badge} />
          </div>
        )}

        {v.fotos.length > 1 && (
          <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/55 backdrop-blur-sm px-1.5 py-0.5">
            <span className="font-condensed text-xs text-white/90">
              {v.fotos.length} fotos
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-condensed text-sm text-c-text3 uppercase tracking-wider tabular-nums">
            {v.anoFab}/{v.anoMod}
          </span>
          <span className="flex items-center gap-1 font-condensed text-sm text-c-text3 uppercase tracking-wider tabular-nums">
            <Gauge size={11} />
            {formatKm(v.km)}
          </span>
        </div>

        <h3 className="font-condensed font-bold text-xl text-c-text leading-tight">
          {v.marca} {v.modelo}
        </h3>
        {v.versao && (
          <p className="font-sans text-sm text-c-text3 mt-0.5 mb-3 line-clamp-1">
            {v.versao}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {[
            { Icon: Fuel, label: v.combustivel },
            { Icon: Cog, label: v.cambio },
          ].map(({ Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1 font-condensed text-xs uppercase tracking-wider text-c-text2 bg-c-surface2 rounded-md px-2 py-0.5"
            >
              <Icon size={9} className="text-brand-red" />
              {label}
            </span>
          ))}
          <span className="font-condensed text-xs uppercase tracking-wider text-c-text2 bg-c-surface2 rounded-md px-2 py-0.5">
            {v.cor}
          </span>
        </div>

        <div className="mt-auto">
          {modo === "locacao" ? (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              {v.precoDiaria ? (
                <p className="font-display text-[1.75rem] text-brand-red leading-none tabular-nums">
                  {formatPreco(v.precoDiaria)}
                  <span className="font-condensed text-sm text-c-text3">/dia</span>
                </p>
              ) : null}
              {v.precoMensal ? (
                <p
                  className={`tabular-nums leading-none ${
                    v.precoDiaria
                      ? "font-condensed text-sm text-c-text2"
                      : "font-display text-[1.75rem] text-brand-red"
                  }`}
                >
                  {formatPreco(v.precoMensal)}
                  <span className="font-condensed text-sm text-c-text3">/mês</span>
                </p>
              ) : null}
              {!v.precoDiaria && !v.precoMensal && (
                <p className="font-display text-[1.5rem] text-brand-red leading-none uppercase">
                  Sob consulta
                </p>
              )}
            </div>
          ) : (
            <>
              {v.precoAnterior && (
                <p className="font-condensed text-xs text-c-text4 line-through mb-0.5 tabular-nums">
                  {formatPreco(v.precoAnterior)}
                </p>
              )}
              <p className="font-display text-[1.75rem] text-brand-red leading-none tabular-nums">
                {v.preco != null ? formatPreco(v.preco) : "Sob consulta"}
              </p>
            </>
          )}
        </div>

        {/* CTA único — afordância visual (o card todo é o link) */}
        <div className="mt-5 flex items-center justify-between">
          <span className="font-condensed font-bold text-xs uppercase tracking-widest text-c-text2 group-hover:text-brand-red transition-colors">
            {modo === "locacao" ? "Ver e alugar" : "Ver detalhes"}
          </span>
          <ArrowRight
            size={15}
            className="text-c-text3 group-hover:text-brand-red group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </div>
    </Link>
  );
}
