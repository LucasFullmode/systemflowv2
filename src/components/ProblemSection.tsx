"use client";

import type { ComponentType } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Table2,
  Brain,
  FileClock,
  Eye,
  EyeOff,
  Headphones,
  FileSearch,
  GitBranch,
  RefreshCw,
  Layers3,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

/* =========================================================
   VINHETAS ANIMADAS — cada dor tem uma micro-animação que
   ilustra o título (células fugindo da planilha, olho piscando,
   pedido que se perde no caminho...). São loops sutis e contínuos;
   com "reduzir movimento" ativo, viram ícones estáticos.
   Ajuste duração/intensidade dentro de cada componente.
   ========================================================= */

/** Ícone SEM caixa (mantém o tamanho p/ ancorar os acessórios animados) */
function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative grid size-9 place-items-center text-rose-300/90">
      {children}
    </span>
  );
}

/* Planilhas: células de dados escapando da tabela */
function ArtPlanilhas() {
  const reduced = useReducedMotion();
  return (
    <IconBox>
      <Table2 className="size-5" aria-hidden />
      {!reduced &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute size-1.5 rounded-[2px] bg-rose-300/80"
            style={{ right: -2, top: 10 + i * 9 }}
            animate={{ x: [0, 14], opacity: [0, 1, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
    </IconBox>
  );
}

/* Feeling: o "?" que sobe da cabeça a cada decisão */
function ArtFeeling() {
  const reduced = useReducedMotion();
  return (
    <IconBox>
      <motion.span
        animate={reduced ? undefined : { scale: [1, 1.07, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="grid place-items-center"
      >
        <Brain className="size-5" aria-hidden />
      </motion.span>
      {!reduced && (
        <motion.span
          className="absolute -top-1.5 right-0 text-[11px] font-bold text-rose-300"
          animate={{ y: [4, -7], opacity: [0, 1, 0], scale: [0.7, 1.15] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          aria-hidden
        >
          ?
        </motion.span>
      )}
    </IconBox>
  );
}

/* Relatórios manuais: o retrabalho girando sem parar */
function ArtRelatorios() {
  const reduced = useReducedMotion();
  return (
    <IconBox>
      <FileClock className="size-5" aria-hidden />
      {!reduced && (
        <motion.span
          className="absolute -right-1.5 -bottom-1.5 grid size-4 place-items-center rounded-full bg-surface text-rose-300"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          aria-hidden
        >
          <RefreshCw className="size-3" />
        </motion.span>
      )}
    </IconBox>
  );
}

/* Tempo real: o olho que pisca — ora vê, ora não */
function ArtTempoReal() {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <IconBox>
        <EyeOff className="size-5" aria-hidden />
      </IconBox>
    );
  }
  return (
    <IconBox>
      <motion.span
        className="absolute grid place-items-center"
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, times: [0, 0.55, 0.62, 0.92, 1] }}
        aria-hidden
      >
        <EyeOff className="size-5" />
      </motion.span>
      <motion.span
        className="grid place-items-center"
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, times: [0, 0.55, 0.62, 0.92, 1] }}
        aria-hidden
      >
        <Eye className="size-5" />
      </motion.span>
    </IconBox>
  );
}

/* Atendimento: notificações pipocando sem parar */
function ArtAtendimento() {
  const reduced = useReducedMotion();
  return (
    <IconBox>
      <Headphones className="size-5" aria-hidden />
      {!reduced && (
        <motion.span
          className="absolute -top-1.5 -right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-400 px-1 text-[9px] font-bold text-background"
          animate={{ scale: [0, 1.15, 1, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.15, 0.25, 0.9, 1] }}
          aria-hidden
        >
          9+
        </motion.span>
      )}
    </IconBox>
  );
}

/* Documentos: a lupa varrendo sem achar */
function ArtDocumentos() {
  const reduced = useReducedMotion();
  return (
    <IconBox>
      <motion.span
        animate={reduced ? undefined : { x: [-3, 3, -3], rotate: [-8, 8, -8] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="grid place-items-center"
      >
        <FileSearch className="size-5" aria-hidden />
      </motion.span>
    </IconBox>
  );
}

/* Rastreabilidade: o pedido que se perde no meio do caminho */
function ArtRastreabilidade() {
  const reduced = useReducedMotion();
  return (
    <span className="flex items-center gap-2">
      <IconBox>
        <GitBranch className="size-5" aria-hidden />
      </IconBox>
      {!reduced && (
        <span className="relative h-1.5 w-9">
          {/* o "pedido" (ponto) viaja e some — sem traço/track visível */}
          <motion.span
            className="absolute top-0 left-0 size-1.5 rounded-full bg-rose-300"
            animate={{ x: [0, 30], opacity: [1, 1, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeIn", times: [0, 0.7, 1] }}
            aria-hidden
          />
        </span>
      )}
    </span>
  );
}

/* ===== DORES — ajuste textos e vinhetas aqui ===== */
const PROBLEMS: Array<{
  Art: ComponentType;
  title: string;
  description: string;
}> = [
  {
    Art: ArtPlanilhas,
    title: "Dados espalhados em planilhas",
    description:
      "Cada área tem a sua versão da verdade. Ninguém sabe qual número está certo.",
  },
  {
    Art: ArtFeeling,
    title: "Decisões baseadas em feeling",
    description:
      "Sem indicadores confiáveis, as escolhas importantes viram aposta.",
  },
  {
    Art: ArtRelatorios,
    title: "Relatórios manuais",
    description:
      "Horas por semana copiando e colando dados que já deveriam estar prontos.",
  },
  {
    Art: ArtTempoReal,
    title: "Falta de visão em tempo real",
    description:
      "Você só descobre o problema quando ele já virou prejuízo.",
  },
  {
    Art: ArtAtendimento,
    title: "Atendimento sobrecarregado",
    description:
      "A equipe responde as mesmas perguntas todos os dias, sem padrão nem histórico.",
  },
  {
    Art: ArtDocumentos,
    title: "Documentos difíceis de consultar",
    description:
      "Contratos, normas e políticas perdidos em pastas, e-mails e gavetas.",
  },
  {
    Art: ArtRastreabilidade,
    title: "Processos sem rastreabilidade",
    description:
      "Solicitações internas se perdem no WhatsApp e ninguém sabe de quem é a bola.",
  },
];

/* =========================================================
   ENTRADA CAÓTICA — ajuste o "caos" aqui (um item por card).
   `once: false` no viewport faz a animação rodar de novo se a
   pessoa rolar para cima e voltar.
   ========================================================= */
const CHAOS = [
  { x: -70, y: 50, drop: -10, rest: -1.6, delay: 0.05 },
  { x: 60, y: 70, drop: 8, rest: 1.2, delay: 0.18 },
  { x: -40, y: 90, drop: -6, rest: -0.9, delay: 0 },
  { x: 80, y: 40, drop: 12, rest: 1.8, delay: 0.24 },
  { x: -90, y: 60, drop: -9, rest: -1.1, delay: 0.12 },
  { x: 50, y: 80, drop: 7, rest: 0.8, delay: 0.3 },
  { x: -60, y: 100, drop: -12, rest: -1.4, delay: 0.08 },
];

export default function ProblemSection() {
  const reduced = useReducedMotion();

  return (
    <section id="problema" className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        icon={Layers3}
        eyebrow="O problema"
        title="A operação cresce. A bagunça cresce junto."
        description="Se a sua empresa depende de planilhas, grupos de WhatsApp e da memória das pessoas, esses sintomas são familiares:"
      />

      {/* BENTO: grade de 6 colunas (lg) com larguras variadas —
          padrão 3+3 / 2+2+2 / 3+3 quebra a uniformidade de grid */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {PROBLEMS.map((problem, i) => {
          const chaos = CHAOS[i % CHAOS.length];
          /* classes LITERAIS (Tailwind não lê classe interpolada) —
             padrão 3+3 / 2+2+2 / 3+3 */
          const SPAN_CLASS = [
            "lg:col-span-3",
            "lg:col-span-3",
            "lg:col-span-2",
            "lg:col-span-2",
            "lg:col-span-2",
            "lg:col-span-3",
            "lg:col-span-3",
          ];
          const span = SPAN_CLASS[i] ?? "lg:col-span-2";
          return (
            <motion.article
              key={problem.title}
              initial={
                reduced
                  ? false
                  : { opacity: 0, x: chaos.x, y: chaos.y, rotate: chaos.drop }
              }
              whileInView={{ opacity: 1, x: 0, y: 0, rotate: chaos.rest }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 13,
                delay: chaos.delay,
              }}
              whileHover={reduced ? undefined : { rotate: 0, y: -5 }}
              className={`group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 transition-colors duration-300 hover:border-white/15 hover:bg-white/[0.03] ${span}`}
            >
              {/* HOVER: linha lime só no TOPO, varre da esquerda */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-transparent transition-transform duration-500 group-hover:scale-x-100"
              />
              {/* cabeçalho editorial: ícone inline com o título */}
              <div className="flex items-center gap-3">
                <problem.Art />
                <h3 className="font-semibold">{problem.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted">{problem.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
