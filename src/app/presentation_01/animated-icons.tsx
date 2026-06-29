"use client";

/* =========================================================
   ÍCONES ANIMADOS SOB MEDIDA

   Cada ícone anima a PRÓPRIA forma pra ilustrar o conceito:
   - SearchScan : a lupa varre, procurando algo
   - EyeSlash   : o traço sobre o olho encolhe e cresce (cego)
   - ScaleWobble: a balança desequilibra de um lado pro outro
   - ReceiptFly : o pedido "voa" e some (escapa)
   - BoxesPulse : caixa com indicador "ao vivo" pulsando
   - CoinsFly   : moedas/valores sobem (dinheiro entrando)
   - BellRing   : o sino balança e emite ondas (notificação)
   - TrendUp    : a linha de crescimento se desenha pra cima
   - ServerPulse: luz de atividade do servidor piscando
   - ShieldCheck: o escudo e o "check" se desenham (seguro)
   - ClockTick  : o ponteiro varre o relógio (no tempo certo)

   Traço fino estilo lucide (currentColor herda a cor da caixa).
   Respeita "reduzir movimento": sem animação, só a forma.
   ========================================================= */

import { motion, useReducedMotion } from "framer-motion";

type P = { className?: string };

/* casca svg com os atributos de traço herdados pelos filhos */
function Svg({ children, className }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const loop = (duration: number, extra: object = {}) => ({
  duration,
  repeat: Infinity,
  ease: "easeInOut" as const,
  ...extra,
});

/* ---------- lupa que varre ---------- */
export function SearchScan({ className }: P) {
  const r = useReducedMotion();
  return (
    <Svg className={className}>
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "11px 11px" }}
        animate={r ? undefined : { x: [0, 2.6, -1.6, 1.4, 0], y: [0, -1.6, 1.8, -1, 0] }}
        transition={loop(3.2)}
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="16" y1="16" x2="21" y2="21" />
      </motion.g>
    </Svg>
  );
}

/* ---------- olho com traço que encolhe e cresce ---------- */
export function EyeSlash({ className }: P) {
  const r = useReducedMotion();
  return (
    <Svg className={className}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      <motion.line
        x1="3"
        y1="3"
        x2="21"
        y2="21"
        initial={{ pathLength: 0.08 }}
        animate={r ? undefined : { pathLength: [0.08, 1, 0.08] }}
        transition={loop(2.2)}
      />
    </Svg>
  );
}

/* ---------- balança desequilibrando ---------- */
export function ScaleWobble({ className }: P) {
  const r = useReducedMotion();
  return (
    <Svg className={className}>
      <path d="M12 5v15" />
      <path d="M8 20h8" />
      <circle cx="12" cy="4" r="1.3" />
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "12px 6px" }}
        animate={r ? undefined : { rotate: [-8, 8, -8] }}
        transition={loop(2.6)}
      >
        <path d="M4 6h16" />
        <path d="M4 6l-2.2 4h4.4Z" />
        <path d="M20 6l-2.2 4h4.4Z" />
      </motion.g>
    </Svg>
  );
}

/* ---------- pedido/nota que voa e some ---------- */
export function ReceiptFly({ className }: P) {
  const r = useReducedMotion();
  return (
    <Svg className={className}>
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "12px 12px" }}
        animate={
          r
            ? undefined
            : { x: [0, 0, 8], y: [0, 0, -9], rotate: [0, 0, 16], opacity: [0, 1, 1, 0] }
        }
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeIn",
          times: [0, 0.15, 0.6, 1],
        }}
      >
        <path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1V3l-2 1-2-1-2 1-2-1-2 1Z" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </motion.g>
    </Svg>
  );
}

/* ---------- caixa com indicador "ao vivo" ---------- */
export function BoxesPulse({ className }: P) {
  const r = useReducedMotion();
  return (
    <Svg className={className}>
      <path d="M3 8l9-4 9 4-9 4-9-4Z" />
      <path d="M3 8v8l9 4 9-4V8" />
      <path d="M12 12v8" />
      <motion.circle
        cx="19"
        cy="5.5"
        r="2"
        fill="currentColor"
        stroke="none"
        style={{ transformBox: "view-box", transformOrigin: "19px 5.5px" }}
        animate={r ? undefined : { opacity: [1, 0.25, 1], scale: [1, 1.5, 1] }}
        transition={loop(1.6)}
      />
    </Svg>
  );
}

