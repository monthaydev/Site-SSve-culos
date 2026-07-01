import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] px-4 text-center">
      <p className="font-display text-[8rem] text-brand-red/20 leading-none mb-0">404</p>
      <h1 className="font-display text-4xl text-c-text uppercase mb-3">Página não encontrada</h1>
      <p className="font-sans text-sm text-c-text2 mb-8 max-w-sm">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-condensed font-bold uppercase tracking-widest px-8 py-4 text-sm transition-colors"
      >
        Voltar ao início <ArrowRight size={16} />
      </Link>
    </div>
  );
}
