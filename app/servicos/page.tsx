import Link from "next/link";
import { ArrowRight, FileText, RefreshCw, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/config";

export const metadata = {
  title: "Serviços — SS Veículos",
  description: "Despachante, transferência e avaliação de veículo para troca em Cacoal – RO.",
};

export default function ServicosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <p className="font-condensed font-bold uppercase tracking-widest text-xs text-brand-red mb-2">
          O que oferecemos
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-c-text leading-none uppercase">
          Serviços
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6 bg-c-surface rounded-2xl shadow-card hover:shadow-card-hover transition-shadow p-8">
          <div className="w-12 h-12 flex items-center justify-center bg-brand-red/10 rounded-xl text-brand-red">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="font-condensed font-bold text-2xl text-c-text uppercase tracking-wide mb-3">
              Despachante / Transferência
            </h2>
            <p className="font-sans text-sm text-c-text2 leading-relaxed mb-4">
              Toda a burocracia da transferência do veículo por conta da SS
              Veículos. Trabalhamos com um parceiro despachante de confiança para
              garantir rapidez e segurança no processo.
            </p>
            <ul className="flex flex-col gap-2 mb-6">
              {[
                "Transferência de propriedade",
                "Regularização de documentação",
                "Pagamento de débitos e multas",
                "Licenciamento",
                "Emissão de CRLV",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-sans text-sm text-c-text2">
                  <span className="w-1 h-1 rounded-full bg-brand-red shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={waLink("Olá! Gostaria de saber mais sobre o serviço de despachante.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-condensed font-bold uppercase tracking-widest px-6 py-3 text-sm transition-colors self-start"
            >
              <MessageCircle size={14} /> Solicitar Serviço
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-c-surface rounded-2xl shadow-card hover:shadow-card-hover transition-shadow p-8">
          <div className="w-12 h-12 flex items-center justify-center bg-brand-red/10 rounded-xl text-brand-red">
            <RefreshCw size={24} />
          </div>
          <div>
            <h2 className="font-condensed font-bold text-2xl text-c-text uppercase tracking-wide mb-3">
              Avaliação para Troca
            </h2>
            <p className="font-sans text-sm text-c-text2 leading-relaxed mb-4">
              Quer dar seu veículo como parte do pagamento do próximo? Avaliamos
              na hora com total transparência e o melhor valor do mercado para o
              seu bem.
            </p>
            <ul className="flex flex-col gap-2 mb-6">
              {[
                "Avaliação gratuita e sem compromisso",
                "Laudo técnico transparente",
                "Melhor valor de mercado",
                "Uso como entrada na compra",
                "Processo rápido e descomplicado",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-sans text-sm text-c-text2">
                  <span className="w-1 h-1 rounded-full bg-brand-red shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={waLink("Olá! Gostaria de avaliar meu veículo para troca na SS Veículos.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-condensed font-bold uppercase tracking-widest px-6 py-3 text-sm transition-colors self-start"
            >
              <MessageCircle size={14} /> Agendar Avaliação
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-2xl bg-c-surface shadow-card p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-condensed font-bold text-lg text-c-text uppercase tracking-wide mb-1">
            Dúvidas sobre nossos serviços?
          </h3>
          <p className="font-sans text-sm text-c-text2">
            Fale com um consultor pelo WhatsApp ou visite nossa loja em Cacoal.
          </p>
        </div>
        <Link
          href="/contato"
          className="flex items-center gap-2 border border-c-border3 hover:border-brand-red text-c-text font-condensed font-bold uppercase tracking-widest px-6 py-3 text-sm transition-colors shrink-0"
        >
          Fale Conosco <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
