"use client";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { WA_DEFAULT } from "@/lib/config";

export default function WhatsAppButton() {
  // Recolhe o botão quando o rodapé entra na tela, pra não sobrepor o footer
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={WA_DEFAULT}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-5 right-4 z-40 flex items-center gap-2 bg-[#1DA851] hover:bg-[#17923f] text-white font-condensed font-bold text-sm uppercase tracking-wider px-4 py-3 rounded-full shadow-lg shadow-black/20 transition-all duration-300 ${
        hidden
          ? "translate-y-24 opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
      aria-label="Falar pelo WhatsApp"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
