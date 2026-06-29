"use client";

/* =========================================================
   SLIDES DO DECK — Sistema de Gestão de Estoque & Comissões

   Cada slide é um componente que ocupa a viewport inteira (o
   enquadramento/centralização é feito pelo Deck). O conteúdo
   precisa CABER na tela, sem scroll interno.

   Reaproveita 100% da identidade do SystemFlow:
   - cores via tokens (bg-background, bg-surface, text-accent...)
   - .glass / .glow / .font-display / .font-brand (globals.css)
   - ícones lucide e o mesmo tratamento de cards

   Para EDITAR textos/preços: tudo está inline em cada slide.
   ========================================================= */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Receipt,
  Scale,
  EyeOff,
  Boxes,
  HandCoins,
  BellRing,
  Repeat,
  Target,
  FileBarChart,
  TrendingUp,
  PackagePlus,
  Users,
  Trophy,
  ShieldCheck,
  Server,
  Clock,
  Check,
  Minus,
  ArrowRight,
  Sparkles,
  KeyRound,
  UserCheck,
  ClipboardCheck,
  PackageCheck,
  MessageCircle,
  Smartphone,
  FileSpreadsheet,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import * as Anim from "./animated-icons";

/* componente de ícone genérico (lucide ou um dos animados sob medida) */
type Ico = React.ComponentType<{ className?: string }>;

/* ---------- ritmo de entrada (stagger) usado em todos os slides ---------- */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};
const itemV: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* Item animado — bloco que entra em cascata dentro de cada slide */
function I({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemV} className={className}>
      {children}
    </motion.div>
  );
}

/* Ícone com micro-animação — "respira"/flutua de leve e cresce no hover,
   no mesmo espírito das animações de ícone da página principal.
   `i` dá um atraso por posição (cascata). Respeita reduzir-movimento. */
function AnimatedIcon({
  icon: Icon,
  i = 0,
  className = "size-5",
}: {
  icon: LucideIcon;
  i?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className="inline-grid place-items-center"
      animate={reduced ? undefined : { y: [0, -2, 0], scale: [1, 1.08, 1] }}
      transition={{
        duration: 3 + (i % 4) * 0.45,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.1,
      }}
    >
      <Icon className={className} aria-hidden />
    </motion.span>
  );
}

/* Etiqueta de seção (eyebrow) — mesmo padrão do SectionHeading */
function Eyebrow({ icon: Icon, children }: { icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <I className="flex items-center justify-center gap-2">
      {Icon && <Icon className="size-4 text-accent" strokeWidth={1.5} aria-hidden />}
      <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        {children}
      </span>
    </I>
  );
}

/* Brilhos de fundo (reaproveita .glow) — bem sutis, como no site */
function Glows() {
  return (
    <>
      <div className="glow left-[-8%] top-[-12%] h-[420px] w-[420px] bg-accent/[0.06]" />
      <div className="glow bottom-[-18%] right-[-8%] h-[460px] w-[460px] bg-accent/[0.04]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
    </>
  );
}

/* =========================================================
   SLIDE 1 — CAPA
   ========================================================= */
function SlideCapa() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center text-center">
      <Glows />
      <div className="relative z-10 max-w-4xl px-6">
        <I>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-4 py-1.5 text-xs font-medium tracking-wide text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
            Proposta de plataforma sob medida
          </span>
        </I>

        <I>
          <h1 className="font-display mt-8 text-5xl leading-[1.05] text-balance md:text-7xl">
            Sistema de Gestão de{" "}
            <span className="text-accent italic">Estoque &amp; Comissões</span>
          </h1>
        </I>

        <I>
          <p className="mx-auto mt-7 max-w-2xl text-base text-muted text-pretty md:text-xl">
            Tira a operação do grupo de WhatsApp e da planilha e coloca tudo num
            só lugar, em tempo real.
          </p>
        </I>

        <I>
          <div className="mt-12 flex justify-center">
            <span className="font-brand text-base font-bold tracking-tight text-foreground/90">
              System<span className="text-accent">Flow</span>
            </span>
          </div>
        </I>
      </div>
    </div>
  );
}

