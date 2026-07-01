"use client";
import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { CONFIG, waLink } from "@/lib/config";

export default function ContatoForm() {
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", mensagem: "" });
  const [enviado, setEnviado] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const href = waLink(
      `Contato via site SS Veículos\nNome: ${form.nome}\nTelefone: ${form.telefone}\nE-mail: ${form.email}\nMensagem: ${form.mensagem}`
    );
    window.open(href, "_blank");
    setEnviado(true);
  };

  const inputCls =
    "bg-c-bg border border-c-border rounded-lg focus:border-brand-red text-c-text font-sans text-sm px-3 py-3 outline-none transition-colors w-full placeholder:text-c-text4";

  if (enviado) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <div className="w-14 h-14 flex items-center justify-center border border-[#1DA851]/40 text-[#1DA851]">
          <MessageCircle size={28} />
        </div>
        <p className="font-condensed font-bold text-lg text-c-text uppercase tracking-wide">
          Mensagem enviada!
        </p>
        <p className="font-sans text-sm text-c-text2">
          Você foi redirecionado para o WhatsApp. Aguarde nosso retorno em breve.
        </p>
        <button
          onClick={() => setEnviado(false)}
          className="mt-2 font-condensed text-xs text-brand-red uppercase tracking-wider hover:underline"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="nome" className="font-condensed text-xs uppercase tracking-widest text-c-text3">
          Nome *
        </label>
        <input
          id="nome"
          type="text"
          required
          value={form.nome}
          onChange={(e) => set("nome", e.target.value)}
          className={inputCls}
          placeholder="Seu nome completo"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="telefone" className="font-condensed text-xs uppercase tracking-widest text-c-text3">
            Telefone *
          </label>
          <input
            id="telefone"
            type="tel"
            required
            value={form.telefone}
            onChange={(e) => set("telefone", e.target.value)}
            className={inputCls}
            placeholder={CONFIG.phone.display}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-condensed text-xs uppercase tracking-widest text-c-text3">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputCls}
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="mensagem" className="font-condensed text-xs uppercase tracking-widest text-c-text3">
          Mensagem *
        </label>
        <textarea
          id="mensagem"
          required
          rows={5}
          value={form.mensagem}
          onChange={(e) => set("mensagem", e.target.value)}
          className={`${inputCls} resize-none`}
          placeholder="Como podemos ajudar você?"
        />
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-condensed font-bold uppercase tracking-widest py-4 text-sm transition-colors"
      >
        <Send size={14} /> Enviar pelo WhatsApp
      </button>
      <p className="font-sans text-xs text-c-text4 text-center">
        Ao enviar, você será redirecionado para o WhatsApp com sua mensagem preenchida.
      </p>
    </form>
  );
}
