"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Tilt from "./Tilt";

/* ===== CTA FINAL — ajuste texto, garantias e link do botão aqui =====

   Glow up seguindo as diretrizes do ui-ux-pro-max: CTA único e
   contrastante, no máximo 3 bullets de garantia, brilho no hover.
   Entrada em CASCATA: badge → título → texto → botão → garantias. */

const REASSURANCES = [
  "Diagnóstico sob medida",
  "Roadmap priorizado por impacto",
  "Presencial ou online",
];

const ctaStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const ctaItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function FinalCTA() {
  const reduced = useReducedMotion();

  return (
    <section id="contato" className="relative mx-auto max-w-5xl px-6 py-24 md:py-32">
      {/* Tilt: leve profundidade faux-3D no momento de fechamento */}
      <Tilt max={5} className="rounded-3xl">
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.93, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl bg-gradient-to-br from-accent/30 via-white/10 to-accent/20 p-px"
      >
        <motion.div
          variants={reduced ? undefined : ctaStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-100px" }}
          className="relative overflow-hidden rounded-[23px] bg-surface/95 px-8 py-16 text-center md:px-16 md:py-20"
        >
          {/* Feixe cônico girando devagar ao fundo */}
          {!reduced && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute top-1/2 left-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 opacity-25"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, var(--accent) 40deg, transparent 90deg, transparent 180deg, var(--accent-2) 220deg, transparent 270deg)",
                filter: "blur(60px)",
              }}
              aria-hidden
            />
          )}
          {/* Brilhos internos pulsando devagar */}
          <motion.div
            animate={reduced ? undefined : { opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="glow left-[-15%] top-[-40%] h-[300px] w-[300px] bg-accent/15"
          />
          <motion.div
            animate={reduced ? undefined : { opacity: [0.9, 0.5, 0.9] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="glow bottom-[-40%] right-[-15%] h-[300px] w-[300px] bg-accent-2/15"
          />

          <motion.span
            variants={ctaItem}
            className="glass relative inline-block rounded-full px-4 py-1.5 text-xs font-semibold text-accent"
          >
            O próximo passo
          </motion.span>

          <motion.h2
            variants={ctaItem}
            className="font-display relative mt-6 text-4xl leading-[1.1] text-balance md:text-5xl"
          >
            Sua empresa não precisa de mais uma planilha.
            <br className="hidden md:block" /> Precisa de uma{" "}
            <span className="text-accent italic">operação inteligente</span>.
          </motion.h2>
          <motion.p
            variants={ctaItem}
            className="relative mx-auto mt-5 max-w-xl text-muted text-pretty"
          >
            Vamos olhar a sua operação juntos e mapear, na prática, onde dá para
            ganhar tempo e clareza com dados, automação e IA.
          </motion.p>

          {/* Troque o href pelo seu link de agendamento (ex.: Calendly ou WhatsApp) */}
          <motion.a
            variants={ctaItem}
            href="mailto:contato@iaconsulting.com.br"
            whileHover={reduced ? undefined : { scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative mt-10 inline-flex items-center gap-2 overflow-hidden rounded-xl bg-accent px-8 py-4 text-sm font-semibold text-background shadow-[0_8px_32px_rgba(198,255,52,0.28)]"
          >
            {/* varredura de brilho no hover */}
            <span
              className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 opacity-0 blur-sm transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
              aria-hidden
            />
            Agendar conversa
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </motion.a>

          {/* Garantias (máx. 3, conforme diretriz) — entram por último, uma a uma */}
          <motion.ul
            variants={reduced ? undefined : ctaStagger}
            className="relative mt-8 flex flex-col items-center justify-center gap-3 text-xs text-muted sm:flex-row sm:gap-7"
          >
            {REASSURANCES.map((item) => (
              <motion.li key={item} variants={ctaItem} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-accent-2" aria-hidden />
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>
      </Tilt>
    </section>
  );
}
