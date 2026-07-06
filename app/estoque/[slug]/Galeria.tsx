"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand, Car } from "lucide-react";

interface Props {
  fotos: string[];
  alt: string;
}

const SWIPE_THRESHOLD = 40;

export default function Galeria({ fotos, alt }: Props) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);
  const didSwipe = useRef(false);

  const prev = useCallback(() => setIdx((i) => (i - 1 + fotos.length) % fotos.length), [fotos.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % fotos.length), [fotos.length]);
  const close = useCallback(() => setLightbox(false), []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (touchStartX.current === null) return;
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      prev();
      didSwipe.current = true;
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      next();
      didSwipe.current = true;
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }, [prev, next]);

  const onMainClick = useCallback(() => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    setLightbox(true);
  }, []);

  const onLightboxBackdropClick = useCallback(() => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    close();
  }, [close]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [lightbox, prev, next, close]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  if (fotos.length === 0) {
    return (
      <div className="relative aspect-[16/10] bg-c-surface2 flex items-center justify-center rounded-xl">
        <Car size={48} className="text-c-border" />
      </div>
    );
  }

  return (
    <>
      <div
        className="relative aspect-[16/10] bg-c-surface overflow-hidden rounded-xl cursor-zoom-in group touch-pan-y"
        onClick={onMainClick}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={fotos[idx]}
          alt={`${alt} — foto ${idx + 1}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {fotos.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 font-condensed text-xs text-white tracking-wider select-none">
            {idx + 1} / {fotos.length}
          </div>
        )}

        <div className="absolute top-3 right-3 bg-black/60 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Expand size={14} className="text-white" />
        </div>

        {fotos.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Próxima foto"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
          {fotos.slice(0, 9).map((foto, i) => {
            const isLast = i === 8 && fotos.length > 9;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={`relative aspect-[4/3] overflow-hidden rounded-lg transition-all focus:outline-none ${
                  i === idx
                    ? "ring-2 ring-brand-red ring-offset-1 ring-offset-c-bg"
                    : "opacity-55 hover:opacity-90"
                }`}
                aria-label={`Ver foto ${i + 1}`}
              >
                <Image src={foto} alt={`Miniatura ${i + 1}`} fill className="object-cover" sizes="120px" />
                {isLast && (
                  <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                    <span className="text-white font-condensed font-bold text-sm">
                      +{fotos.length - 9}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/97 flex items-center justify-center touch-pan-y"
          onClick={onLightboxBackdropClick}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/60 hover:text-white p-2 z-10 transition-colors"
            onClick={close}
            aria-label="Fechar galeria"
          >
            <X size={26} />
          </button>

          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 font-condensed text-sm tracking-widest select-none">
            {idx + 1} / {fotos.length}
          </div>

          <div
            className="relative w-full h-full max-w-5xl max-h-[80vh] mx-auto px-14"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fotos[idx]}
              alt={`${alt} — foto ${idx + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {fotos.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 bg-black/40 hover:bg-black/70 transition-colors"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Foto anterior"
              >
                <ChevronLeft size={30} />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 bg-black/40 hover:bg-black/70 transition-colors"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Próxima foto"
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}

          {fotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 overflow-x-auto max-w-[90vw] pb-1 px-2">
              {fotos.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                  className={`relative w-12 h-8 shrink-0 overflow-hidden transition-all ${
                    i === idx ? "ring-2 ring-brand-red opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                  aria-label={`Ir para foto ${i + 1}`}
                >
                  <Image src={f} alt="" fill className="object-cover" sizes="48px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
