import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  MessageCircle,
  Calendar,
  Fuel,
  Gauge,
  Cog,
  Palette,
  Car,
  DoorOpen,
  CheckCircle2,
  Tag,
} from "lucide-react";
import Badge from "@/components/Badge";
import CardVeiculo from "@/components/CardVeiculo";
import ShareButton from "./ShareButton";
import Galeria from "./Galeria";
import { getVeiculoBySlug, getVeiculosSimilares } from "@/lib/veiculos";
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
  if (!v) return { title: "Veículo não encontrado — SS Veículos" };

  const precoTxt = v.preco != null ? formatPreco(v.preco) : "Sob consulta";
  const title = `${v.marca} ${v.modelo} ${v.versao} ${v.anoMod} — SS Veículos`;
  const desc =
    v.descricao ||
    `${v.marca} ${v.modelo} ${v.versao}, ano ${v.anoMod}, ${formatKm(v.km)}, ${v.combustivel}, câmbio ${v.cambio}. Disponível na SS Veículos em Cacoal-RO. ${precoTxt}.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `/estoque/${slug}`,
    },
    openGraph: {
      title: `${v.marca} ${v.modelo} ${v.versao}`,
      description: `${precoTxt} · ${v.anoMod} · ${formatKm(v.km)} — SS Veículos Cacoal`,
      images: v.fotos[0] ? [{ url: v.fotos[0], alt: `${v.marca} ${v.modelo}` }] : [],
      type: "website",
    },
  };
}

// Carregado em paralelo/stream — não bloqueia a renderização do veículo.
async function Similares({ veiculo }: { veiculo: Veiculo }) {
  const similares = await getVeiculosSimilares(veiculo, 3);
  if (similares.length === 0) return null;
  return (
    <div>
      <h2 className="font-display text-3xl md:text-4xl text-c-text uppercase mb-6">
        Você também pode gostar
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {similares.map((s) => (
          <CardVeiculo key={s.id} v={s} />
        ))}
      </div>
    </div>
  );
}

export default async function VeiculoPage({ params }: Props) {
  const { slug } = await params;
  const v = await getVeiculoBySlug(slug);
  if (!v) notFound();

  const waInteresse = waLink(
    `Olá! Tenho interesse no ${v.marca} ${v.modelo} ${v.versao} (${v.anoMod}). Vi no site da SS Veículos. Pode me passar mais informações?`
  );
  const waVisita = waLink(
    `Olá! Gostaria de agendar uma visita para ver o ${v.marca} ${v.modelo} ${v.versao}.`
  );
  const waFinanciamento = waLink(
    `Olá! Tenho interesse em financiar o ${v.marca} ${v.modelo} ${v.versao}. Pode me ajudar?`
  );

  const specs = [
    { icon: Fuel,     label: "Combustível",   value: v.combustivel },
    { icon: Cog,      label: "Câmbio",         value: v.cambio },
    { icon: Gauge,    label: "Quilometragem",  value: formatKm(v.km) },
    { icon: Palette,  label: "Cor",            value: v.cor },
    { icon: Car,      label: "Categoria",      value: v.categoria },
    { icon: Tag,      label: "Condição",       value: v.condicao },
  ];
  if (v.portas > 0)
    specs.push({ icon: DoorOpen, label: "Portas", value: `${v.portas} portas` });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-6 font-condensed">
        <Link
          href="/estoque"
          className="flex items-center gap-1 text-c-text3 hover:text-brand-red transition-colors uppercase tracking-wider text-xs"
        >
          <ArrowLeft size={13} /> Frota
        </Link>
        <span className="text-c-border3">/</span>
        <span className="text-c-text2 uppercase tracking-wider text-xs truncate">
          {v.marca} {v.modelo}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          {v.badge && (
            <div className="mb-3">
              <Badge status={v.badge} />
            </div>
          )}
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

          <div className="mb-6">
            {v.precoAnterior && (
              <p className="font-condensed text-sm text-c-text4 line-through">
                {formatPreco(v.precoAnterior)}
              </p>
            )}
            <p className="font-display text-5xl text-brand-red leading-none">
              {v.preco != null ? formatPreco(v.preco) : "Sob consulta"}
            </p>
            <p className="font-condensed text-xs text-c-text3 mt-1 uppercase tracking-wider">
              Consulte condições de financiamento
            </p>
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
              href={waInteresse}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#1DA851] hover:bg-[#17923f] text-white font-condensed font-bold uppercase tracking-widest py-4 text-sm rounded-lg transition-colors"
            >
              <MessageCircle size={18} />
              Tenho Interesse — WhatsApp
            </a>
            <a
              href={waVisita}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-c-border hover:border-brand-red text-c-text font-condensed font-semibold uppercase tracking-widest py-3 text-sm rounded-lg transition-colors"
            >
              <Calendar size={16} className="text-brand-red" />
              Agendar Visita
            </a>
            <a
              href={CONFIG.phone.href}
              className="flex items-center justify-center gap-2 border border-c-border hover:border-c-border3 text-c-text2 hover:text-c-text font-condensed font-semibold uppercase tracking-widest py-3 text-sm rounded-lg transition-colors"
            >
              Ligar: {CONFIG.phone.display}
            </a>
          </div>

          <ShareButton title={`${v.marca} ${v.modelo}`} />
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

      <div className="bg-c-surface rounded-2xl shadow-card p-6 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-condensed font-bold uppercase tracking-widest text-sm text-c-text mb-1">
            Quer financiar este veículo?
          </h2>
          <p className="font-sans text-sm text-c-text2">
            Trabalhamos com{" "}
            <span className="text-c-text">BV, Bradesco e C6 Bank</span>. Fale com
            um consultor e descubra as melhores condições para você.
          </p>
        </div>
        <a
          href={waFinanciamento}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-condensed font-bold uppercase tracking-widest px-6 py-3 text-sm rounded-lg transition-colors shrink-0"
        >
          Consultar Financiamento
        </a>
      </div>

      <Suspense
        fallback={
          <div>
            <div className="h-9 w-72 bg-c-surface2 rounded-lg animate-pulse mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-c-surface2 rounded-2xl aspect-[4/5] animate-pulse" />
              ))}
            </div>
          </div>
        }
      >
        <Similares veiculo={v} />
      </Suspense>
    </div>
  );
}
