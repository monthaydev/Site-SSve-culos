import Link from "next/link";
import Image from "next/image";
import { CONFIG, WA_DEFAULT } from "@/lib/config";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

const navLinks = [
  { href: "/sobre",         label: "Sobre nós" },
  { href: "/estoque",       label: "Frota" },
  { href: "/locadora",      label: "Locadora" },
  { href: "/servicos",      label: "Serviços" },
  { href: "/financiamento", label: "Financiamento" },
  { href: "/contato",       label: "Contato" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white/60 mt-24">
      <div className="h-px bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">

          <div className="md:col-span-5">
            <Image
              src="/logo-footer.png"
              alt="SS Veículos"
              width={220}
              height={144}
              className="h-28 w-auto"
            />

            <p className="mt-6 max-w-xs font-sans text-sm leading-relaxed text-white/45">
              Há mais de 22 anos realizando sonhos em Cacoal — Rondônia.
              Tradição, confiança e os melhores veículos da região.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <a
                href={CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram SS Veículos"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-brand-red hover:text-white"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook SS Veículos"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-brand-red hover:text-white"
              >
                <FacebookIcon size={16} />
              </a>
            </div>
          </div>

          <nav className="md:col-span-3">
            <h3 className="font-condensed text-sm font-bold uppercase tracking-[0.25em] text-white/35">
              Navegação
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-condensed text-sm font-semibold uppercase tracking-wider text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h3 className="font-condensed text-sm font-bold uppercase tracking-[0.25em] text-white/35">
              Contato
            </h3>
            <ul className="mt-5 space-y-3 font-sans text-sm">
              <li>
                <a
                  href={CONFIG.phone.href}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {CONFIG.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={WA_DEFAULT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  WhatsApp · {CONFIG.whatsapp.display}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONFIG.email}`}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {CONFIG.email}
                </a>
              </li>
              <li className="text-white/45">{CONFIG.address}</li>
              <li className="pt-1 text-white/45">
                {CONFIG.hours.weekdays}
                <br />
                {CONFIG.hours.saturday}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row">
          <p className="font-sans text-xs text-white/40">
            © {new Date().getFullYear()} SS Veículos — Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-2 font-sans text-xs text-white/40">
            <span>Desenvolvido por</span>
            <a
              href={CONFIG.dev.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Desenvolvido por ${CONFIG.dev.name}`}
              className="group font-display text-lg leading-none tracking-[0.08em] transition-opacity hover:opacity-80"
            >
              <span className="text-brand-red">Prisma</span>{" "}
              <span className="text-white">Agência</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