/* =========================================================
   SLIDE 2 — O PROBLEMA
   ========================================================= */
const PROBLEMAS: Array<[Ico, string, string]> = [
  [Anim.ReceiptFly, "Vendas que escapam", "Pedido solto no grupo se perde no meio das mensagens."],
  [Anim.ScaleWobble, "Comissão vira discussão", "Ninguém sabe ao certo quanto cada vendedor ganhou no mês."],
  [Anim.SearchScan, "Estoque no escuro", "Não dá pra saber o que tem, o que saiu, nem o que vai faltar."],
  [Anim.EyeSlash, "Quem decide, às cegas", "Sem número nenhum pra confiar, cada decisão vira achismo."],
];
function SlideProblema() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-8">
      <Eyebrow icon={EyeOff}>O problema</Eyebrow>
      <I>
        <h2 className="font-display mt-4 text-center text-3xl leading-[1.1] text-balance md:text-5xl">
          Hoje, a operação roda no improviso.
        </h2>
      </I>
      <I>
        <p className="mx-auto mt-5 max-w-2xl text-center text-muted text-pretty md:text-lg">
          Tudo acontece no grupo de WhatsApp e numa planilha, e quebra sempre no
          mesmo ponto: o vendedor não alimenta a informação, então estoque,
          comissão e vendas vivem desencontrados.
        </p>
      </I>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PROBLEMAS.map(([Icon, title, desc]) => (
          <I key={title}>
            <div className="glass flex h-full gap-4 rounded-2xl p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                <Icon className="size-5.5" />
              </span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted text-pretty">{desc}</p>
              </div>
            </div>
          </I>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SLIDE 3 — A VISÃO
   ========================================================= */
const PILARES: Array<[Ico, string, string]> = [
  [Anim.BoxesPulse, "Estoque em tempo real", "Sempre sabe o que tem, e é avisado antes de faltar."],
  [Anim.CoinsFly, "Comissão clara", "Cada vendedor enxerga o que já ganhou, sem discussão."],
  [Anim.BellRing, "Recompra na hora certa", "O sistema avisa quando o cliente está pra precisar repor."],
];
function SlideVisao() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-8">
      <Glows />
      <div className="relative z-10">
        <Eyebrow icon={Sparkles}>A visão</Eyebrow>
        <I>
          <h2 className="font-display mt-4 text-center text-3xl leading-[1.1] text-balance md:text-5xl">
            Imagine abrir o painel e ver tudo, em tempo real.
          </h2>
        </I>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PILARES.map(([Icon, title, desc]) => (
            <I key={title}>
              <div className="glass flex h-full flex-col rounded-2xl p-6 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent/12 text-accent">
                  <Icon className="size-7" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted text-pretty">{desc}</p>
              </div>
            </I>
          ))}
        </div>
        <I>
          <p className="mt-10 text-center text-pretty md:text-lg">
            É a mesma operação, agora{" "}
            <span className="text-accent italic">sob controle</span> e empurrando
            a próxima venda.
          </p>
        </I>
      </div>
    </div>
  );
}

/* =========================================================
   SLIDE 4 — A SOLUÇÃO (duas camadas empilhadas)
   ========================================================= */
