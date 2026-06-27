"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  transform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  TrendingUp,
  Target,
  CalendarDays,
  Scale,
  MessageSquareText,
  Bot,
  Cpu,
  FileBarChart,
  Inbox,
  Sparkles,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

/* =========================================================
   A PLATAFORMA — simulador navegável.

   - Sidebar com os módulos; o destaque DESLIZA entre os itens
     (layoutId) e a prévia entra em cascata a cada seleção.
   - Cada TELA tem animação interna própria (barras crescendo,
     metas preenchendo, células do calendário pipocando, chat
     "digitando"...) que roda a cada seleção.
   - ZOOM NO SCROLL: a janela começa "afastada" (ZOOM_FROM) e
     aproxima até o tamanho real conforme a página rola.

   Ajuste módulos (título, subtítulo, ícone e visual) em MODULES.
   ========================================================= */
const ZOOM_FROM = 0.85;

/* Cascata da prévia: cada bloco entra logo após o anterior */
const panelVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

/* ----- variants reutilizados pelas TELAS internas ----- */
const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const rowVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};
const popVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 18 },
  },
};
/* barra que cresce de baixo (gráficos) */
const barVariants: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.45, ease: "easeOut" } },
};
/* preenchimento horizontal (metas/orçamento) — width vem via `custom` */
const fillVariants: Variants = {
  hidden: { width: 0 },
  show: (pct: number) => ({
    width: `${pct}%`,
    transition: { duration: 0.7, ease: "easeOut" },
  }),
};

/* Desliga as variants quando o usuário prefere menos movimento */
function useV(v: Variants): Variants | undefined {
  return useReducedMotion() ? undefined : v;
}

/* =========================================================
   SEQUÊNCIA DE ENTRADA — acontece com a janela FIXA no centro
   da tela (seção sticky), para o usuário ver tudo:

   - senha "digitada" conforme o scroll (login) — TYPE_RANGE
   - ao cruzar LOADING_AT → loading com TEMPO FIXO (LOADING_MS)
   - terminado o timer → a plataforma aparece e fica no respiro

   A altura do palco é `h-[360vh]` — aumente para mais respiro.
   ========================================================= */
/* Bandas do scroll (fração do palco). A de LOADING foi alargada
   (0.30→0.56 = ~26% do palco) p/ dar tempo de ver o carregamento
   mesmo rolando rápido. Aumente o palco (h-[...]) p/ esticar mais. */
/* O loading tem TEMPO FIXO: ao cruzar LOADING_AT (fração do scroll),
   ele dispara e roda por LOADING_MS — independente de quanto a pessoa
   role — e só então a plataforma aparece. Assim não dá pra "passar
   direto" pelo carregamento rolando rápido. */
/* LOADING_AT cedo + palco alto (h-[460vh]) garantem um RESPIRO grande
   DEPOIS que a plataforma aparece — ela fica "segurada"/explorável por
   bastante scroll em vez de descer na hora. */
const LOADING_AT = 0.16;
const LOADING_MS = 2600;
const TYPE_RANGE = { from: 0.04, to: 0.14 }; // digitação da senha (no login)
type Stage = "login" | "loading" | "platform";

/* Morph entre telas: sai desfocando e encolhendo, entra nítida */
const screenMorph = {
  initial: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 1.04, filter: "blur(8px)" },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

/* Tela 1 — login simulado; a senha é "digitada" pelo scroll */
function LoginScreen({ typedDots }: { typedDots: number }) {
  return (
    <motion.div
      {...screenMorph}
      className="flex min-h-[420px] items-center justify-center p-8 md:min-h-[480px]"
    >
      <div className="w-full max-w-xs text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent/15 text-accent">
          <Sparkles className="size-6" aria-hidden />
        </span>
        <h3 className="mt-4 font-semibold">Bem-vindo de volta</h3>
        <p className="mt-1 text-xs text-muted">Entre para ver a sua operação</p>
        <div className="mt-6 space-y-3 text-left">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
            <Mail className="size-4 shrink-0 text-muted" aria-hidden />
            <span className="text-xs text-foreground/85">voce@suaempresa.com.br</span>
          </div>
          <div className="flex h-10 items-center gap-3 rounded-xl bg-white/5 px-4">
            <Lock className="size-4 shrink-0 text-muted" aria-hidden />
            <span className="flex items-center gap-1" aria-label="senha sendo digitada">
              {Array.from({ length: typedDots }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className="size-1.5 rounded-full bg-foreground/60"
                />
              ))}
              {/* cursor piscando enquanto "digita" */}
              {typedDots < 8 && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="ml-0.5 h-3.5 w-px bg-foreground/60"
                />
              )}
            </span>
          </div>
        </div>
        {/* botão "acende" quando a senha termina de ser digitada */}
        <motion.div
          animate={
            typedDots >= 8
              ? { scale: [1, 1.05, 1], opacity: 1 }
              : { scale: 1, opacity: 0.55 }
          }
          transition={
            typedDots >= 8
              ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
          }
          className="mt-5 rounded-xl bg-gradient-to-r from-accent to-accent-2 py-3 text-center text-sm font-semibold text-background"
        >
          Entrar
        </motion.div>
        <p className="mt-4 text-[10px] text-muted">Continue rolando para entrar</p>
      </div>
    </motion.div>
  );
}

