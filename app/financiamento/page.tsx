import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/config";
import { BANCOS } from "@/lib/bancos";

export const metadata = {
  title: "Financiamento — SS Veículos",
  description: "Financie seu veículo com BV, Bradesco e C6 Bank. As melhores condições para você em Cacoal – RO.",
};

export default function FinanciamentoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <p className="font-condensed font-bold uppercase tracking-widest text-xs text-brand-red mb-2">
          Parceiros financeiros
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-c-text leading-none uppercase">
          Financiamento
        </h1>
        <p className="font-condensed text-c-text2 text-lg mt-4 max-w-xl leading-relaxed">
          Não sabe como financiar seu próximo veículo? Trabalhamos com os
          principais bancos do mercado para indicar as melhores condições para
          você. Fale com um de nossos consultores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {BANCOS.map((b) => (
          <div
            key={b.nome}
            className="flex flex-col gap-5 bg-c-surface rounded-2xl shadow-card hover:shadow-card-hover transition-shadow p-8"
          >
            <div className="h-20 flex items-center justify-center rounded-xl bg-white ring-1 ring-black/5 px-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.logo}
                alt={b.nome}
                style={{ height: b.logoH + 4 }}
                className="w-auto object-contain"
              />
            </div>
            <p className="font-sans text-sm text-c-text2 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="font-display text-3xl md:text-4xl text-c-text uppercase mb-8">
          Como funciona
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Escolha o Veículo",
              desc: "Navegue pela nossa frota e encontre o carro que você quer levar para casa.",
            },
            {
              step: "02",
              title: "Fale com um Consultor",
              desc: "Entre em contato pelo WhatsApp ou visite nossa loja. Nosso consultor vai buscar as melhores condições nos nossos bancos parceiros.",
            },
            {
              step: "03",
              title: "Retire seu Veículo",
              desc: "Aprovado o crédito, é só vir buscar as chaves do seu novo carro!",
            },
          ].map((s) => (
            <div key={s.step} className="flex flex-col gap-3 p-6 rounded-2xl bg-c-surface shadow-card">
              <span className="font-display text-5xl text-brand-red/20 leading-none">{s.step}</span>
              <h3 className="font-condensed font-bold text-base text-c-text uppercase tracking-wide">
                {s.title}
              </h3>
              <p className="font-sans text-sm text-c-text2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-red/5 border border-brand-red/20 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-condensed font-bold text-lg text-c-text uppercase tracking-wide mb-1">
            Quer saber as condições para o seu veículo?
          </h3>
          <p className="font-sans text-sm text-c-text2">
            Fale com nosso consultor pelo WhatsApp e receba as melhores opções de financiamento.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <a
            href={waLink("Olá! Gostaria de saber as condições de financiamento na SS Veículos.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-condensed font-bold uppercase tracking-widest px-6 py-3 text-sm transition-colors"
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
          <Link
            href="/estoque"
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-condensed font-bold uppercase tracking-widest px-6 py-3 text-sm transition-colors"
          >
            Ver Frota <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