function SlideSolucao() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-4xl flex-col justify-center px-8">
      <Eyebrow icon={LayoutDashboard}>A solução</Eyebrow>
      <I>
        <h2 className="font-display mt-4 text-center text-3xl leading-[1.1] text-balance md:text-5xl">
          Dois caminhos, um mesmo alicerce.
        </h2>
      </I>

      <div className="mt-12 space-y-3">
        {/* Núcleo operacional (base) — agora EM CIMA */}
        <I>
          <div className="rounded-2xl border border-white/10 bg-surface/70 p-6">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/8 text-foreground/80">
                <Anim.BoxesPulse className="size-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">
                  Núcleo operacional{" "}
                  <span className="text-sm font-normal text-muted">/ Plano Essencial</span>
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Estoque, vendas, aprovação, entrega, comissão e cadastro de
                  clientes.{" "}
                  <span className="text-foreground/80">O que tira tudo da planilha.</span>
                </p>
              </div>
            </div>
          </div>
        </I>

        {/* "encaixe" visual entre as camadas */}
        <I>
          <p className="text-center text-xs tracking-widest text-muted uppercase">
            potencializado pela
          </p>
        </I>

        {/* Camada de inteligência — agora EMBAIXO, destacada */}
        <I>
          <div className="relative rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/15 via-accent/5 to-transparent p-6">
            <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-[10px] font-bold tracking-wide text-background uppercase">
              Plano Completo
            </span>
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/20 text-accent">
                <Anim.TrendUp className="size-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">Camada de inteligência</h3>
                <p className="mt-1 text-sm text-muted">
                  Previsão de estoque, metas, recompra, lucro por produto, CRM e
                  relatórios.{" "}
                  <span className="text-accent">O que faz vender mais.</span>
                </p>
              </div>
            </div>
          </div>
        </I>
      </div>
    </div>
  );
}

/* =========================================================
   SLIDE 5 — PLANO ESSENCIAL (escopo, sem preço)
   ========================================================= */
const ESSENCIAL_ITENS: Array<[LucideIcon, string]> = [
  [KeyRound, "Acesso fechado por login, com perfis de admin e vendedor"],
  [Boxes, "Cadastro de produtos com controle de estoque"],
  [Receipt, "Registro de vendas feito pelo próprio vendedor"],
  [UserCheck, "Aprovação do admin antes de abater o estoque"],
  [PackageCheck, "Baixa automática na confirmação da entrega"],
  [HandCoins, "Comissão calculada em tempo real por vendedor"],
  [Users, "Cadastro de clientes por telefone, reutilizável"],
  [LayoutDashboard, "Painel do administrador com a visão geral do negócio"],
  [Smartphone, "App instalável e discreto (PWA), sem loja de apps"],
  [FileSpreadsheet, "Migração da planilha atual como ponto de partida"],
];
function SlideEssencial() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-8">
      <Eyebrow icon={ClipboardCheck}>Plano Essencial</Eyebrow>
      <I>
        <h2 className="font-display mt-3 text-center text-3xl leading-[1.1] text-balance md:text-4xl">
          O núcleo que substitui a planilha.
        </h2>
      </I>
      <I>
        <p className="mt-3 text-center text-muted text-pretty md:text-lg">
          Um sistema completo e redondo por si só, não uma versão pela metade.
        </p>
      </I>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ESSENCIAL_ITENS.map(([Icon, txt], idx) => (
          <I key={txt}>
            <div className="glass flex h-full items-center gap-3 rounded-xl p-3.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                <AnimatedIcon icon={Icon} i={idx} className="size-4.5" />
              </span>
              <span className="text-sm text-foreground/90 text-pretty">{txt}</span>
            </div>
          </I>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SLIDE 6 — PLANO COMPLETO (escopo, sem preço)
   ========================================================= */
const COMPLETO_ITENS: Array<[LucideIcon, string]> = [
  [BellRing, "Alerta de estoque baixo com previsão de quando vai acabar"],
  [Target, "Metas semanais e mensais com bônus, por vendedor"],
  [Repeat, "Notificação de recompra na hora certa de cada cliente"],
  [FileBarChart, "Relatórios completos por vendedor, produto e período"],
  [TrendingUp, "Margem e lucro real por produto, não só faturamento"],
  [PackagePlus, "Reposição inteligente: quanto repor pelo ritmo de giro"],
  [Users, "CRM leve: ticket médio, melhores e clientes sumidos"],
  [Trophy, "Ranking e gamificação entre os vendedores"],
  [ShieldCheck, "Registro de auditoria de tudo que acontece no sistema"],
];
function SlideCompleto() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-8">
      <Eyebrow icon={TrendingUp}>Plano Completo</Eyebrow>
      <I>
        <h2 className="font-display mt-4 text-center text-3xl leading-[1.1] text-balance md:text-5xl">
          A inteligência que faz vender mais.
        </h2>
      </I>
      <I>
        <p className="mt-4 text-center text-muted text-pretty md:text-lg">
          Tudo do Essencial{" "}
          <span className="text-accent">+ a camada que transforma dado em
          decisão</span>{" "}
          e em próxima venda.
        </p>
      </I>
      <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COMPLETO_ITENS.map(([Icon, txt], idx) => (
          <I key={txt}>
            <div className="glass flex h-full items-start gap-3 rounded-xl p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                <AnimatedIcon icon={Icon} i={idx} className="size-4.5" />
              </span>
              <span className="text-sm text-foreground/90 text-pretty">{txt}</span>
            </div>
          </I>
        ))}
      </div>
      <I>
        <p className="mt-8 text-center text-pretty md:text-lg">
          O Essencial te diz o que aconteceu.{" "}
          <span className="text-accent italic">
            O Completo te diz o que vai acontecer.
          </span>
        </p>
      </I>
    </div>
  );
}