/* Tela 2 — carregando a operação */
function LoadingScreen() {
  return (
    <motion.div
      {...screenMorph}
      className="flex min-h-[420px] flex-col items-center justify-center gap-5 p-8 md:min-h-[480px]"
    >
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        className="text-accent"
      >
        <Loader2 className="size-9" aria-hidden />
      </motion.span>
      <p className="text-sm font-medium text-foreground/90">Organizando seus dados...</p>
      <div className="h-1.5 w-56 overflow-hidden rounded-full bg-white/6">
        <motion.div
          initial={{ width: "5%" }}
          animate={{ width: ["5%", "30%", "55%", "78%", "98%"] }}
          transition={{ duration: 2.4, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
        />
      </div>
      <p className="text-[10px] text-muted">
        planilhas, WhatsApp e sistemas virando uma coisa só
      </p>
    </motion.div>
  );
}

/* ---------- Visuais de cada módulo (puramente ilustrativos) ---------- */

function VisualVendas() {
  const meses = ["mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const valores = [42, 58, 48, 66, 60, 78, 70, 88, 82, 96];
  const vList = useV(listVariants);
  const vRow = useV(rowVariants);
  const vPop = useV(popVariants);
  const vBar = useV(barVariants);
  return (
    <motion.div variants={vList} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          ["Hoje", "R$ 48,2 mil", "+12% vs ontem"],
          ["Ticket médio", "R$ 186", "+4% no mês"],
          ["Conversão", "3,4%", "meta: 3,0%"],
        ].map(([label, value, delta]) => (
          <motion.div key={label} variants={vRow} className="rounded-lg bg-white/4 p-3">
            <p className="truncate text-[10px] text-muted">{label}</p>
            <p className="mt-1 truncate text-sm font-semibold">{value}</p>
            <p className="truncate text-[9px] font-medium text-accent-2">{delta}</p>
          </motion.div>
        ))}
      </div>
      <div>
        <motion.div variants={vList} className="flex h-24 items-end gap-2">
          {valores.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1 self-stretch">
              {i === valores.length - 1 && (
                <motion.span variants={vPop} className="text-[8px] font-semibold text-accent">
                  96k
                </motion.span>
              )}
              <motion.div
                variants={vBar}
                style={{ height: `${h}%` }}
                className="w-full origin-bottom rounded-t-sm bg-gradient-to-t from-accent/25 to-accent"
              />
            </div>
          ))}
        </motion.div>
        <div className="mt-1 flex gap-2">
          {meses.map((m) => (
            <span key={m} className="flex-1 text-center text-[8px] text-muted">
              {m}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function VisualMetas() {
  const metas: Array<[string, number, boolean]> = [
    ["Faturamento mensal", 82, true],
    ["Novos clientes", 64, false],
    ["Tempo de resposta", 91, true],
  ];
  const vList = useV(listVariants);
  const vRow = useV(rowVariants);
  const vPop = useV(popVariants);
  const vFill = useV(fillVariants);
  return (
    <motion.div variants={vList} className="space-y-4">
      {metas.map(([label, pct, noRitmo]) => (
        <motion.div key={label} variants={vRow}>
          <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
            <span className="truncate text-foreground/85">{label}</span>
            <span className="flex shrink-0 items-center gap-2">
              <motion.span
                variants={vPop}
                className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
                  noRitmo ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"
                }`}
              >
                {noRitmo ? "no ritmo" : "atenção"}
              </motion.span>
              <span className="font-semibold text-accent-2">{pct}%</span>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/6">
            <motion.div
              variants={vFill}
              custom={pct}
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
            />
          </div>
        </motion.div>
      ))}
      <motion.p variants={vRow} className="text-xs text-muted">
        3 de 4 metas no ritmo para fechar o trimestre.
      </motion.p>
    </motion.div>
  );
}

function VisualCalendario() {
  const destaque = [3, 9, 16, 22];
  const cellVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  };
  const vGrid = useV({ hidden: {}, show: { transition: { staggerChildren: 0.015 } } });
  const vCell = useV(cellVariants);
  const vList = useV(listVariants);
  const vPop = useV(popVariants);
  return (
    <div>
      <div className="mb-1.5 grid grid-cols-7 gap-1.5">
        {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
          <span key={i} className="text-center text-[9px] font-semibold text-muted">
            {d}
          </span>
        ))}
      </div>
      <motion.div variants={vGrid} className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 28 }, (_, i) => (
          <motion.div
            key={i}
            variants={vCell}
            className={`flex h-8 items-center justify-center rounded-md text-[10px] sm:h-9 ${
              destaque.includes(i)
                ? "bg-accent/15 font-semibold text-accent"
                : "bg-white/4 text-muted"
            }`}
          >
            {i + 1}
          </motion.div>
        ))}
      </motion.div>
      <motion.div variants={vList} className="mt-3 flex flex-wrap gap-2 text-[10px]">
        <motion.span variants={vPop} className="rounded-full bg-accent/10 px-2.5 py-1 text-accent">
          Dia 04: Fechamento fiscal
        </motion.span>
        <motion.span variants={vPop} className="rounded-full bg-accent-2/10 px-2.5 py-1 text-accent-2">
          Dia 17: Reunião de metas
        </motion.span>
      </motion.div>
    </div>
  );
}

/* Lista padrão: linhas deslizam, selo de status pipoca */
function AnimatedRows({
  header,
  rows,
}: {
  header?: string;
  rows: Array<{ left: ReactNode; right: ReactNode }>;
}) {
  const vList = useV(listVariants);
  const vRow = useV(rowVariants);
  const vPop = useV(popVariants);
  return (
    <div>
      {header && (
        <p className="mb-2 text-[10px] font-semibold tracking-wide text-muted uppercase">
          {header}
        </p>
      )}
      <motion.ul variants={vList} className="space-y-2.5">
        {rows.map((row, i) => (
          <motion.li
            key={i}
            variants={vRow}
            className="flex items-center justify-between gap-3 rounded-lg bg-white/4 px-4 py-3"
          >
            {row.left}
            <motion.span variants={vPop} className="shrink-0">
              {row.right}
            </motion.span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

function VisualJuridico() {
  const rows: Array<[string, string, boolean]> = [
    ["Contrato Fornecedor Alfa", "vence em 12 dias", false],
    ["Acordo de nível de serviço", "vigente", true],
    ["Distribuidora Beta", "renovado ontem", true],
  ];
  return (
    <AnimatedRows
      header="Contratos monitorados"
      rows={rows.map(([nome, situacao, ok]) => ({
        left: <span className="truncate text-xs text-foreground/85">{nome}</span>,
        right: (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
              ok ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"
            }`}
          >
            {situacao}
          </span>
        ),
      }))}
    />
  );
}

