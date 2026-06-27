"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  transform,
} from "framer-motion";
import type { Variants, MotionValue } from "framer-motion";
import { OPS_CARDS } from "@/lib/ops-cards";
import FloatingOpsCard from "./FloatingOpsCard";
import DashboardMockup from "./DashboardMockup";
import TextReveal from "./TextReveal";

/* =========================================================
   HERO "CAOS → PLATAFORMA"

   Narrativa controlada pelo scroll:
   1. Início : cards operacionais espalhados + título central
   2. Meio   : título sai, cards convergem para o centro
   3. Fim    : cards são absorvidos pelo dashboard, que assume a cena

   VELOCIDADE GERAL: a altura da seção define quanto scroll a
   narrativa dura — ajuste em `h-[260vh] md:h-[380vh]` abaixo.
   (mobile usa 260vh para uma animação mais curta e estável)

   Os pontos-chave da linha do tempo (0–1) estão nos useTransform:
   - texto do hero sai ........ 0.00 → 0.16
   - cards convergem .......... 0.12 → 0.67 (ver FloatingOpsCard.tsx)
   - moldura do dashboard ..... 0.30 → 0.52
   - dashboard se CONSTRÓI .... 0.38 → 0.78 (ver DashboardMockup.tsx —
     sidebar, KPIs, gráfico e listas nascem enquanto os cards são
     absorvidos: a bagunça vira módulo, não troca de tela)
   - CTA do platô entra ....... 0.72 → 0.84
   - PLATÔ .................... 0.84 → 1.00 — a plataforma montada
     (CTA + dashboard) fica "segurada" neste trecho do scroll.
     Para segurar mais/menos, mova os pontos acima ou mude a altura.
   ========================================================= */
