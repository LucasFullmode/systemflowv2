"use client";

/* =========================================================
   DECK — motor da apresentação interativa (single-page)

   NÃO é uma landing que rola: é um slide por vez, em tela cheia.

   Navegação:
   - Teclado: ← / → , Espaço e PageDown avançam; PageUp volta;
     Home vai ao 1º slide; End vai ao último.
   - Setas clicáveis nas laterais + bolinhas de progresso embaixo.
   - Swipe (touch) esquerda/direita.
   - Hash na URL por slide (#3) para linkar/voltar.
   - Contador "03 / 10" no canto.

   Transição: slide horizontal + fade, sensível à direção.
   ========================================================= */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SLIDES, stagger } from "./slides";

const LAST = SLIDES.length - 1;
const pad = (n: number) => String(n).padStart(2, "0");

/* Canvas de referência do slide (16:9). Tudo é desenhado nesse tamanho
   e ESCALADO para preencher a tela — assim o conteúdo fica grande e
   proporcional em qualquer monitor (igual a um deck de verdade). */
const BASE_W = 1280;
const BASE_H = 720;

/* entrada/saída sensível à direção (next = vem da direita) */
const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? -64 : 64, opacity: 0 }),
};

export default function Deck() {
  const reduced = useReducedMotion();
  // [índice atual, direção do último movimento]
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);

  /* fator de zoom: escala o canvas 1280x720 para preencher a viewport */
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const recompute = () =>
      setScale(Math.min(window.innerWidth / BASE_W, window.innerHeight / BASE_H));
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  const go = useCallback((d: number) => {
    setState(([i]) => {
      const n = i + d;
      if (n < 0 || n > LAST) return [i, d];
      return [n, d];
    });
  }, []);

  const jump = useCallback((target: number) => {
    setState(([i]) => {
      const n = Math.max(0, Math.min(LAST, target));
      return [n, n === i ? 0 : n > i ? 1 : -1];
    });
  }, []);

  /* ----- hash da URL: ler ao montar, escrever ao mudar ----- */
  useEffect(() => {
    const fromHash = parseInt(window.location.hash.replace("#", ""), 10);
    if (!Number.isNaN(fromHash)) jump(fromHash - 1);
    // só na montagem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const h = `#${index + 1}`;
    if (window.location.hash !== h) {
      window.history.replaceState(null, "", h);
    }
  }, [index]);

  /* ----- teclado ----- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          go(1);
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          go(-1);
          break;
        case "Home":
          e.preventDefault();
          jump(0);
          break;
        case "End":
          e.preventDefault();
          jump(LAST);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, jump]);

  /* ----- swipe (touch) ----- */
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const { Component } = SLIDES[index];

  return (
    <div
      className="relative h-[100svh] w-screen overflow-hidden bg-background select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* marca (topo-esquerda) */}
      <button
        type="button"
        onClick={() => jump(0)}
        className="font-brand absolute left-6 top-5 z-40 cursor-pointer text-sm font-bold tracking-tight text-foreground/90 transition-opacity hover:opacity-70 md:left-10"
      >
        System<span className="text-accent">Flow</span>
      </button>

      {/* contador (topo-direita) */}
      <div className="absolute right-6 top-5 z-40 font-mono text-xs tracking-widest text-muted md:right-10">
        <span className="text-foreground">{pad(index + 1)}</span> / {pad(SLIDES.length)}
      </div>

      {/* PALCO — canvas fixo 1280x720 ESCALADO para preencher a tela.
         Tudo cresce junto e proporcional (zoom de deck), sem reflow.
         Modo padrão (crossfade): slides `absolute inset-0` sobrepostos —
         evita a projeção de layout do popLayout, que conflitava com os
         SVGs animados. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}
          className="relative shrink-0 origin-center"
        >
          <AnimatePresence custom={dir} initial={false}>
            <motion.div
              key={index}
              custom={dir}
              variants={reduced ? undefined : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 320, damping: 34 },
                opacity: { duration: 0.25 },
              }}
              className="absolute inset-0 flex items-center justify-center px-16 py-12"
            >
              {/* cascata interna dos elementos do slide */}
              <motion.div
                variants={reduced ? undefined : stagger}
                initial="hidden"
                animate="show"
                className="h-full w-full"
              >
                <Component />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* seta anterior */}
      <button
        type="button"
        aria-label="Slide anterior"
        onClick={() => go(-1)}
        disabled={index === 0}
        className="group absolute left-3 top-1/2 z-40 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/10 bg-surface/60 text-foreground/70 backdrop-blur-md transition-all hover:border-accent/40 hover:text-accent disabled:pointer-events-none disabled:opacity-0 md:left-6"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </button>

      {/* seta próxima */}
      <button
        type="button"
        aria-label="Próximo slide"
        onClick={() => go(1)}
        disabled={index === LAST}
        className="group absolute right-3 top-1/2 z-40 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/10 bg-surface/60 text-foreground/70 backdrop-blur-md transition-all hover:border-accent/40 hover:text-accent disabled:pointer-events-none disabled:opacity-0 md:right-6"
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>

      {/* indicador de slides (bolinhas) */}
      <div className="absolute bottom-7 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Ir para o slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => jump(i)}
            className="group cursor-pointer py-2"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-7 bg-accent"
                  : "w-1.5 bg-white/20 group-hover:bg-white/40"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
