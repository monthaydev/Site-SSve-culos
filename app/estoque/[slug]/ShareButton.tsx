"use client";
import { Share2 } from "lucide-react";

export default function ShareButton({ title }: { title: string }) {
  return (
    <button
      onClick={() => navigator.share?.({ title, url: window.location.href })}
      className="flex items-center gap-2 text-xs text-c-text3 hover:text-c-text font-condensed uppercase tracking-wider transition-colors self-start"
    >
      <Share2 size={13} /> Compartilhar
    </button>
  );
}