/* =========================================================
   SLIDE 7 — COMPARAÇÃO (clímax) — estilo Apple
   Lista à esquerda; dois cards encostados à direita; linhas
   horizontais guiando o olho; Completo destacado.
   ========================================================= */
const NUCLEO = [
  "Acesso por login · admin e vendedor",
  "Cadastro de produtos e estoque",
  "Registro de vendas pelo vendedor",
  "Aprovação do admin",
  "Baixa automática na entrega",
  "Comissão em tempo real",
  "Cadastro de clientes",
  "Painel do administrador",
  "App instalável e discreto (PWA)",
  "Migração da planilha atual",
];
const INTELIGENCIA = [
  "Alerta de ruptura de estoque",
  "Metas e bônus por vendedor",
  "Notificação de recompra",
  "Relatórios completos + exportação",
  "Margem e lucro por produto",
  "Reposição inteligente",
  "CRM e inteligência de clientes",
  "Ranking e gamificação",
  "Registro de auditoria",
];

/* célula de valor (check ou traço) dentro de uma coluna de plano */
function Cell({ on, highlight }: { on: boolean; highlight?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center self-stretch ${
        highlight ? "bg-accent/[0.05]" : ""
      }`}
    >
      {on ? (
        <Check
          className={`size-3.5 ${highlight ? "text-accent" : "text-accent-2"}`}
          strokeWidth={2.5}
          aria-hidden
        />
      ) : (
        <Minus className="size-3.5 text-muted/50" aria-hidden />
      )}
    </div>
  );
}

function SlideComparacao() {
  /* grid: [label | Essencial | Completo] — coluna de rótulo com largura
     FIXA (texto fica ao lado dos cards, sem vão enorme) e o bloco todo
     é centralizado na tela (w-fit + mx-auto no container). As duas
     colunas de valor ficam ENCOSTADAS (sem gap entre elas). */
  const cols = "grid-cols-[232px_104px_116px] md:grid-cols-[300px_132px_148px]";

  const FeatureRow = ({ label, ess, comp }: { label: string; ess: boolean; comp: boolean }) => (
    <div className={`grid ${cols} items-stretch border-t border-white/[0.06]`}>
      <div className="py-[2px] pr-4 text-[11px] leading-tight text-foreground/85 md:text-[12px]">
        {label}
      </div>
      <Cell on={ess} />
      <Cell on={comp} highlight />
    </div>
  );

  const SectionRow = ({ label }: { label: string }) => (
    <div className={`grid ${cols} items-stretch`}>
      <div className="pt-1.5 pb-0.5 text-[10px] font-semibold tracking-[0.15em] text-accent uppercase">
        {label}
      </div>
      <div />
      <div className="bg-accent/[0.05]" />
    </div>
  );

  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-8">
      <div className="text-center">
        <Eyebrow icon={Scale}>Comparação</Eyebrow>
        <I>
          <h2 className="font-display mt-2 text-2xl leading-[1.05] text-balance md:text-3xl">
            Compare lado a lado.
          </h2>
        </I>
      </div>

      <I className="mt-4">
        <div className="relative mx-auto w-fit">
          {/* topo dos cards (nome + preço) — alinhado às colunas de valor */}
          <div className={`grid ${cols} items-end`}>
            <div />
            {/* Essencial */}
            <div className="rounded-t-2xl border border-b-0 border-white/10 bg-surface/70 px-2 pt-3 pb-2 text-center">
              <p className="text-[11px] font-semibold text-foreground/80">Essencial</p>
              <p className="mt-1 text-base font-bold leading-none md:text-lg">R$ 7.980</p>
              <p className="mt-1 text-[10px] text-muted">+ R$ 500/mês</p>
            </div>
            {/* Completo (destacado) */}
            <div className="relative rounded-t-2xl border border-b-0 border-accent/50 bg-accent/[0.07] px-2 pt-3 pb-2 text-center shadow-[0_-8px_30px_rgba(198,255,52,0.10)]">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2.5 py-0.5 text-[9px] font-bold tracking-wide text-background uppercase whitespace-nowrap">
                Recomendado
              </span>
              <p className="text-[11px] font-semibold text-accent">Completo</p>
              <p className="mt-1 text-base font-bold leading-none text-foreground md:text-lg">
                R$ 14.490
              </p>
              <p className="mt-1 text-[10px] text-muted">+ R$ 1.000/mês</p>
            </div>
          </div>

          {/* corpo: as colunas de valor têm borda contínua (efeito card) */}
          <div className="relative border-x border-transparent">
            {/* bordas laterais contínuas das colunas */}
            <div className="pointer-events-none absolute inset-0">
              <div className={`grid h-full ${cols}`}>
                <div />
                <div className="border-x border-white/10" />
                <div className="rounded-b-2xl border-x border-b border-accent/50" />
              </div>
            </div>

            <SectionRow label="Núcleo operacional" />
            {NUCLEO.map((l) => (
              <FeatureRow key={l} label={l} ess comp />
            ))}

            <SectionRow label="Inteligência & crescimento" />
            {INTELIGENCIA.map((l) => (
              <FeatureRow key={l} label={l} ess={false} comp />
            ))}
          </div>
        </div>
      </I>

      <I>
        <p className="mt-3 text-center text-[11px] text-muted">
          Adicional: automação no WhatsApp para registrar vendas e recompra pela
          própria conversa{" "}
          <span className="text-muted/70">(sob consulta)</span>.
        </p>
      </I>
    </div>
  );
}

/* =========================================================
   SLIDE 8 — A MENSALIDADE
   ========================================================= */
const MENSALIDADE: Array<[Ico, string, string]> = [
  [Anim.ServerPulse, "Infraestrutura no ar", "Servidor, banco, domínio e backups rodando 24/7."],
  [Anim.ShieldCheck, "Manutenção e segurança", "Correções, atualizações e monitoramento."],
  [Anim.ClockTick, "Pacote de horas", "Ajustes e novos pedidos que surgem quando a equipe começa a usar."],
];
function SlideMensalidade() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-8">
      <Eyebrow icon={Server}>A mensalidade</Eyebrow>
      <I>
        <h2 className="font-display mt-4 text-center text-3xl leading-[1.1] text-balance md:text-5xl">
          Não é hospedagem. É o sistema vivo.
        </h2>
      </I>
      <I>
        <p className="mx-auto mt-5 max-w-2xl text-center text-muted text-pretty md:text-lg">
          A mensalidade mantém a plataforma no ar, segura e evoluindo, com alguém
          pronto pra atender quando precisarem mexer.
        </p>
      </I>
      <div className="mt-11 grid grid-cols-1 gap-5 md:grid-cols-3">
        {MENSALIDADE.map(([Icon, title, desc]) => (
          <I key={title}>
            <div className="glass flex h-full flex-col rounded-2xl p-6">
              <span className="grid size-12 place-items-center rounded-xl bg-accent/12 text-accent">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted text-pretty">{desc}</p>
            </div>
          </I>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SLIDE 9 — INVESTIMENTO & CONDIÇÕES
   ========================================================= */
const CONDICOES: Array<[LucideIcon, string, string]> = [
  [HandCoins, "Pagamento da implementação", "40% na assinatura · 30% na entrega do MVP · 30% na homologação."],
  [Clock, "Prazo estimado do MVP", "~6 semanas, ajustado no kickoff."],
  [FileSpreadsheet, "Já incluído", "Migração da planilha atual como base."],
  [Smartphone, "Adicional futuro", "Automação no WhatsApp, pra somar ao Completo (sob consulta)."],
];
function SlideInvestimento() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-8">
      <Eyebrow icon={HandCoins}>Investimento &amp; condições</Eyebrow>
      <I>
        <h2 className="font-display mt-3 text-center text-3xl leading-[1.1] text-balance md:text-4xl">
          Resumo e condições.
        </h2>
      </I>

      {/* recap dos dois planos */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <I>
          <div className="rounded-2xl border border-white/10 bg-surface/70 p-5 text-center">
            <p className="text-xs font-semibold text-foreground/80">Essencial</p>
            <p className="mt-2 text-2xl font-bold md:text-3xl">R$ 7.980</p>
            <p className="mt-1 text-xs text-muted">+ R$ 500/mês</p>
          </div>
        </I>
        <I>
          <div className="relative rounded-2xl border border-accent/50 bg-accent/[0.07] p-5 text-center shadow-[0_8px_30px_rgba(198,255,52,0.10)]">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2.5 py-0.5 text-[9px] font-bold tracking-wide text-background uppercase">
              Recomendado
            </span>
            <p className="text-xs font-semibold text-accent">Completo</p>
            <p className="mt-2 text-2xl font-bold md:text-3xl">R$ 14.490</p>
            <p className="mt-1 text-xs text-muted">+ R$ 1.000/mês</p>
          </div>
        </I>
      </div>

      {/* condições */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CONDICOES.map(([Icon, title, desc]) => (
          <I key={title}>
            <div className="flex items-start gap-3 rounded-xl bg-surface/50 px-4 py-3">
              <Icon className="mt-0.5 size-4.5 shrink-0 text-accent" aria-hidden />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted text-pretty">{desc}</p>
              </div>
            </div>
          </I>
        ))}
      </div>

      <I>
        <p className="mt-6 text-center text-sm text-pretty md:text-base">
          Como projeto inaugural, vocês têm{" "}
          <span className="text-accent italic">acompanhamento próximo</span> e
          prioridade nos ajustes do primeiro ciclo.
        </p>
      </I>
    </div>
  );
}

/* =========================================================
   SLIDE 10 — PRÓXIMOS PASSOS
   ========================================================= */
const PASSOS: Array<[string, string]> = [
  ["Escolha do plano", "Essencial ou Completo, decidimos juntos o ponto de partida."],
  ["Assinatura e entrada", "Contrato fechado e os 40% iniciais."],
  ["Envio da planilha atual", "A Duda manda o Excel com produtos e valores pra carregar como base."],
  ["Kickoff e cronograma", "Alinhamos detalhes, prazos e o que entra primeiro."],
  ["Entrega do MVP", "Começam a usar e a gente vai refinando junto."],
];
/* Caixa de fecho premium (estilo da CTA final da página principal). */
function FechoBox() {
  const reduced = useReducedMotion();
  // Mensagem pré-pronta enviada direto no WhatsApp (71 98636-8655)
  const msg = "Analisei a proposta e estamos de acordo, como podemos prosseguir?";
  const wa = `https://wa.me/5571986368655?text=${encodeURIComponent(msg)}`;
  return (
    <div className="mt-5 rounded-3xl bg-gradient-to-br from-accent/30 via-white/10 to-accent/20 p-px">
      <div className="relative overflow-hidden rounded-[23px] bg-surface/95 px-8 py-7 text-center">
        {/* feixe cônico girando devagar ao fundo */}
        {!reduced && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute top-1/2 left-1/2 h-[180%] w-[180%] -translate-x-1/2 -translate-y-1/2 opacity-25"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, var(--accent) 40deg, transparent 90deg, transparent 180deg, var(--accent-2) 220deg, transparent 270deg)",
              filter: "blur(60px)",
            }}
            aria-hidden
          />
        )}
        {/* brilhos internos pulsando */}
        <motion.div
          animate={reduced ? undefined : { opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="glow top-[-40%] left-[-10%] h-[240px] w-[240px] bg-accent/15"
        />
        <motion.div
          animate={reduced ? undefined : { opacity: [0.9, 0.5, 0.9] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="glow right-[-10%] bottom-[-40%] h-[240px] w-[240px] bg-accent-2/15"
        />

        <h3 className="font-display relative text-2xl leading-[1.1] text-balance md:text-3xl">
          Vamos tirar a operação da{" "}
          <span className="text-accent italic">planilha</span>.
        </h3>

        {/* Botão único — abre o WhatsApp já com a mensagem pronta */}
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-background shadow-[0_8px_32px_rgba(198,255,52,0.28)] transition-transform hover:scale-[1.04] active:scale-[0.98]"
        >
          <span
            className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 opacity-0 blur-sm transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
            aria-hidden
          />
          <MessageCircle className="size-4" aria-hidden />
          Fechar negócio
        </a>
      </div>
    </div>
  );
}

function SlideProximosPassos() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-4xl flex-col justify-center px-8">
      <Glows />
      <div className="relative z-10">
        <Eyebrow icon={ArrowRight}>Próximos passos</Eyebrow>
        <I>
          <h2 className="font-display mt-3 text-center text-3xl leading-[1.1] text-balance md:text-4xl">
            Vamos começar.
          </h2>
        </I>

        <div className="mt-6 space-y-2">
          {PASSOS.map(([title, desc], i) => (
            <I key={title}>
              <div className="flex items-center gap-4 rounded-xl bg-surface/50 px-5 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/10 text-sm font-bold text-accent">
                  {i + 1}
                </span>
                <div>
                  <span className="font-semibold">{title}.</span>
                  <span className="ml-2 text-sm text-muted">{desc}</span>
                </div>
              </div>
            </I>
          ))}
        </div>

        {/* Caixa de fecho — mesma vibe da CTA final da página principal:
           moldura em gradiente, feixe cônico girando + brilhos pulsando,
           frase de impacto e UM botão (WhatsApp). Sem campos a preencher. */}
        <I>
          <FechoBox />
        </I>
      </div>
    </div>
  );
}

/* =========================================================
   REGISTRO DOS SLIDES — a ordem aqui é a ordem do deck
   ========================================================= */
export const SLIDES: Array<{ id: string; Component: () => React.JSX.Element }> = [
  { id: "capa", Component: SlideCapa },
  { id: "problema", Component: SlideProblema },
  { id: "visao", Component: SlideVisao },
  { id: "solucao", Component: SlideSolucao },
  { id: "essencial", Component: SlideEssencial },
  { id: "completo", Component: SlideCompleto },
  { id: "comparacao", Component: SlideComparacao },
  { id: "mensalidade", Component: SlideMensalidade },
  { id: "investimento", Component: SlideInvestimento },
  { id: "proximos-passos", Component: SlideProximosPassos },
];
