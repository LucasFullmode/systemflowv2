"use client";

import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/* =========================================================
   TEXT REVEAL — entrada de texto estilo scale.com

   Cada palavra sobe de um leve DESFOQUE até ficar nítida, e
   MUDA DE COR durante a transição: entra em lime (accent) e
   resolve para a cor final do texto. Stagger entre palavras.

   Uso:
   - Texto simples:   <TextReveal text="Sua frase aqui" />
   - Conteúdo misto:  <TextReveal segments={[<b/>, "palavra", ...]} />
   - `trigger`: "mount" (anima ao carregar) ou "view" (ao rolar)
   - `play`: controle externo (true = mostra, false = esconde) —
     ignora trigger; usado p/ disparar no scroll de seções sticky.

   Ajuste ritmo/cores em STAGGER / DURATION / FROM_COLOR / TO_COLOR.
   ========================================================= */
const STAGGER = 0.07; // atraso entre palavras
const DURATION = 0.85; // duração de cada palavra (lento = premium)
const EASE = [0.22, 1, 0.36, 1] as const; // ease-out suave
const FROM_COLOR = "#c6ff34"; // lime — cor de entrada (padrão)
const TO_COLOR = "#ededed"; // off-white — cor final (= --foreground)

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: STAGGER, delayChildren: 0.05 },
  },
};

/* gera as variants da palavra com as cores escolhidas (padrão lime→off-white;
   em fundos claros como a faixa lime, passe cores escuras) */
const makeWordVariants = (from: string, to: string): Variants => ({
  hidden: { opacity: 0, y: "0.5em", filter: "blur(10px)", color: from },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    color: to,
    transition: {
      duration: DURATION,
      ease: EASE,
      // a cor resolve um pouco depois do movimento (a "virada" fica visível)
      color: { duration: DURATION * 1.1, ease: "easeInOut" },
    },
  },
});

type Props = {
  text?: string;
  /** Conteúdo misto (cada item vira uma "palavra" animada) */
  segments?: ReactNode[];
  /** "mount" anima já; "view" anima ao entrar na tela */
  trigger?: "mount" | "view";
  /** controle externo: true = show, false = hidden (ignora trigger) */
  play?: boolean;
  /** atraso inicial extra (s) */
  delay?: number;
  className?: string;
  /** classe aplicada a cada palavra (raro) */
  wordClassName?: string;
  /** cores da "virada" (padrão lime→off-white) */
  fromColor?: string;
  toColor?: string;
};

export default function TextReveal({
  text,
  segments,
  trigger = "view",
  play,
  delay = 0,
  className,
  wordClassName,
  fromColor = FROM_COLOR,
  toColor = TO_COLOR,
}: Props) {
  const reduced = useReducedMotion();
  const items: ReactNode[] = segments ?? (text ? text.split(" ") : []);
  const wordVariants = makeWordVariants(fromColor, toColor);

  // Sem movimento: renderiza o texto direto (acessível, sem blur/cor)
  if (reduced) {
    return (
      <span className={className}>
        {items.map((seg, i) => (
          <Fragment key={i}>
            {seg}
            {i < items.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
    );
  }

  let motionProps;
  if (play !== undefined) {
    motionProps = { initial: "hidden" as const, animate: play ? "show" : "hidden" };
  } else if (trigger === "mount") {
    motionProps = { initial: "hidden" as const, animate: "show" as const };
  } else {
    motionProps = {
      initial: "hidden" as const,
      whileInView: "show" as const,
      viewport: { once: false, margin: "-80px" },
    };
  }

  return (
    <motion.span
      className={className}
      variants={container}
      transition={{ delayChildren: delay }}
      {...motionProps}
    >
      {items.map((seg, i) => (
        <Fragment key={i}>
          <motion.span
            variants={wordVariants}
            className={`inline-block will-change-[transform,filter] ${wordClassName ?? ""}`}
          >
            {seg}
          </motion.span>
          {i < items.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </motion.span>
  );
}
