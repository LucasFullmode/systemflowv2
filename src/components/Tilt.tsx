"use client";

import { type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/* =========================================================
   TILT — faux-3D: o elemento inclina de leve seguindo o cursor,
   dando sensação de profundidade SEM WebGL (leve e performático).

   `max` = inclinação máxima em graus. `glare` adiciona um reflexo
   sutil que acompanha o mouse. Em "reduzir movimento", fica chapado.
   ========================================================= */
export default function Tilt({
  children,
  max = 7,
  glare = true,
  className,
}: {
  children: ReactNode;
  max?: number;
  glare?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 18 });
  const sy = useSpring(py, { stiffness: 150, damping: 18 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);
  // computado sempre (regras de hooks) — só usado quando glare/!reduced
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.16), transparent 45%)`
  );

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={{ perspective: 1100 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-[inherit]"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
