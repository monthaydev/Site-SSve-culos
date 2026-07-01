import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Users, MapPin, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre — SS Veículos | 22 Anos Realizando Sonhos em Cacoal-RO",
  description:
    "Conheça a SS Veículos: mais de 22 anos de tradição em Cacoal – RO. Nossa história, valores e o compromisso que nos faz referência em veículos na região.",
};

export default function SobrePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="relative overflow-hidden bg-c-surface rounded-2xl shadow-card mb-12">
        <div className="absolute left-0 top-0 w-1 h-full bg-brand-red z-10" />
        <div className="grid md:grid-cols-2">
          <div className="relative p-8 md:p-14 flex flex-col justify-center">
            <p className="font-condensed font-bold uppercase tracking-widest text-xs text-brand-red mb-3">
              Nossa História
            </p>
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] text-c-text leading-none uppercase mb-6">
              22 Anos<br />
              <span className="text-brand-red">Realizando</span><br />
              Sonhos
            </h1>
            <p className="font-condensed text-c-text2 text-lg max-w-xl leading-relaxed">
              A SS Veículos nasceu em Cacoal com um propósito simples: conectar as pessoas aos melhores veículos com honestidade, transparência e um atendimento que vai além da venda.
            </p>
          </div>

          <div className="relative min-h-[260px] md:min-h-full overflow-hidden bg-[#0D0D0D]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sobre-fachada.jpg"
              alt="Fachada da SS Veículos em Cacoal-RO"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* vinheta escura: suaviza o realce do letreiro no topo e dá legibilidade ao selo embaixo */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
            <span className="absolute bottom-4 right-4 font-condensed font-bold uppercase tracking-[0.25em] text-xs text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              Nossa loja · Cacoal/RO
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { value: "22+",  label: "Anos de Mercado" },
          { value: "Mil+", label: "Clientes Atendidos" },
          { value: "25+",  label: "Veículos na Frota" },
          { value: "3",    label: "Bancos Parceiros" },
        ].map((s) => (
          <div key={s.label} className="bg-c-surface rounded-2xl shadow-card p-6 text-center">
            <p className="font-display text-4xl text-brand-red leading-none mb-1">{s.value}</p>
            <p className="font-condensed text-xs uppercase tracking-widest text-c-text2">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="font-display text-3xl md:text-4xl text-c-text uppercase mb-8">Nossos Valores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Award,
              title: "Tradição e Confiança",
              desc: "Mais de duas décadas no mercado de Cacoal. Nossa história é construída pela confiança de cada cliente que realizou o sonho de ter um veículo conosco.",
            },
            {
              icon: Heart,
              title: "Atendimento Humano",
              desc: "Cada cliente é tratado de forma única. Entendemos as necessidades de cada família e encontramos o veículo ideal para o momento de cada um.",
            },
            {
              icon: Users,
              title: "Comprometimento Total",
              desc: "Do primeiro contato à entrega das chaves, estamos comprometidos em fazer a melhor negociação possível para você.",
            },
            {
              icon: MapPin,
              title: "Raízes em Cacoal",
              desc: "Somos uma empresa local, conhecemos nossa cidade e nossa região. Investimos em Cacoal porque acreditamos no crescimento da nossa comunidade.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-6 rounded-2xl bg-c-surface shadow-card transition-shadow hover:shadow-card-hover">
              <div className="w-10 h-10 flex items-center justify-center bg-brand-red/10 rounded-lg text-brand-red shrink-0">
                <item.icon size={18} />
              </div>
              <div>
                <h3 className="font-condensed font-bold text-base text-c-text uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-c-text2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-10">
        <div>
          <h3 className="font-condensed font-bold text-lg text-c-text uppercase tracking-wide mb-1">
            Venha nos conhecer
          </h3>
          <p className="font-sans text-sm text-c-text2">
            Estamos em Cacoal – RO, prontos para te atender do jeito que você merece.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/estoque"
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-condensed font-bold uppercase tracking-widest px-6 py-3 text-sm transition-colors"
          >
            Ver Frota <ArrowRight size={14} />
          </Link>
          <Link
            href="/contato"
            className="flex items-center gap-2 border border-c-border3 hover:border-brand-red text-c-text font-condensed font-bold uppercase tracking-widest px-6 py-3 text-sm transition-colors"
          >
            Contato
          </Link>
        </div>
      </div>
    </div>
  );
}