export default function HeroChaosToPlatform() {
  const ref = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  /* Âncoras de pouso registradas pelo DashboardMockup —
     cada card flutuante voa até a sua (ver lib/ops-cards.ts) */
  const anchorsRef = useRef<Map<string, HTMLElement>>(new Map());
  const registerAnchor = (key: string) => (el: HTMLElement | null) => {
    if (el) anchorsRef.current.set(key, el);
    else anchorsRef.current.delete(key);
  };
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* FLUIDEZ: o spring amortece o progresso do scroll, então os cards
     deslizam com inércia em vez de seguir a roda do mouse "no talo".
     Menos stiffness / mais mass = movimento mais "pesado" e fluido. */
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.5,
  });

  /* Nota técnica: as opacidades usam a forma de FUNÇÃO do useTransform
     (via `transform(...)`) de propósito — a forma de array deixa o Motion
     promover a animação para ScrollTimeline nativo do navegador, que
     calcula o progresso errado dentro de seções sticky. */

  // Texto do hero: some no início do scroll
  const heroOpacity = useTransform(progress, transform([0, 0.16], [1, 0]));
  const heroY = useTransform(progress, [0, 0.16], [0, -48]);
  const heroPointer = useTransform(progress, (v) =>
    v > 0.1 ? ("none" as const) : ("auto" as const)
  );

  /* Moldura do dashboard: entra quando os cards começam a convergir
     e ASSENTA (scale 1, y 0) antes do primeiro pouso em 0.48 — assim
     cada card encontra a âncora já parada no lugar exato. */
  const dashOpacity = useTransform(progress, transform([0.3, 0.48], [0, 1]));
  const dashScale = useTransform(progress, [0.3, 0.47], [0.9, 1]);
  const dashY = useTransform(progress, [0.3, 0.47], [70, 0]);
  // Invisível, o bloco não pode roubar cliques do hero
  const dashPointer = useTransform(progress, (v) =>
    v > 0.55 ? ("auto" as const) : ("none" as const)
  );

  /* A legenda do platô usa o mesmo reveal (blur + cor) do hero,
     disparado quando o scroll cruza ~0.74 — e reverte ao subir. */
  const [platoIn, setPlatoIn] = useState(false);
  useMotionValueEvent(progress, "change", (v) => setPlatoIn(v > 0.74));

  // Dica de scroll: some assim que o usuário começa a rolar
  const hintOpacity = useTransform(progress, transform([0, 0.06], [1, 0]));

  // Versão estática (reduzir movimento): dashboard já 100% construído
  const fullyBuilt = useMotionValue(1);

  /* Acessibilidade: com "reduzir movimento" ativo no sistema,
     troca a narrativa por um hero estático com o dashboard visível. */
  if (reduced) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-12 overflow-hidden px-6 pt-32 pb-20">
        <BackgroundGlows />
        <HeroCopy />
        <DashboardMockup progress={fullyBuilt} />
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[260vh] md:h-[380vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
      >
        <BackgroundGlows progress={progress} />

        {/* Cards operacionais soltos (configurados em lib/ops-cards.ts) */}
        {OPS_CARDS.map((card) => (
          <FloatingOpsCard
            key={card.id}
            card={card}
            progress={progress}
            containerRef={stickyRef}
            anchors={anchorsRef}
          />
        ))}

        {/* Título, subtítulo e CTAs */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY, pointerEvents: heroPointer }}
          className="relative z-30 px-6"
        >
          <HeroCopy />
        </motion.div>

        {/* Dashboard que "absorve" os cards e se constrói com eles */}
        <motion.div
          style={{
            opacity: dashOpacity,
            scale: dashScale,
            y: dashY,
            pointerEvents: dashPointer,
          }}
          className="absolute z-10 flex w-full max-w-[920px] flex-col items-center gap-9 px-4"
        >
          {/* LEGENDA DO PLATÔ — centralizada (o CTA fica na navbar fixa) */}
          <p className="font-display text-center text-3xl leading-[1.08] text-balance md:text-[2.75rem]">
            <TextReveal
              play={platoIn}
              segments={[
                "Sua",
                "operação",
                "inteira,",
                <span key="hl" className="text-accent italic">
                  em uma única plataforma.
                </span>,
              ]}
            />
          </p>
          <DashboardMockup progress={progress} registerAnchor={registerAnchor} />
        </motion.div>

        {/* Dica de scroll — mouse com rodinha animada */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 z-30 flex flex-col items-center gap-3 text-muted"
        >
          <span className="text-xs">Role para organizar a operação</span>
          {/* bolinha sempre visível: DESCE rápido (a direção do scroll)
             e SOBE devagar — o ritmo assimétrico aponta para baixo */}
          <span className="flex h-9 w-6 justify-center rounded-full border border-foreground/30 pt-1.5">
            <motion.span
              animate={{ y: [0, 11, 0] }}
              transition={{
                duration: 1.5,
                times: [0, 0.32, 1],
                ease: ["easeOut", "easeInOut"],
                repeat: Infinity,
              }}
              className="size-1.5 rounded-full bg-foreground/70"
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   PALAVRA "BAGUNÇADA" — as letras nascem tortas e desalinhadas
   (como a operação) e balançam de leve, soltas. Ajuste a bagunça
   nos arrays abaixo (um valor por letra).
   ========================================================= */
function MessyWord({ word }: { word: string }) {
  const reduced = useReducedMotion();
  const rotations = [-8, 6, -4, 9, -7, 5, -10, 7, -5, 8];
  const offsets = [2, -4, 3, -2, 4, -3, 2, -5, 3, -2];
  if (reduced) return <>{word}</>;
  return (
    <span aria-label={word} role="text" className="inline-block whitespace-nowrap">
      {word.split("").map((letter, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block text-zinc-500"
          style={{ rotate: rotations[i % rotations.length], y: offsets[i % offsets.length] }}
          animate={{
            rotate: [rotations[i % rotations.length], rotations[i % rotations.length] + 4, rotations[i % rotations.length]],
            y: [offsets[i % offsets.length], offsets[i % offsets.length] - 2, offsets[i % offsets.length]],
          }}
          transition={{
            duration: 2.2 + (i % 4) * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.12,
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

/* ===== TEXTOS DO HERO — ajuste título, subtítulo e CTAs aqui =====
   Entrada GRADATIVA: etiqueta → título → subtítulo → CTAs,
   um depois do outro (ajuste o ritmo em staggerChildren). */
const copyVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};
const copyItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

function HeroCopy() {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={reduced ? undefined : copyVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-3xl text-center"
    >
      <motion.span
        variants={copyItem}
        className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-4 py-1.5 text-xs font-medium tracking-wide text-accent"
      >
        <span className="size-1.5 rounded-full bg-accent" />
        Inteligência Operacional para PMEs
      </motion.span>
      {/* Headline serif com reveal blur-stagger (estilo scale.com).
         "bagunçada" entra desarrumada/cinza; o destaque é serif itálico lime. */}
      <h1 className="font-display mt-7 text-5xl leading-[1.05] text-balance sm:text-6xl md:text-7xl">
        <TextReveal
          trigger="mount"
          delay={0.25}
          segments={[
            "Transforme",
            "operação",
            <MessyWord key="messy" word="bagunçada" />,
            "em",
            <span key="hl" className="text-accent italic">
              inteligência
            </span>,
            <span key="hl2" className="text-accent italic">
              operacional.
            </span>,
          ]}
        />
      </h1>
      <motion.p
        variants={copyItem}
        className="mx-auto mt-6 max-w-2xl text-base text-muted text-pretty md:text-lg"
      >
        Centralize dados, processos, dashboards, automações e IA em uma
        plataforma sob medida para a realidade da sua empresa.
      </motion.p>
      <div className="mt-10 flex justify-center">
        {/* CTA ÚNICO E CENTRALIZADO — troque o href pelo seu link de
           agendamento (ex.: Calendly). Sem CTA secundário: a ideia é a
           pessoa ROLAR para viver a imersão. */}
        <motion.a
          variants={copyItem}
          href="#contato"
          className="rounded-xl bg-accent px-8 py-4 text-sm font-semibold text-background transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          Agendar diagnóstico
        </motion.a>
      </div>
    </motion.div>
  );
}

/* Brilhos decorativos de fundo do hero — com PARALLAX:
   cada camada deriva num ritmo diferente conforme o scroll do
   hero, dando profundidade. `progress` é o progresso da seção. */
function BackgroundGlows({
  progress,
}: {
  progress?: MotionValue<number>;
}) {
  const fallback = useMotionValue(0);
  const p = progress ?? fallback;
  const glow1Y = useTransform(p, [0, 1], [0, -110]);
  const glow2Y = useTransform(p, [0, 1], [0, 120]);
  const gridY = useTransform(p, [0, 1], [0, -45]);

  return (
    <>
      {/* lime bem sutil — só um respiro de cor no fundo carbono */}
      <motion.div
        style={{ y: glow1Y }}
        className="glow left-[-10%] top-[-15%] h-[420px] w-[420px] bg-accent/[0.06]"
      />
      <motion.div
        style={{ y: glow2Y }}
        className="glow bottom-[-20%] right-[-10%] h-[480px] w-[480px] bg-accent/[0.04]"
      />
      {/* grade de pontos — deriva devagar */}
      <motion.div
        style={{
          y: gridY,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
        aria-hidden
        className="absolute inset-[-12%] opacity-[0.3]"
      />
    </>
  );
}
