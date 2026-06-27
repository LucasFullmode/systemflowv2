"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  transform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  Search,
  Map,
  Lightbulb,
  Rocket,
  Compass,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

/* ===== TRANSFORMAÇÃO — ajuste os textos da imersão aqui ===== */
const PILLARS = [
  {
    icon: Search,
    title: "Imersão na operação",
    description:
      "Entramos no dia a dia da empresa: acompanhamos rotinas, conversamos com a equipe e entendemos como o trabalho realmente acontece.",
  },
  {
    icon: Map,
    title: "Mapeamento completo",
    description:
      "Mapeamos onde estão os dados, quem faz o quê, onde o processo trava e o que é refeito manualmente todos os dias.",
  },
  {
    icon: Lightbulb,
    title: "Oportunidades identificadas",
    description:
      "Para cada gargalo, identificamos a solução certa: sistema interno, dashboard, automação ou IA — sem tecnologia pela tecnologia.",
  },
  {
    icon: Rocket,
    title: "Plano de ação priorizado",
    description:
      "Você recebe um roadmap claro, priorizado por impacto no negócio, com o que construir primeiro e por quê.",
  },
];

/* =========================================================
   NARRATIVA DA SEÇÃO (guiada pelo scroll, nos dois sentidos):

   1. 0.00–0.45 : os 4 pilares da imersão entram em sequência
   2. 0.30–0.62 : linhas de convergência são DESENHADAS dos
                  pilares para um ponto único (funil)
   3. 0.50–0.85 : no ponto de encontro, um RASCUNHO tracejado
                  (wireframe) vira a plataforma de verdade —
                  é da imersão que a plataforma nasce
   4. 0.82–1.00 : legenda + seta apontando para a seção
                  "A plataforma", logo abaixo
   ========================================================= */

