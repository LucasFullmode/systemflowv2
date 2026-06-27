"use client";

import { motion } from "framer-motion";

/* ===== TOPO — apenas a MARCA (wordmark).
   Sem links nem CTA: a navegação é a própria rolagem (imersão).
   Troque o texto da marca e a fonte (.font-brand, em globals.css). ===== */
export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center"
    >
      {/* NOTCH: cápsula presa ao topo (cantos arredondados embaixo) com
         fundo + blur, pra marca não perder leitura sobre o conteúdo */}
      <a
        href="#"
        className="font-brand rounded-b-2xl border border-t-0 border-white/10 bg-background/80 px-6 py-3 text-base font-bold tracking-tight text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md"
      >
        System<span className="text-accent">Flow</span>
      </a>
    </motion.header>
  );
}
