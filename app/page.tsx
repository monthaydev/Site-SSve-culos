import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Car, Truck, Bus, ChevronRight, Award, Shield, Handshake, Key } from "lucide-react";
import CardVeiculo from "@/components/CardVeiculo";
import { getDestaques, getCategoriasCount } from "@/lib/veiculos";
import { BANCOS } from "@/lib/bancos";

const CATEGORIAS = [
  { key: "Carro",      label: "Carros",      desc: "Seminovos e novos",  href: "/estoque?categoria=Carro",      Icon: Car },
  { key: "Caminhão",   label: "Caminhões",   desc: "Pesados e médios",   href: "/estoque?categoria=Caminhão",   Icon: Truck },
  { key: "Utilitário", label: "Utilitários", desc: "Picapes e mais",     href: "/estoque?categoria=Utilitário", Icon: Truck },
  { key: "Van",        label: "Vans",        desc: "Transporte e lazer", href: "/estoque?categoria=Van",        Icon: Bus },
] as const;

const CONFIANCA = [
  { Icon: Award,     title: "22 anos de mercado", desc: "Mais de duas décadas realizando sonhos em Cacoal e região." },
  { Icon: Shield,    title: "Veículos garantidos", desc: "Vistoria mecânica e documental rigorosa antes de entrar na frota." },
  { Icon: Handshake, title: "Financiamento fácil", desc: "Parceiros BV, Bradesco e C6 Bank com as melhores condições." },
] as const;