function ScrollPillar({
  pillar,
  index,
  progress,
  reduced,
}: {
  pillar: { icon: LucideIcon; title: string; description: string };
  index: number;
  progress: MotionValue<number>;
  reduced: boolean | null;
}) {
  const start = index * 0.08;
  const end = start + 0.22;
  const fromLeft = index % 2 === 0;

  const opacity = useTransform(progress, transform([start, end], [0, 1]));
  const x = useTransform(progress, transform([start, end], [fromLeft ? -70 : 70, 0]));
  const y = useTransform(progress, transform([start, end], [36, 0]));

  return (
    <motion.article
      style={reduced ? undefined : { opacity, x, y }}
      className="group relative flex h-full gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 transition-colors duration-300 hover:border-white/15 hover:bg-white/[0.03]"
    >
      {/* HOVER: linha lime só no TOPO, varre da esquerda */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
      <span className="grid size-9 shrink-0 place-items-center text-accent">
        <pillar.icon className="size-6" aria-hidden strokeWidth={1.5} />
      </span>
      <div>
        <h3 className="font-semibold">{pillar.title}</h3>
        <p className="mt-2 text-sm text-muted">{pillar.description}</p>
      </div>
    </motion.article>
  );
}

/* Linha do funil: sai de um pilar e converge ao ponto central,
   desenhada conforme o scroll (efeito "os pontos se ligam e formam
   a plataforma"). */
function FunnelPath({
  d,
  index,
  progress,
  reduced,
}: {
  d: string;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean | null;
}) {
  const pathLength = useTransform(
    progress,
    transform([0.32 + index * 0.05, 0.6 + index * 0.05], [0, 1])
  );
  return (
    <motion.path
      d={d}
      stroke="url(#funnel-grad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      style={reduced ? { pathLength: 1 } : { pathLength }}
    />
  );
}

/* Bloco interno da mini-plataforma que nasce num trecho do scroll */
function Born({
  progress,
  range,
  reduced,
  className,
  children,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number];
  reduced: boolean | null;
  className?: string;
  children?: React.ReactNode;
}) {
  const opacity = useTransform(progress, transform([...range], [0, 1]));
  const y = useTransform(progress, transform([...range], [8, 0]));
  return (
    <motion.div style={reduced ? undefined : { opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

export default function TransformationSection() {
  const reduced = useReducedMotion();
  const flowRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: flowRef,
    offset: ["start 0.85", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  /* Sequência de formação: funil converge → BLUEPRINT (rascunho
     tracejado) aparece → se transforma na janela real. */
  const wireOpacity = useTransform(progress, transform([0.5, 0.6, 0.74, 0.82], [0, 1, 1, 0]));
  const windowOpacity = useTransform(progress, transform([0.72, 0.86], [0, 1]));
  const windowY = useTransform(progress, transform([0.72, 0.9], [18, 0]));

  return (
    <section
      id="transformacao"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          icon={Compass}
          eyebrow="A transformação"
          title="Antes de construir qualquer coisa, entendemos a sua operação."
          description="Não chegamos com um software pronto. A imersão revela onde tecnologia gera resultado de verdade — e é dela que a plataforma nasce."
        />

        <div ref={flowRef} className="mx-auto mt-14 max-w-4xl">
          {/* 1. Pilares da imersão */}
          <div className="relative z-10 grid gap-4 sm:grid-cols-2">
            {PILLARS.map((pillar, i) => (
              <ScrollPillar
                key={pillar.title}
                pillar={pillar}
                index={i}
                progress={progress}
                reduced={reduced}
              />
            ))}
          </div>

          {/* 2. Funil: as linhas saem dos pilares e CONVERGEM num ponto
             (os pontos se ligam e formam a plataforma) */}
          <svg
            viewBox="0 0 600 110"
            className="mx-auto h-16 w-full max-w-3xl md:h-24"
            fill="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="funnel-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {[
              "M 80 0 C 80 70, 300 45, 300 105",
              "M 225 0 C 225 60, 300 55, 300 105",
              "M 375 0 C 375 60, 300 55, 300 105",
              "M 520 0 C 520 70, 300 45, 300 105",
            ].map((d, i) => (
              <FunnelPath key={i} d={d} index={i} progress={progress} reduced={reduced} />
            ))}
          </svg>

          {/* 3. Blueprint → janela: o rascunho tracejado aparece e se
             transforma na plataforma real, no ponto de convergência */}
          <div className="relative mx-auto mt-2 w-full max-w-md">
            {/* BLUEPRINT (rascunho tracejado) — fade out quando a janela entra */}
            <motion.div
              style={reduced ? { opacity: 0 } : { opacity: wireOpacity }}
              className="absolute inset-0 rounded-2xl border border-dashed border-accent/50 p-4"
              aria-hidden
            >
              <div className="h-5 w-28 rounded border border-dashed border-accent/40" />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-10 rounded border border-dashed border-accent/35" />
                ))}
              </div>
              <div className="mt-3 h-16 rounded border border-dashed border-accent/35" />
            </motion.div>

            {/* JANELA REAL */}
            <motion.div
              style={reduced ? undefined : { opacity: windowOpacity, y: windowY }}
              className="glass relative rounded-2xl p-4"
            >
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-rose-400/70" />
                <span className="size-2 rounded-full bg-amber-400/70" />
                <span className="size-2 rounded-full bg-emerald-400/70" />
                <span className="ml-2 text-[10px] font-medium text-muted">
                  Sua plataforma — sob medida
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  ["Vendas", "R$ 48,2k"],
                  ["Metas", "82%"],
                  ["Fila", "-18%"],
                ].map(([label, value], i) => (
                  <Born
                    key={label}
                    progress={progress}
                    range={[0.82 + i * 0.03, 0.9 + i * 0.03]}
                    reduced={reduced}
                    className="rounded-lg bg-white/4 p-2.5"
                  >
                    <p className="text-[9px] text-muted">{label}</p>
                    <p className="text-xs font-semibold">{value}</p>
                  </Born>
                ))}
              </div>
              <Born
                progress={progress}
                range={[0.9, 0.97]}
                reduced={reduced}
                className="mt-2 flex h-14 items-end gap-1 rounded-lg bg-white/4 p-2"
              >
                {[40, 55, 48, 66, 60, 78, 72, 90].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 rounded-t-[2px] bg-gradient-to-t from-accent/30 to-accent"
                  />
                ))}
              </Born>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
