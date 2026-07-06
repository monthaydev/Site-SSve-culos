"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { CONFIG, WA_DEFAULT } from "@/lib/config";

const navLinks = [
  { href: "/sobre",         label: "Sobre" },
  { href: "/estoque",       label: "Veículos" },
  { href: "/locadora",      label: "Locadora" },
  { href: "/servicos",      label: "Serviços" },
  { href: "/financiamento", label: "Financiamento" },
  { href: "/contato",       label: "Contato" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Portal só renderiza no cliente (evita mismatch no SSR)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-c-bg/90 backdrop-blur-md shadow-[0_1px_16px_rgba(16,24,40,0.05)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center group"
          onClick={() => setOpen(false)}
          aria-label="SS Veículos — Início"
        >
          <Image
            src="/logo-ss-veiculos.png"
            alt="SS Veículos"
            width={124}
            height={80}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link font-condensed font-semibold tracking-wider uppercase text-sm transition-colors ${
                pathname === link.href
                  ? "text-brand-red active"
                  : "text-c-text2 hover:text-c-text"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={CONFIG.phone.href}
            className="flex items-center gap-2 text-sm text-c-text2 hover:text-c-text transition-colors font-condensed"
            aria-label="Ligar para SS Veículos"
          >
            <Phone size={14} className="text-brand-red" />
            <span>{CONFIG.phone.display}</span>
          </a>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            className="p-2 text-c-text"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu — renderizado via portal no <body> para escapar do
          backdrop-filter/sticky do header (senão o blur do overlay amostra a
          camada errada sobre os cards/badges). */}
      {mounted && open && createPortal(
        <div className="md:hidden">
          <button
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="fixed inset-x-0 top-16 bottom-0 z-[60] bg-black/40 backdrop-blur-sm anim-fade"
          />
          <div className="fixed top-16 inset-x-0 z-[61] bg-c-surface border-t border-c-border shadow-lg anim-menu">
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center rounded-lg px-3 py-3 font-condensed font-semibold tracking-wider uppercase text-base transition-colors ${
                      active
                        ? "bg-brand-red/10 text-brand-red"
                        : "text-c-text2 hover:bg-c-surface2 hover:text-c-text"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <a
                href={WA_DEFAULT}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 bg-[#1DA851] hover:bg-[#17923f] text-white font-condensed font-bold uppercase tracking-widest text-sm rounded-lg py-3 transition-colors"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a
                href={CONFIG.phone.href}
                className="flex items-center justify-center gap-2 font-condensed text-c-text2 uppercase text-sm py-2.5"
              >
                <Phone size={14} className="text-brand-red" />
                {CONFIG.phone.display}
              </a>
            </nav>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