function VisualChatIA() {
  const reduced = useReducedMotion();
  return (
    <motion.div variants={useV(listVariants)} className="space-y-3">
      <motion.div
        variants={useV(rowVariants)}
        className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-accent/15 px-4 py-2.5 text-xs"
      >
        Qual o prazo para reembolso de despesas de viagem?
      </motion.div>
      <motion.div
        variants={useV(rowVariants)}
        className="relative max-w-[85%] rounded-2xl rounded-bl-sm bg-white/6 px-4 py-2.5 text-xs"
      >
        {/* "digitando..." aparece e dá lugar à resposta */}
        {!reduced && (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.9, duration: 0.2 }}
            className="absolute inset-x-4 top-2.5 flex gap-1"
            aria-hidden
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.5, repeat: 2, delay: i * 0.12 }}
                className="size-1.5 rounded-full bg-foreground/40"
              />
            ))}
          </motion.span>
        )}
        <motion.span
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : 1, duration: 0.35 }}
          className="block"
        >
          Até 15 dias úteis após o envio do comprovante pelo portal interno.
          Valores acima de R$ 500 precisam de aprovação do gestor.
          <span className="mt-2 block text-[10px] font-medium text-accent">
            Fonte: Política de Despesas v3, pág. 4
          </span>
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

function VisualAtendimento() {
  const rows: Array<[string, string, boolean]> = [
    ["Maria: 2ª via de boleto", "Resolvido pela IA", true],
    ["João: status do pedido #4821", "Resolvido pela IA", true],
    ["Clínica Vida: renegociação", "Escalado para humano", false],
  ];
  return (
    <motion.div variants={useV(listVariants)}>
      <motion.div variants={useV(rowVariants)} className="mb-3 flex flex-wrap gap-2 text-[10px]">
        <span className="rounded-full bg-accent/10 px-2.5 py-1 font-medium text-accent">
          82% resolvido pela IA
        </span>
        <span className="rounded-full bg-white/6 px-2.5 py-1 text-muted">
          tempo médio de resposta: 32s
        </span>
      </motion.div>
      <AnimatedRows
        rows={rows.map(([nome, status, ia]) => ({
          left: <span className="truncate text-xs text-foreground/85">{nome}</span>,
          right: (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                ia ? "bg-accent/10 text-accent" : "bg-white/8 text-foreground/70"
              }`}
            >
              {status}
            </span>
          ),
        }))}
      />
    </motion.div>
  );
}

function VisualCustos() {
  // ordenado do maior para o menor consumo (diretriz: ranking ordenado)
  const rows: Array<[string, number]> = [
    ["Atendimento automatizado", 142],
    ["Chat com IA interno", 96],
    ["Relatórios automáticos", 74],
  ];
  const vList = useV(listVariants);
  const vRow = useV(rowVariants);
  const vFill = useV(fillVariants);
  return (
    <motion.div variants={vList}>
      {/* "Bullet bar": gasto atual vs orçamento, com número + percentual */}
      <motion.div variants={vRow}>
        <div className="mb-1 flex items-baseline justify-between">
          <p className="text-sm font-semibold">
            R$ 312 <span className="text-[10px] font-normal text-muted">de R$ 600 orçados</span>
          </p>
          <span className="text-[10px] font-semibold text-accent-2">52% do orçamento</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/6">
          <motion.div
            variants={vFill}
            custom={52}
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
          />
        </div>
      </motion.div>
      <motion.p
        variants={vRow}
        className="mt-3 mb-2 text-[10px] font-semibold tracking-wide text-muted uppercase"
      >
        Por automação
      </motion.p>
      <motion.ul variants={vList} className="space-y-3">
        {rows.map(([nome, valor]) => (
          <motion.li key={nome} variants={vRow}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="truncate text-foreground/85">{nome}</span>
              <span className="shrink-0 text-muted">R$ {valor}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
              <motion.div
                variants={vFill}
                custom={(valor / 142) * 100}
                className="h-full rounded-full bg-accent/70"
              />
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

function VisualRelatorios() {
  const rows: Array<[string, string]> = [
    ["Vendas da semana", "toda segunda, 08h"],
    ["Fluxo de caixa", "todo dia, 18h"],
    ["Indicadores do mês", "dia 1º, 09h"],
  ];
  return (
    <AnimatedRows
      header="Próximos envios automáticos"
      rows={rows.map(([nome, agenda]) => ({
        left: (
          <span className="flex min-w-0 items-center gap-3">
            <CheckCircle2 className="size-4 shrink-0 text-accent-2" aria-hidden />
            <span className="truncate text-xs text-foreground/85">{nome}</span>
          </span>
        ),
        right: <span className="text-[10px] text-muted">{agenda}</span>,
      }))}
    />
  );
}

function VisualSolicitacoes() {
  const rows: Array<[string, string, string, string]> = [
    ["Reposição de estoque (Loja 02)", "há 2 dias", "Em análise", "bg-amber-400/10 text-amber-300"],
    ["Acesso ao painel financeiro", "há 5 horas", "Aprovada", "bg-emerald-400/10 text-emerald-300"],
    ["Compra de notebooks", "há 4 dias", "Aguardando gestor", "bg-white/8 text-foreground/70"],
  ];
  return (
    <AnimatedRows
      rows={rows.map(([nome, idade, status, cor]) => ({
        left: (
          <span className="min-w-0">
            <span className="block truncate text-xs text-foreground/85">{nome}</span>
            <span className="text-[9px] text-muted">aberta {idade}</span>
          </span>
        ),
        right: (
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${cor}`}>
            {status}
          </span>
        ),
      }))}
    />
  );
}

