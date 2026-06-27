"use client";

import type { ReactNode } from "react";
import {
  motion,
  useTransform,
  transform,
  type MotionValue,
} from "framer-motion";

/* =========================================================
   MOCKUP DO DASHBOARD — a "central de inteligência operacional".

   Ele se CONSTRÓI durante o scroll do hero: enquanto cada card
   solto voa até o SEU lugar (âncora), o módulo correspondente
   acende ali — Jurídico pousa na aba "Jurídico", Metas vira os
   KPIs, Indicadores viram o gráfico, e assim por diante.

   ÂNCORAS: cada parte registra um nome via `registerAnchor`
   (side-*, kpi-*, kpis, chart, solicitacoes, dashboard). Os cards
   em lib/ops-cards.ts apontam para esses nomes.

   Os intervalos abaixo são frações (0–1) do scroll do hero.
   Ajuste em BUILD para adiantar/atrasar cada pedaço.
   ========================================================= */
const BUILD = {
  sidebar: (i: number) => [0.38 + i * 0.03, 0.5 + i * 0.03] as const,
  kpi: (i: number) => [0.46 + i * 0.05, 0.58 + i * 0.05] as const,
  bar: (i: number) => [0.52 + i * 0.015, 0.62 + i * 0.015] as const,
  request: (i: number) => [0.62 + i * 0.04, 0.72 + i * 0.04] as const,
};

const SIDEBAR_ITEMS = [
  { label: "Visão geral", anchor: "side-visao" },
  { label: "Vendas", anchor: "side-vendas" },
  { label: "Financeiro", anchor: "side-financeiro" },
  { label: "Atendimento", anchor: "side-atendimento" },
  { label: "Jurídico", anchor: "side-juridico" },
  { label: "Fornecedores", anchor: "side-fornecedores" },
  { label: "Planejamento", anchor: "side-planejamento" },
  { label: "Solicitações", anchor: "side-solicitacoes" },
  { label: "Chat com IA", anchor: "side-chat" },
];

const KPIS = [
  { label: "Vendas hoje", value: "R$ 48,2 mil", delta: "+12%", anchor: "kpi-vendas" },
  { label: "Atendimentos", value: "132", delta: "-18% fila", anchor: "kpi-atendimentos" },
  { label: "Custo de IA/API", value: "R$ 312", delta: "no orçamento", anchor: "kpi-custo" },
];

const CHART_BARS = [38, 52, 44, 61, 55, 70, 64, 78, 72, 88, 82, 96];

const REQUESTS = [
  { title: "Reposição de estoque — Loja 02", status: "Em análise" },
  { title: "Contrato fornecedor Alfa", status: "Aprovado" },
  { title: "Acesso ao painel financeiro", status: "Pendente" },
];

type RegisterAnchor = (key: string) => (el: HTMLElement | null) => void;

type BuildProps = {
  progress: MotionValue<number>;
  range: readonly [number, number];
  /** deslocamento de entrada em px */
  y?: number;
  x?: number;
  className?: string;
  anchorRef?: (el: HTMLElement | null) => void;
  children: ReactNode;
};

/* Pedaço do dashboard que "nasce" num trecho do scroll */
function Built({
  progress,
  range,
  y = 10,
  x = 0,
  className,
  anchorRef,
  children,
}: BuildProps) {
  const opacity = useTransform(progress, transform([...range], [0, 1]));
  const yv = useTransform(progress, transform([...range], [y, 0]));
  const xv = useTransform(progress, transform([...range], [x, 0]));
  return (
    <motion.div ref={anchorRef} style={{ opacity, y: yv, x: xv }} className={className}>
      {children}
    </motion.div>
  );
}

/* Barra do gráfico que cresce de baixo para cima */
function Bar({
  progress,
  range,
  height,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number];
  height: number;
}) {
  const scaleY = useTransform(progress, transform([...range], [0, 1]));
  return (
    <motion.div
      style={{ height: `${height}%`, scaleY }}
      className="flex-1 origin-bottom rounded-t-sm bg-gradient-to-t from-accent/30 to-accent"
    />
  );
}

