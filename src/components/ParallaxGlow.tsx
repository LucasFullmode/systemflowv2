"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/* =========================================================
   PARALLAX GLOW — brilho decorativo que DERIVA com o scroll,
   criando profundidade (camada de fundo se move mais devagar
   que o conteúdo). Use no lugar de um `<div className="glow">`.

   `shift` = quanto ele desloca no eixo Y (px) ao longo do scroll.
   ========================================================= */
export default function ParallaxGlow({
  className,
  shift = -120,
}: {
  className?: string;
  shift?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, shift]);
  const y = useSpring(yRaw, { stiffness: 60, damping: 20, mass: 0.5 });

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={reduced ? undefined : { y }}
      className={`glow ${className ?? ""}`}
    />
  );
}
