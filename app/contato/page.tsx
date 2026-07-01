import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { CONFIG } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { formatWhatsapp } from "@/lib/utils";
import ContatoForm from "./ContatoForm";

export const metadata: Metadata = {
  title: "Contato — SS Veículos | Cacoal-RO",
  description:
    "Entre em contato com a SS Veículos em Cacoal – RO. Telefone, WhatsApp, e-mail e endereço. Atendimento de segunda a sábado.",
};

const contatos = [
  {
    Icon: Phone,
    label: "Telefone",
    value: CONFIG.phone.display,
    href: CONFIG.phone.href,
    external: false,
  },
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: CONFIG.whatsapp.display,
    href: `https://wa.me/${CONFIG.whatsapp.number}`,
    external: true,
  },
  {
    Icon: Mail,
    label: "E-mail",
    value: CONFIG.email,
    href: `mailto:${CONFIG.email}`,
    external: false,
  },
  {
    Icon: MapPin,
    label: "Endereço",
    value: CONFIG.address,
    href: CONFIG.maps,
    external: true,
  },
] as const;

export default async function ContatoPage() {
  const supabase = await createClient();
  const { data: vendedores } = await supabase
    .from("vendedores")
    .select("id, nome, whatsapp")
    .eq("ativo", true)
    .order("ordem")
    .order("nome");

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <p className="font-condensed font-bold uppercase tracking-widest text-xs text-brand-red mb-2">
          Fale com a gente
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-c-text leading-none uppercase">
          Contato
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <div className="bg-c-surface rounded-2xl shadow-card p-6">
            <h2 className="font-condensed font-bold uppercase tracking-widest text-sm text-c-text mb-5">
              Informações de Contato
            </h2>
            <ul className="flex flex-col gap-5">
              {contatos.map(({ Icon, label, value, href, external }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon size={14} className="text-brand-red mt-0.5 shrink-0" />
                  <div>
                    <p className="font-condensed text-xs uppercase tracking-widest text-c-text3 mb-0.5">
                      {label}
                    </p>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="font-sans text-sm text-c-text2 hover:text-c-text transition-colors"
                    >
                      {value}
                    </a>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <Clock size={14} className="text-brand-red mt-0.5 shrink-0" />
                <div>
                  <p className="font-condensed text-xs uppercase tracking-widest text-c-text3 mb-0.5">
                    Horário de Atendimento
                  </p>
                  <p className="font-sans text-sm text-c-text2">{CONFIG.hours.weekdays}</p>
                  <p className="font-sans text-sm text-c-text2">{CONFIG.hours.saturday}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-c-surface rounded-2xl shadow-card overflow-hidden h-72 lg:flex-1">
            <iframe
              src="https://maps.google.com/maps?q=Av.+Castelo+Branco+20644+Novo+Horizonte+Cacoal+RO&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização SS Veículos — Cacoal, Rondônia"
            />
          </div>
        </div>

        <div className="bg-c-surface rounded-2xl shadow-card p-6">
          <h2 className="font-condensed font-bold uppercase tracking-widest text-sm text-c-text mb-6">
            Envie uma Mensagem
          </h2>
          <ContatoForm />
        </div>
      </div>

      {vendedores && vendedores.length > 0 && (
        <div className="mt-8">
          <div className="bg-c-surface rounded-2xl shadow-card p-6">
            <h2 className="font-condensed font-bold uppercase tracking-widest text-sm text-c-text mb-5">
              Nossa Equipe
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {vendedores.map((v) => (
                <a
                  key={v.id}
                  href={`https://wa.me/${v.whatsapp}?text=${encodeURIComponent(
                    `Olá, ${v.nome}! Vi o site da SS Veículos e gostaria de mais informações.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 bg-c-surface2 hover:bg-c-border/40 rounded-xl p-4 text-center transition-colors"
                >
                  <MessageCircle size={18} className="text-[#1DA851]" />
                  <span className="font-sans text-sm font-medium text-c-text">{v.nome}</span>
                  <span className="font-sans text-xs text-c-text3">{formatWhatsapp(v.whatsapp)}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