export default function DashboardMockup({
  progress,
  registerAnchor,
}: {
  progress: MotionValue<number>;
  registerAnchor?: RegisterAnchor;
}) {
  // Sem registro (modo estático), usa um no-op
  const anchor: RegisterAnchor = registerAnchor ?? (() => () => {});

  return (
    <div
      ref={anchor("dashboard")}
      className="glass w-[min(92vw,880px)] overflow-hidden rounded-2xl"
    >
      {/* Barra de janela */}
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="size-2.5 rounded-full bg-rose-400/70" />
        <span className="size-2.5 rounded-full bg-amber-400/70" />
        <span className="size-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-xs font-medium text-muted">
          Central de Inteligência Operacional
        </span>
        <span className="ml-auto hidden rounded-full bg-accent-2/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent-2 sm:block">
          ao vivo
        </span>
      </div>

      <div className="flex">
        {/* Menu lateral (só desktop) — cada aba acende quando o card
            correspondente pousa nela */}
        <aside className="hidden w-44 shrink-0 border-r border-white/8 p-3 md:block">
          <ul className="space-y-1 text-xs text-muted">
            {SIDEBAR_ITEMS.map((item, i) => (
              <li key={item.anchor} ref={anchor(item.anchor)}>
                <Built
                  progress={progress}
                  range={BUILD.sidebar(i)}
                  x={-12}
                  y={0}
                  className={`rounded-lg px-3 py-2 ${
                    i === 0 ? "bg-accent/10 font-semibold text-accent" : ""
                  }`}
                >
                  {item.label}
                </Built>
              </li>
            ))}
          </ul>
        </aside>

        {/* Conteúdo principal */}
        <div className="flex-1 space-y-4 p-4 sm:p-5">
          {/* KPIs */}
          <div ref={anchor("kpis")} className="grid grid-cols-3 gap-3">
            {KPIS.map((kpi, i) => (
              <Built
                key={kpi.label}
                progress={progress}
                range={BUILD.kpi(i)}
                anchorRef={anchor(kpi.anchor)}
                className="rounded-xl bg-white/4 p-3"
              >
                <p className="truncate text-[10px] text-muted sm:text-xs">{kpi.label}</p>
                <p className="mt-1 truncate text-sm font-semibold sm:text-lg">{kpi.value}</p>
                <p className="mt-0.5 truncate text-[10px] font-medium text-accent-2">
                  {kpi.delta}
                </p>
              </Built>
            ))}
          </div>

          {/* Gráfico de barras crescendo */}
          <Built
            progress={progress}
            range={BUILD.bar(0)}
            anchorRef={anchor("chart")}
            className="rounded-xl bg-white/4 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-muted">Receita — últimos 12 meses</p>
              <p className="text-xs font-semibold text-accent-2">↑ 32% no ano</p>
            </div>
            <div className="flex h-24 items-end gap-1.5 sm:gap-2">
              {CHART_BARS.map((h, i) => (
                <Bar key={i} progress={progress} range={BUILD.bar(i)} height={h} />
              ))}
            </div>
          </Built>

          {/* Solicitações internas */}
          <Built
            progress={progress}
            range={BUILD.request(0)}
            anchorRef={anchor("solicitacoes")}
            className="hidden rounded-xl bg-white/4 p-4 sm:block"
          >
            <p className="mb-3 text-xs font-medium text-muted">Solicitações internas</p>
            <ul className="space-y-2">
              {REQUESTS.map((req, i) => (
                <li key={req.title}>
                  <Built
                    progress={progress}
                    range={BUILD.request(i)}
                    y={6}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="truncate text-xs text-foreground/85">{req.title}</span>
                    <span className="shrink-0 rounded-full bg-white/6 px-2.5 py-0.5 text-[10px] text-muted">
                      {req.status}
                    </span>
                  </Built>
                </li>
              ))}
            </ul>
          </Built>
        </div>
      </div>
    </div>
  );
}
