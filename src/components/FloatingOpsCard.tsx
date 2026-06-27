"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  motion,
  useTransform,
  transform,
  type MotionValue,
} from "framer-motion";
import type { OpsCardConfig } from "@/lib/ops-cards";

type Props = {
  card: OpsCardConfig;
  /** Progresso do scroll do hero (0 = topo, 1 = fim da seção sticky) */
  progress: MotionValue<number>;
  /** Contêiner sticky do hero (referência de coordenadas) */
  containerRef: RefObject<HTMLDivElement | null>;
  /** Âncoras registradas pelo DashboardMockup (nome → elemento) */
  anchors: RefObject<Map<string, HTMLElement>>;
};

/* =========================================================
   VELOCIDADE DA ANIMAÇÃO — ajuste aqui.

   Cada card converge entre CONVERGE_START e CONVERGE_END do
   scroll, deslocado pelo `delay` individual do card. Os delays
   em lib/ops-cards.ts estão sincronizados com o BUILD do
   DashboardMockup: o card pousa na âncora na hora exata em que
   aquele módulo "acende" — Jurídico vira a aba Jurídico, Metas
   viram os KPIs, Indicadores viram o gráfico etc.
   ========================================================= */
/* Cards começam a se mexer JUNTO com o fade do título (não depois) */
const CONVERGE_START = 0.04;
const CONVERGE_END = 0.46;
const STAGGER = 0.2; // quanto o `delay` de cada card espalha o movimento

/* Posição acumulada de um elemento dentro de um ancestral,
   via offsets de layout — imune a transforms em andamento. */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

export default function FloatingOpsCard({
  card,
  progress,
  containerRef,
  anchors,
}: Props) {
  const start = CONVERGE_START + card.delay * STAGGER;
  const end = CONVERGE_END + card.delay * STAGGER;

  const selfRef = useRef<HTMLDivElement>(null);
  /* Vetor até o centro da âncora de destino (px). Medido no layout
     real — recalculado em resize. Null = ainda sem medida. */
  const delta = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const self = selfRef.current;
      if (!container || !self) return;

      // Âncora do alvo; se estiver oculta (ex.: sidebar no mobile),
      // cai para o centro do dashboard.
      let target = anchors.current?.get(card.target);
      if (!target || target.offsetWidth === 0) {
        target = anchors.current?.get("dashboard");
      }
      if (!target || target.offsetWidth === 0) {
        delta.current = null;
        return;
      }

      const t = offsetWithin(target, container);
      const s = offsetWithin(self, container);
      delta.current = {
        x: t.x + target.offsetWidth / 2 - (s.x + self.offsetWidth / 2),
        y: t.y + target.offsetHeight / 2 - (s.y + self.offsetHeight / 2),
      };
    };

    measure();
    // re-mede depois de fontes/layout assentarem
    const settle = window.setTimeout(measure, 400);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", measure);
    };
  }, [card.target, containerRef, anchors]);

  /* Trajetória: 0 → centro exato da âncora (lido do delta medido). */
  const fraction = transform([start, end], [0, 1]);
  const x = useTransform(progress, (v) => fraction(v) * (delta.current?.x ?? 0));
  const y = useTransform(progress, (v) => fraction(v) * (delta.current?.y ?? 0));

  // Encolhe até ~tamanho de uma linha do dashboard e gira até zerar
  const scale = useTransform(progress, [start, end], [1, 0.32]);
  const rotate = useTransform(progress, [start, end], [card.rotate, 0]);
  /* O card some exatamente quando o módulo de destino acende.
     Forma de função (via `transform`) evita a promoção para
     ScrollTimeline nativo, bugada dentro de seções sticky. */
  const opacity = useTransform(
    progress,
    transform([start, end - 0.05, end], [1, 0.95, 0])
  );
  // Card invisível não deve capturar o mouse sobre o dashboard
  const pointerEvents = useTransform(progress, (v) =>
    v > end ? ("none" as const) : ("auto" as const)
  );

  /* Posição inicial responsiva: leftM/topM no mobile, left/top no md+.
     Vai por CSS vars para o Tailwind trocar no breakpoint. */
  const positionVars = {
    "--card-l": `${card.leftM ?? card.left}%`,
    "--card-t": `${card.topM ?? card.top}%`,
    "--card-l-md": `${card.left}%`,
    "--card-t-md": `${card.top}%`,
  } as Record<string, string>;

  return (
    <motion.div
      ref={selfRef}
      className={`absolute z-20 left-[var(--card-l)] top-[var(--card-t)] md:left-[var(--card-l-md)] md:top-[var(--card-t-md)] ${
        card.desktopOnly ? "hidden md:block" : ""
      }`}
      style={{
        ...positionVars,
        x,
        y,
        scale,
        rotate,
        opacity,
        pointerEvents,
      }}
    >
      {/* HOVER — highlight + leve flutuada; ajuste o spring aqui */}
      <motion.div
        whileHover={{ scale: 1.06, y: -5 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Flutuação suave contínua (independente do scroll) */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 4 + card.delay * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: card.delay,
          }}
          className="glass flex items-center gap-2.5 rounded-2xl px-4 py-3 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-[0_0_28px_rgba(198,255,52,0.18)]"
        >
          {/* Ícone sem caixa, com a cor da área (definida em ops-cards.ts) */}
          <card.icon className={`size-4.5 shrink-0 ${card.color}`} aria-hidden />

          <span className="whitespace-nowrap text-sm font-medium text-foreground/90">
            {card.label}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
