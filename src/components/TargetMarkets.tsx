"use client";

import type { ComponentType, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Stethoscope,
  GraduationCap,
  Pill,
  Building2,
  Calculator,
  Store,
  PackageSearch,
  Briefcase,
  Factory,
  ArrowRight,
  Check,
  Users,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

/* =========================================================
   VINHETAS POR SETOR — como em "O problema": cada nicho tem
   uma micro-cena animada ligada ao universo dele (batimento,
   chapéu jogado, comprimidos caindo, janelas acendendo...).
   Loops sutis e contínuos; estáticos com "reduzir movimento".
   ========================================================= */

/** Ícone SEM caixa (mantém tamanho p/ ancorar os acessórios animados) */
function Tile({ children }: { children: ReactNode }) {
  return (
    <span className="relative grid size-9 place-items-center text-accent">
      {children}
    </span>
  );
}

/* Clínicas: batimento cardíaco + pulso vital */
function ArtClinicas() {
  const reduced = useReducedMotion();
  return (
    <Tile>
      <motion.span
        animate={reduced ? undefined : { scale: [1, 1.14, 1, 1.1, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="grid place-items-center"
      >
        <Stethoscope className="size-5" aria-hidden />
      </motion.span>
      {!reduced && (
        <span className="absolute -top-1 -right-1 grid size-2.5 place-items-center">
          <span className="absolute size-2.5 animate-ping rounded-full bg-accent-2/50" />
          <span className="size-1.5 rounded-full bg-accent-2" />
        </span>
      )}
    </Tile>
  );
}

/* Escolas: chapéu jogado para o alto na formatura */
function ArtEscolas() {
  const reduced = useReducedMotion();
  return (
    <Tile>
      <motion.span
        animate={reduced ? undefined : { y: [0, -5, 0], rotate: [0, -14, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="grid place-items-center"
      >
        <GraduationCap className="size-5" aria-hidden />
      </motion.span>
      {!reduced && (
        <motion.span
          className="absolute -top-1 right-0 size-1 rounded-full bg-accent-2"
          animate={{ y: [2, -7], opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
          aria-hidden
        />
      )}
    </Tile>
  );
}

/* Farmácias: cápsula virando + comprimidos caindo no vidro */
function ArtFarmacias() {
  const reduced = useReducedMotion();
  return (
    <Tile>
      <motion.span
        animate={reduced ? undefined : { rotate: [0, 180, 180, 360] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.35, 0.65, 1] }}
        className="grid place-items-center"
      >
        <Pill className="size-5" aria-hidden />
      </motion.span>
      {!reduced &&
        [0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute -right-1.5 size-1 rounded-full bg-accent-2/80"
            style={{ top: 4 + i * 5 }}
            animate={{ y: [0, 12], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.7, ease: "easeIn" }}
            aria-hidden
          />
        ))}
    </Tile>
  );
}

/* Imobiliárias: janelas do prédio acendendo uma a uma */
function ArtImobiliarias() {
  const reduced = useReducedMotion();
  return (
    <Tile>
      <Building2 className="size-5" aria-hidden />
      {!reduced &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute size-[3px] rounded-[1px] bg-accent-2"
            style={{ left: 13 + (i % 2) * 6, top: 13 + Math.floor(i / 2) * 6 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
            aria-hidden
          />
        ))}
    </Tile>
  );
}

/* Contabilidades: o "%" subindo da calculadora */
function ArtContabilidades() {
  const reduced = useReducedMotion();
  return (
    <Tile>
      <motion.span
        animate={reduced ? undefined : { rotate: [0, -4, 4, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="grid place-items-center"
      >
        <Calculator className="size-5" aria-hidden />
      </motion.span>
      {!reduced && (
        <motion.span
          className="absolute -top-1.5 right-0 text-[10px] font-bold text-accent-2"
          animate={{ y: [4, -7], opacity: [0, 1, 0], scale: [0.7, 1.1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          aria-hidden
        >
          %
        </motion.span>
      )}
    </Tile>
  );
}

/* Varejo: etiqueta de promoção pipocando na vitrine */
function ArtVarejo() {
  const reduced = useReducedMotion();
  return (
    <Tile>
      <motion.span
        animate={reduced ? undefined : { scale: [1, 1.07, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="grid place-items-center"
      >
        <Store className="size-5" aria-hidden />
      </motion.span>
      {!reduced && (
        <motion.span
          className="absolute -top-2 -right-2 rounded-full bg-accent-2 px-1 text-[7px] font-bold text-background"
          animate={{ scale: [0, 1.1, 1, 1, 0], rotate: [12, 12, 12, 12, 12] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.12, 0.2, 0.85, 1] }}
          aria-hidden
        >
          -20%
        </motion.span>
      )}
    </Tile>
  );
}

/* Distribuidoras: pacote rodando em rota sobre a estrada tracejada */
function ArtDistribuidoras() {
  const reduced = useReducedMotion();
  return (
    <Tile>
      <motion.span
        animate={reduced ? undefined : { x: [-3, 3, -3] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="grid place-items-center"
      >
        <PackageSearch className="size-5" aria-hidden />
      </motion.span>
    </Tile>
  );
}

/* Serviços: a proposta aprovada — check pipoca sobre a maleta */
function ArtServicos() {
  const reduced = useReducedMotion();
  return (
    <Tile>
      <motion.span
        animate={reduced ? undefined : { rotate: [0, 6, -4, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="grid place-items-center"
      >
        <Briefcase className="size-5" aria-hidden />
      </motion.span>
      {!reduced && (
        <motion.span
          className="absolute -top-1.5 -right-1.5 grid size-3.5 place-items-center rounded-full bg-accent-2 text-background"
          animate={{ scale: [0, 1.15, 1, 1, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.15, 0.22, 0.85, 1], delay: 0.5 }}
          aria-hidden
        >
          <Check className="size-2" />
        </motion.span>
      )}
    </Tile>
  );
}

/* ===== SEGMENTOS — ajuste nichos, descritores e vinhetas aqui ===== */
const MARKETS: Array<{ Art: ComponentType; label: string; detail: string }> = [
  { Art: ArtClinicas, label: "Clínicas", detail: "agenda, prontuários e convênios" },
  { Art: ArtEscolas, label: "Escolas e cursos", detail: "matrículas, turmas e mensalidades" },
  { Art: ArtFarmacias, label: "Farmácias", detail: "estoque, validades e balcão" },
  { Art: ArtImobiliarias, label: "Imobiliárias", detail: "carteira de imóveis e contratos" },
  { Art: ArtContabilidades, label: "Contabilidades", detail: "prazos, obrigações e clientes" },
  { Art: ArtVarejo, label: "Redes de varejo", detail: "vendas e estoque por loja" },
  { Art: ArtDistribuidoras, label: "Distribuidoras", detail: "pedidos, rotas e fornecedores" },
  { Art: ArtServicos, label: "Empresas de serviço", detail: "propostas, projetos e equipes" },
];

export default function TargetMarkets() {
  const reduced = useReducedMotion();

  return (
    <section id="para-quem" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        icon={Users}
        eyebrow="Para quem é"
        title="Feito para empresas que cresceram mais rápido que os processos."
        description="Reconhece a sua operação em algum destes cenários?"
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MARKETS.map((market, i) => (
          <motion.article
            key={market.label}
            initial={reduced ? false : { opacity: 0, scale: 0.7, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 16,
              delay: i * 0.05,
            }}
            whileHover={reduced ? undefined : { y: -6 }}
            className="glass group rounded-2xl p-5 transition-colors hover:border-accent/30"
          >
            <market.Art />
            <h3 className="mt-3 text-sm font-semibold">{market.label}</h3>
            <p className="mt-1 text-xs text-muted">{market.detail}</p>
          </motion.article>
        ))}
      </div>

      {/* Card-síntese em destaque, com borda em gradiente */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
        className="mt-4 rounded-2xl bg-gradient-to-r from-accent/30 via-white/10 to-accent/20 p-px"
      >
        <div className="flex flex-col items-center gap-4 rounded-[15px] bg-surface/95 px-6 py-7 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-4">
            <span className="grid size-10 shrink-0 place-items-center text-accent">
              <Factory className="size-6" aria-hidden strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="font-display text-xl">
                Não achou o seu setor? Não importa.
              </h3>
              <p className="mt-0.5 text-sm text-muted">
                Se a operação roda em planilha, WhatsApp e boa vontade, a
                inteligência operacional é para a sua empresa.
              </p>
            </div>
          </div>
          <a
            href="#contato"
            className="group/cta flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.04] active:scale-[0.97]"
          >
            Falar com a gente
            <ArrowRight
              className="size-4 transition-transform group-hover/cta:translate-x-0.5"
              aria-hidden
            />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
