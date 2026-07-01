"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export default function LoginSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`mt-2 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-sm py-3 rounded-lg transition-colors ${
        pending
          ? "bg-c-border3 text-c-text3 cursor-not-allowed"
          : "bg-brand-red hover:bg-brand-red-hover text-white"
      }`}
    >
      {pending ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          Entrando...
        </>
      ) : (
        "Entrar"
      )}
    </button>
  );
}