/* ---------- Módulos: título, subtítulo, ícone e prévia ---------- */

type Module = {
  icon: LucideIcon;
  title: string;
  description: string;
  visual: ReactNode;
};

const MODULES: Module[] = [
  {
    icon: TrendingUp,
    title: "Dashboard de vendas em tempo real",
    description: "Faturamento, ticket médio e conversão atualizados a cada venda.",
    visual: <VisualVendas />,
  },
  {
    icon: Target,
    title: "Metas e indicadores",
    description: "KPIs por área e por pessoa, com alertas quando algo sai da rota.",
    visual: <VisualMetas />,
  },
  {
    icon: CalendarDays,
    title: "Planejamento e calendário",
    description: "Agenda operacional unificada: prazos, entregas e compromissos.",
    visual: <VisualCalendario />,
  },
  {
    icon: Scale,
    title: "Jurídico e fornecedores",
    description: "Contratos, vencimentos e obrigações organizados e monitorados.",
    visual: <VisualJuridico />,
  },
  {
    icon: MessageSquareText,
    title: "Chat com IA para normas e documentos",
    description: "Pergunte em linguagem natural e receba a resposta com a fonte.",
    visual: <VisualChatIA />,
  },
  {
    icon: Bot,
    title: "Atendimento automatizado",
    description: "IA responde o repetitivo e escala para humanos quando precisa.",
    visual: <VisualAtendimento />,
  },
  {
    icon: Cpu,
    title: "Gestão de custos de IA/API",
    description: "Quanto cada automação custa e quanto ela economiza, na tela.",
    visual: <VisualCustos />,
  },
  {
    icon: FileBarChart,
    title: "Relatórios automáticos",
    description: "Relatórios gerados e enviados sozinhos, no formato que você usa.",
    visual: <VisualRelatorios />,
  },
  {
    icon: Inbox,
    title: "Solicitações internas",
    description: "Pedidos entre áreas com responsável, prazo e status rastreável.",
    visual: <VisualSolicitacoes />,
  },
];