export default async function Home() {
  const [destaques, categoriasCount] = await Promise.all([
    getDestaques(6),
    getCategoriasCount(),
  ]);

  const totalEstoque = Object.values(categoriasCount).reduce((a, b) => a + b, 0);

  return (
    <>
      <section className="relative bg-[#1E293B] overflow-hidden">
        <div className="bar-grow absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-brand-red via-brand-red/40 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(105deg, transparent, transparent 40px, rgba(255,255,255,0.6) 40px, rgba(255,255,255,0.6) 41px)",
          }}
        />

        {/* Carro — fundo atmosférico no mobile, protagonista lateral no desktop.
            Sem fade de entrada (reveal-x) pra não atrasar o LCP — o movimento
            fica por conta do car-cruise + speed-streaks. */}
        <div className="absolute inset-0 right-0 md:left-auto md:w-[58%] lg:w-[52%] overflow-hidden">
          <div className="speed-streaks pointer-events-none absolute inset-y-0 right-0 opacity-40" />
          {/* Foto flutuando, como em movimento */}
          <div className="car-cruise absolute inset-0">
            <Image
              src="/hero-carro.jpg"
              alt="Veículo esportivo em destaque na SS Veículos"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover object-center"
            />
          </div>
          {/* Mobile: escurece geral p/ legibilidade · Desktop: some */}
          <div className="absolute inset-0 bg-[#1E293B]/50 md:bg-transparent" />
          {/* Funde a foto no slate — vertical no mobile, horizontal no desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-[#1E293B]/40 to-transparent md:bg-gradient-to-r md:from-[#1E293B] md:via-[#1E293B]/55 md:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B]/75 via-transparent to-transparent md:bg-gradient-to-t md:from-[#1E293B] md:via-transparent md:to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl mb-8">
            
            <h1 className="reveal reveal-d2 font-display text-[clamp(2.6rem,7vw,4.5rem)] leading-[0.95] text-white uppercase mb-3">
              Encontre seu <span className="shine text-[#FF4D63]">próximo veículo</span>
            </h1>
            <p className="reveal reveal-d3 font-condensed text-base text-white/70 max-w-md">
              Há mais de 22 anos realizando sonhos. Veículos garantidos,
              financiamento fácil e atendimento de confiança.
            </p>
          </div>

          <div className="reveal reveal-d4 flex flex-wrap items-center gap-x-8 gap-y-3 mt-6">
            {[
              { value: "22+", label: "Anos de mercado" },
              { value: totalEstoque > 0 ? `${totalEstoque}` : "—", label: "Veículos Disponíveis" },
              { value: "100%", label: "Comprometimento" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="font-display text-2xl text-[#FF4D63] leading-none tabular-nums">
                  {s.value}
                </span>
                <span className="font-condensed font-bold text-xs uppercase tracking-widest text-white/75">
                  {s.label}
                </span>
              </div>
            ))}

            <Link
              href="/locadora"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2 shadow-[0_4px_20px_-4px_rgba(200,16,46,0.7)] ring-1 ring-[#FF4D63]/50 transition-all hover:bg-brand-red-hover hover:shadow-[0_6px_28px_-4px_rgba(200,16,46,0.9)]">
              <Key size={16} className="text-white" />
              <span className="font-condensed font-bold text-sm uppercase tracking-widest text-white">
                SS Locadora · Alugue já
              </span>
              <ArrowRight size={14} className="text-white transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-condensed font-bold uppercase tracking-widest text-xs text-brand-red mb-2">
              Oportunidades
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-c-text leading-none uppercase">
              Veículos em destaque
            </h2>
          </div>
          <Link
            href="/estoque"
            className="hidden sm:flex items-center gap-2 text-sm font-condensed font-semibold uppercase tracking-wider text-c-text2 hover:text-brand-red transition-colors"
          >
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        {destaques.length === 0 ? (
          <div className="bg-c-surface rounded-2xl shadow-card p-16 text-center">
            <Car size={32} className="text-c-border3 mx-auto mb-4" />
            <p className="font-condensed text-c-text3 uppercase tracking-wide text-sm">
              Veículos  sendo atualizados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destaques.map((v) => (
              <CardVeiculo key={v.id} v={v} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/estoque"
            className="inline-flex items-center gap-2 border border-c-border3 hover:border-brand-red text-c-text font-condensed font-bold uppercase tracking-widest px-8 py-3 text-sm rounded-lg transition-colors"
          >
            Ver  todos os veículos  <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="bg-c-bg-alt">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="font-condensed font-bold uppercase tracking-widest text-xs text-brand-red mb-2">
                Navegue por tipo
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-c-text leading-none uppercase">
                O que você procura?
              </h2>
            </div>
            <Link
              href="/estoque"
              className="hidden sm:flex items-center gap-1.5 text-xs font-condensed font-semibold uppercase tracking-wider text-c-text2 hover:text-brand-red transition-colors"
            >
              Ver tudo <ChevronRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CATEGORIAS.map((cat) => {
              const count = categoriasCount[cat.key] ?? 0;
              return (
                <Link
                  key={cat.key}
                  href={cat.href}
                  className="group flex flex-col gap-4 bg-c-surface rounded-2xl p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-c-surface2 text-c-text3 group-hover:text-brand-red transition-colors">
                    <cat.Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-condensed font-bold text-sm text-c-text uppercase tracking-wide group-hover:text-brand-red transition-colors leading-tight">
                      {cat.label}
                    </p>
                    <p className="font-sans text-sm text-c-text3 mt-0.5">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-condensed text-sm text-c-text3">
                      {count > 0
                        ? `${count} disponíve${count !== 1 ? "is" : "l"}`
                        : "Consultar"}
                    </span>
                    <ArrowRight
                      size={12}
                      className="text-brand-red opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {CONFIANCA.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-start gap-3 p-5 rounded-2xl bg-c-surface shadow-card"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-brand-red/10 rounded-lg text-brand-red">
                <item.Icon size={20} />
              </div>
              <div>
                <h3 className="font-condensed font-bold text-base text-c-text uppercase tracking-wide mb-1">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-c-text2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-10 mt-8 border-t border-c-border">
          <p className="text-center font-condensed font-bold uppercase tracking-widest text-sm text-c-text3 mb-6">
            Financiamento com nossos parceiros
          </p>
          <div className="flex flex-wrap justify-center items-stretch gap-3 sm:gap-4">
            {BANCOS.map((b) => (
              <div
                key={b.nome}
                className="flex items-center justify-center h-20 w-40 sm:w-48 rounded-xl bg-white shadow-card ring-1 ring-black/5 px-6 transition-transform hover:-translate-y-0.5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.logo}
                  alt={b.nome}
                  style={{ height: b.logoH }}
                  className="w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