/* ---------- moedas subindo (dinheiro entrando) ---------- */
export function CoinsFly({ className }: P) {
  const r = useReducedMotion();
  return (
    <Svg className={className}>
      {/* pilha de moedas */}
      <ellipse cx="12" cy="18.5" rx="6" ry="2.2" />
      <path d="M6 18.5v-2.5" />
      <path d="M18 18.5v-2.5" />
      <ellipse cx="12" cy="16" rx="6" ry="2.2" />
      {/* moedas voando pra cima */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={7.5 + i * 4.5}
          cy="12"
          r="1.5"
          fill="currentColor"
          stroke="none"
          animate={r ? undefined : { cy: [12, 3], opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: i * 0.55 }}
        />
      ))}
    </Svg>
  );
}

/* ---------- sino tocando com ondas ---------- */
export function BellRing({ className }: P) {
  const r = useReducedMotion();
  return (
    <Svg className={className}>
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "12px 4px" }}
        animate={r ? undefined : { rotate: [0, 11, -11, 8, -5, 0] }}
        transition={loop(2.2, { repeatDelay: 0.5, ease: "easeInOut" })}
      >
        <path d="M6.5 16V11a5.5 5.5 0 0 1 11 0v5l1.5 2.2H5L6.5 16Z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </motion.g>
      <motion.path
        d="M19.5 6.5c1.4 1.4 1.4 5.1 0 6.5"
        animate={r ? undefined : { opacity: [0, 1, 0] }}
        transition={loop(2.2, { repeatDelay: 0.5 })}
      />
      <motion.path
        d="M4.5 6.5c-1.4 1.4-1.4 5.1 0 6.5"
        animate={r ? undefined : { opacity: [0, 1, 0] }}
        transition={loop(2.2, { repeatDelay: 0.5 })}
      />
    </Svg>
  );
}

/* ---------- linha de crescimento se desenhando ---------- */
export function TrendUp({ className }: P) {
  const r = useReducedMotion();
  return (
    <Svg className={className}>
      <motion.polyline
        points="3 17 9 11 13 15 21 7"
        initial={{ pathLength: 0.15 }}
        animate={r ? undefined : { pathLength: [0.15, 1, 0.15] }}
        transition={loop(2.6)}
      />
      <motion.polyline
        points="15 7 21 7 21 13"
        initial={{ opacity: 0.3 }}
        animate={r ? undefined : { opacity: [0.3, 1, 0.3] }}
        transition={loop(2.6)}
      />
    </Svg>
  );
}

/* ---------- servidor com luz de atividade ---------- */
export function ServerPulse({ className }: P) {
  const r = useReducedMotion();
  return (
    <Svg className={className}>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <motion.circle
        cx="7"
        cy="7.5"
        r="1.1"
        fill="currentColor"
        stroke="none"
        animate={r ? undefined : { opacity: [1, 0.2, 1] }}
        transition={loop(1.2)}
      />
      <motion.circle
        cx="7"
        cy="16.5"
        r="1.1"
        fill="currentColor"
        stroke="none"
        animate={r ? undefined : { opacity: [0.2, 1, 0.2] }}
        transition={loop(1.2)}
      />
    </Svg>
  );
}

/* ---------- escudo + check se desenhando (seguro) ---------- */
export function ShieldCheck({ className }: P) {
  const r = useReducedMotion();
  return (
    <Svg className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" />
      <motion.polyline
        points="8.5 12 11 14.5 15.5 9.5"
        initial={{ pathLength: 0 }}
        animate={r ? undefined : { pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.8, 1] }}
      />
    </Svg>
  );
}

/* ---------- relógio com ponteiro varrendo ---------- */
export function ClockTick({ className }: P) {
  const r = useReducedMotion();
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      {/* ponteiro dos minutos: varre o relógio */}
      <motion.line
        x1="12"
        y1="12"
        x2="12"
        y2="6.5"
        style={{ transformBox: "view-box", transformOrigin: "12px 12px" }}
        animate={r ? undefined : { rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      {/* ponteiro das horas: fixo */}
      <line x1="12" y1="12" x2="15.5" y2="13.5" />
    </Svg>
  );
}