export default function PlatformModules() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const seqRef = useRef<HTMLDivElement>(null);

  /* Progresso do "palco" sticky: 0 quando a janela trava no centro,
     1 quando a página volta a andar. */
  const { scrollYProgress } = useScroll({
    target: seqRef,
    offset: ["start start", "end end"],
  });
  const settle = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const scale = useTransform(settle, transform([0, 0.08], [ZOOM_FROM, 1]));

  /* Estágio (login → loading → plataforma). A senha é digitada pelo
     scroll (login). Ao cruzar LOADING_AT dispara o loading com TEMPO
     FIXO (timer), que ao terminar mostra a plataforma. Rolar de volta
     ao login reseta tudo. */
  const [stage, setStage] = useState<Stage>("login");
  const stageRef = useRef<Stage>("login");
  const setStageBoth = (s: Stage) => {
    stageRef.current = s;
    setStage(s);
  };
  const [typedDots, setTypedDots] = useState(0);
  const loadTimer = useRef<number | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // senha "digitada" pelo scroll durante o login
    const t = (v - TYPE_RANGE.from) / (TYPE_RANGE.to - TYPE_RANGE.from);
    setTypedDots(Math.max(0, Math.min(8, Math.floor(t * 8))));

    if (v < LOADING_AT) {
      // voltou para o login → cancela o timer e reseta
      if (loadTimer.current) {
        clearTimeout(loadTimer.current);
        loadTimer.current = null;
      }
      if (stageRef.current !== "login") setStageBoth("login");
    } else if (stageRef.current === "login") {
      // cruzou o gatilho: inicia o loading com tempo fixo
      setStageBoth("loading");
      loadTimer.current = window.setTimeout(() => {
        setStageBoth("platform");
        loadTimer.current = null;
      }, LOADING_MS);
    }
  });

  // limpa o timer ao desmontar
  useEffect(() => {
    return () => {
      if (loadTimer.current) clearTimeout(loadTimer.current);
    };
  }, []);
  // Com "reduzir movimento", pula direto para a plataforma
  const shownStage: Stage = reduced ? "platform" : stage;

  const current = MODULES[active];

  return (
    <section id="plataforma" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        icon={LayoutGrid}
        eyebrow="A plataforma"
        title="Módulos sob medida, não pacote fechado."
        description="Faça login e navegue pelos módulos como se já estivesse dentro da plataforma:"
      />

      {/* Palco sticky: a janela fica PARADA no centro enquanto a
         sequência acontece; só "solta" depois do respiro final */}
      <div ref={seqRef} className={reduced ? "mt-14" : "relative mt-6 h-[460vh]"}>
        <div
          className={
            reduced
              ? ""
              : "sticky top-0 flex h-screen flex-col items-center justify-center"
          }
        >
      <motion.div
        style={reduced ? undefined : { scale }}
        initial={reduced ? false : { opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass w-full overflow-hidden rounded-3xl"
      >
        {/* Barra superior da "janela" — troque o nome do produto aqui */}
        <div className="flex items-center gap-3 px-5 py-3.5">
          <span className="grid size-7 place-items-center rounded-lg bg-accent/15 text-accent">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <span className="text-sm font-semibold">Central de Inteligência Operacional</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent-2/80" />
            <span className="size-2 rounded-full bg-accent/80" />
            <span className="size-2 rounded-full bg-white/20" />
          </span>
        </div>

        {/* Morph entre as telas da sequência (login → loading → plataforma) */}
        <AnimatePresence mode="wait" initial={false}>
          {shownStage === "login" && <LoginScreen key="login" typedDots={typedDots} />}
          {shownStage === "loading" && <LoadingScreen key="loading" />}
          {shownStage === "platform" && (
            <motion.div
              key="platform"
              initial={{ opacity: 0, scale: 0.9, y: 28, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
        <div className="grid md:grid-cols-[260px_1fr]">
          {/* Sidebar de módulos — o destaque desliza entre os itens */}
          {/* min-w-0: impede a lista rolável de alargar o grid no mobile */}
          <aside className="min-w-0 border-b border-white/8 p-3 md:border-r md:border-b-0">
            <p className="px-3 pt-1 pb-2 text-[10px] font-semibold tracking-widest text-muted uppercase">
              Módulos
            </p>
            <ul className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] md:block md:space-y-1 md:overflow-visible md:pb-0">
              {MODULES.map((module, i) => {
                const isActive = active === i;
                return (
                  <li key={module.title} className="shrink-0 md:shrink">
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium whitespace-nowrap transition-colors md:whitespace-normal ${
                        isActive ? "text-foreground" : "text-muted hover:text-foreground/85"
                      }`}
                    >
                      {/* Destaque que DESLIZA até o item selecionado */}
                      {isActive && (
                        <motion.span
                          layoutId="module-highlight"
                          transition={
                            reduced
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 380, damping: 32 }
                          }
                          className="absolute inset-0 rounded-lg bg-accent/12"
                          aria-hidden
                        />
                      )}
                      <motion.span
                        animate={reduced ? undefined : { scale: isActive ? 1.15 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                        className={`relative z-10 shrink-0 ${isActive ? "text-accent" : ""}`}
                      >
                        <module.icon className="size-4" aria-hidden />
                      </motion.span>
                      <span className="relative z-10 md:truncate">{module.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Prévia do módulo ativo — entra em cascata a cada seleção */}
          {/* altura FIXA: o conteúdo de cada módulo cabe aqui sem mudar
             o tamanho da janela (antes o calendário "expandia" o painel) */}
          <div className="relative h-[480px] min-w-0 overflow-hidden p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                variants={reduced ? undefined : panelVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
              >
                <motion.span
                  variants={itemVariants}
                  className="grid size-12 place-items-center rounded-xl bg-accent/12 text-accent"
                >
                  <current.icon className="size-6" aria-hidden />
                </motion.span>
                <motion.h3 variants={itemVariants} className="mt-4 text-lg font-semibold md:text-xl">
                  {current.title}
                </motion.h3>
                <motion.p variants={itemVariants} className="mt-1.5 text-sm text-muted">
                  {current.description}
                </motion.p>
                <motion.div variants={itemVariants} className="mt-6">
                  {current.visual}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Indicador de posição (como paginação) */}
            <div className="absolute right-6 bottom-4 hidden items-center gap-1.5 md:flex">
              {MODULES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active === i ? "w-5 bg-accent" : "w-1.5 bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="mt-4 text-center text-xs text-muted">
        {shownStage === "platform"
          ? "Passe o mouse pela lista para explorar cada módulo."
          : "Continue rolando..."}
      </p>
        </div>
      </div>
    </section>
  );
}
