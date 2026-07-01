import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  MessageCircle,
  CalendarClock,
  Fuel,
  Gauge,
  Cog,
  Palette,
  Car,
  DoorOpen,
  CheckCircle2,
  Tag,
  KeyRound,
} from "lucide-react";
import CardVeiculo from "@/components/CardVeiculo";
import ShareButton from "../../estoque/[slug]/ShareButton";
import Galeria from "../../estoque/[slug]/Galeria";
import { getVeiculoBySlug, getLocacaoSimilares } from "@/lib/veiculos";
import type { Veiculo } from "@/lib/types";
import { formatPreco, formatKm } from "@/lib/utils";
import { waLink, CONFIG } from "@/lib/config";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVeiculoBySlug(slug);
  if (!v || !v.paraLocacao)
    return { title: "Veículo não encontrado — SS Locadora" };

  const title = `${v.marca} ${v.modelo} ${v.versao} ${v.anoMod} — Locação | SS Veículos`;
  return {
    title,
    description:
      v.descricao ||
      `Alugue o ${v.marca} ${v.modelo} ${v.versao} na SS Veículos, Cacoal–RO. Diárias e planos mensais.`,
    openGraph: {
      title: `${v.marca} ${v.modelo} ${v.versao} — Locação`,
      images: v.fotos[0] ? [{ url: v.fotos[0], alt: `${v.marca} ${v.modelo}` }] : [],
      type: "website",
    },
  };
}

// Stream — não bloqueia a renderização do veículo.
async function SimilaresLocacao({ veiculo }: { veiculo: Veiculo }) {
  const similares = await getLocacaoSimilares(veiculo, 3);
  if (similares.length === 0) return null;
  return (
    <div>
      <h2 className="font-display text-3xl md:text-4xl text-c-text uppercase mb-6">
        Outros para locação
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {similares.map((s) => (
          <CardVeiculo key={s.id} v={s} modo="locacao" />
        ))}
      </div>
    </div>
  );
}

export default async function LocacaoPage({ params }: Props) {
  const { slug } = await params;
  const v = await getVeiculoBySlug(slug);
  if (!v || !v.paraLocacao) notFound();

  const waAlugar = waLink(
    `Olá! Tenho interesse em ALUGAR o ${v.marca} ${v.modelo} ${v.versao} (${v.anoMod}). Vi na locadora do site da SS Veículos. Pode me passar as condições?`
  );
  const waRetirada = waLink(
    `Olá! Gostaria de agendar a retirada/locação do ${v.marca} ${v.modelo} ${v.versao}.`
  );

  const specs = [
    { icon: Fuel,    label: "Combustível",  value: v.combustivel },
    { icon: Cog,     label: "Câmbio",        value: v.cambio },
    { icon: Gauge,   label: "Quilometragem", value: formatKm(v.km) },
    { icon: Palette, label: "Cor",           value: v.cor },
    { icon: Car,     label: "Categoria",     value: v.categoria },
    { icon: Tag,     label: "Condição",      value: v.condicao },
  ];
  if (v.portas > 0)
    specs.push({ icon: DoorOpen, label: "Portas", value: `${v.portas} portas` });

  const temPreco = v.precoDiaria || v.precoMensal;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-6 font-condensed">
        <Link
          href="/locadora"
          className="flex items-center gap-1 text-c-text3 hover:text-brand-red transition-colors uppercase tracking-wider text-xs"
        >
          <ArrowLeft size={13} /> Locadora
        </Link>
        <span className="text-c-border3">/</span>
        <span className="text-c-text2 uppercase tracking-wider text-xs truncate">
          {v.marca} {v.modelo}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 bg-brand-red text-white font-condensed font-bold uppercase tracking-widest text-sm px-3 py-1 rounded-md">
              <KeyRound size={12} /> Para locação
            </span>
          </div>
          <Galeria fotos={v.fotos} alt={`${v.marca} ${v.modelo} ${v.versao}`} />
        </div>

        <div className="flex flex-col">
          <span className="font-condensed text-xs text-c-text3 uppercase tracking-widest mb-1">
            {v.anoFab}/{v.anoMod} · {formatKm(v.km)}
          </span>

          <h1 className="font-display text-4xl md:text-5xl text-c-text leading-none uppercase mb-1">
            {v.marca} {v.modelo}
          </h1>
          <p className="font-condensed text-c-text2 text-base mb-6">{v.versao}</p>

          <div className="mb-6 flex flex-wrap items-end gap-x-8 gap-y-3">
            {v.precoDiaria ? (
              <div>
                <p className="font-condensed text-xs uppercase tracking-widest text-c-text3 mb-0.5">
                  Diária
                </p>
                <p className="font-display text-5xl text-brand-red leading-none">
                  {formatPreco(v.precoDiaria)}
                  <span className="font-condensed text-lg text-c-text3">/dia</span>
                </p>
              </div>
            ) : null}
            {v.precoMensal ? (
              <div>
                <p className="font-condensed text-xs uppercase tracking-widest text-c-text3 mb-0.5">
                  Mensal
                </p>
                <p
                  className={`leading-none ${
                    v.precoDiaria
                      ? "font-display text-3xl text-c-text"
                      : "font-display text-5xl text-brand-red"
                  }`}
                >
                  {formatPreco(v.precoMensal)}
                  <span className="font-condensed text-lg text-c-text3">/mês</span>
                </p>
              </div>
            ) : null}
            {!temPreco && (
              <p className="font-display text-4xl text-brand-red leading-none uppercase">
                Valores sob consulta
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {specs.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 bg-c-surface2 rounded-lg px-3 py-2.5"
              >
                <s.icon size={13} className="text-brand-red shrink-0" />
                <div>
                  <p className="font-condensed text-[0.72rem] uppercase tracking-widest text-c-text3">
                    {s.label}
                  </p>
                  <p className="font-condensed font-semibold text-xs text-c-text uppercase">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <a
              href={waAlugar}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#1DA851] hover:bg-[#17923f] text-white font-condensed font-bold uppercase tracking-widest py-4 text-sm rounded-lg transition-colors"
            >
              <MessageCircle size={18} />
              Quero alugar — WhatsApp
            </a>
            <a
              href={waRetirada}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-c-border hover:border-brand-red text-c-text font-condensed font-semibold uppercase tracking-widest py-3 text-sm rounded-lg transition-colors"
            >
              <CalendarClock size={16} className="text-brand-red" />
              Agendar retirada
            </a>
            <a
              href={CONFIG.phone.href}
              className="flex items-center justify-center gap-2 border border-c-border hover:border-c-border3 text-c-text2 hover:text-c-text font-condensed font-semibold uppercase tracking-widest py-3 text-sm rounded-lg transition-colors"
            >
              Ligar: {CONFIG.phone.display}
            </a>
          </div>

          <ShareButton title={`${v.marca} ${v.modelo} — Locação`} />
        </div>
      </div>

      {(v.descricao || v.opcionais.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {v.descricao && (
            <div className="bg-c-surface rounded-2xl shadow-card p-6">
              <h2 className="font-condensed font-bold uppercase tracking-widest text-sm text-c-text mb-4">
                Descrição
              </h2>
              <p className="font-sans text-base text-c-text2 leading-relaxed whitespace-pre-line">
                {v.descricao}
              </p>
            </div>
          )}
          {v.opcionais.length > 0 && (
            <div className="bg-c-surface rounded-2xl shadow-card p-6">
              <h2 className="font-condensed font-bold uppercase tracking-widest text-sm text-c-text mb-4">
                Opcionais e Acessórios
              </h2>
              <ul className="grid grid-cols-1 gap-2">
                {v.opcionais.map((op) => (
                  <li key={op} className="flex items-center gap-2 font-sans text-sm text-c-text2">
                    <CheckCircle2 size={13} className="text-brand-red shrink-0" />
                    {op}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <Suspense
        fallback={
          <div>
            <div className="h-9 w-64 bg-c-surface2 rounded-lg animate-pulse mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-c-surface2 rounded-2xl aspect-[4/5] animate-pulse" />
              ))}
            </div>
          </div>
        }
      >
        <SimilaresLocacao veiculo={v} />
      </Suspense>
    </div>
  );
}
