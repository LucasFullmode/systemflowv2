"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  transform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  ClipboardCheck,
  Search,
  Map,
  Route,
  Rocket,
  TrendingUp,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import ParallaxGlow from "./ParallaxGlow";

/* ===== ETAPAS — ajuste textos e ícones do passo a passo aqui ===== */
const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Diagnóstico inicial",
    description:
      "Conversa para entender o negócio, os objetivos e as principais dores da operação.",
  },
  {
    icon: Search,
    title: "Imersão na operação",
    description:
      "Acompanhamos o dia a dia das áreas para ver como o trabalho realmente acontece.",
  },
  {
    icon: Map,
    title: "Mapeamento de dados e gargalos",
    description:
      "Levantamos onde estão os dados, o que é manual e onde o processo trava.",
  },
  {
    icon: Route,
    title: "Roadmap de implementação",
    description:
      "Plano priorizado por impacto: o que construir primeiro e o resultado esperado.",
  },
  {
    icon: Rocket,
    title: "Desenvolvimento do MVP",
    description:
      "Primeira versão funcional da plataforma em semanas, já gerando valor.",
  },
  {
    icon: TrendingUp,
    title: "Evolução contínua",
    description:
      "Novos módulos, automações e IA conforme a operação amadurece e cresce.",
  },
];

/* =========================================================
   TIMELINE GUIADA PELO SCROLL

   - A linha central se preenche (gradiente) conforme a seção
     atravessa a viewport — ajuste a velocidade no `offset`:
     "start 0.8" = começa quando o topo da lista atinge 80% da
     tela; "end 0.5" = completa quando o fim chega à metade.
   - Cada etapa desliza de um lado (alternado no desktop) e o
     número "pipoca" quando entra em cena.
   ========================================================= */
export default function HowItWorks() {
  const reduced = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);

  /* Preenchimento da linha: progresso 0 quando o TOPO da lista cruza
     o centro da tela, 1 quando o FIM cruza — assim a ponta da linha
     fica sempre por volta do centro (= etapa em foco). */
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 0.5", "end 0.5"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
  });

  /* ETAPA EM FOCO: dirigida pela POSIÇÃO na tela — cada etapa entra
     em foco quando alcança a faixa CENTRAL da viewport (onViewportEnter
     por etapa, abaixo). Começa em -1 (nenhuma). */
  const [focused, setFocused] = useState(-1);

  return (
    <section id="como-funciona" className="relative py-24 md:py-32">
      <ParallaxGlow
        shift={130}
        className="right-[-10%] top-[20%] h-[400px] w-[400px] bg-accent/[0.05]"
      />

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          icon={Route}
          eyebrow="Como funciona"
          title="Da bagunça à plataforma, em etapas claras."
          description="Um processo enxuto, com entregas visíveis desde as primeiras semanas."
        />

        <div ref={lineRef} className="relative mx-auto mt-16 max-w-4xl">
          {/* Trilho da timeline (esquerda no mobile, centro no desktop) */}
          <div className="absolute top-0 left-[19px] h-full w-0.5 bg-white/8 md:left-1/2 md:-translate-x-1/2" />
          {/* Preenchimento que cresce com o scroll */}
          <motion.div
            style={{ scaleY: reduced ? 1 : lineScale }}
            className="absolute top-0 left-[19px] h-full w-0.5 origin-top bg-gradient-to-b from-accent to-accent-2 md:left-1/2 md:-translate-x-1/2"
          />

          {/* Espaçamento NORMAL — quem controla o ritmo é o reveal:
             cada etapa fica escondida até ENTRAR na faixa central da
             tela (onViewportEnter), então a próxima não aparece antes
             de você rolar até ela. Sem timeline gigante. */}
          <ol className="space-y-20 md:space-y-28">
            {STEPS.map((step, i) => {
              const fromLeft = i % 2 === 0; // desktop: alterna os lados
              const isFocused = focused === i && !reduced;
              return (
                /* CADÊNCIA: a etapa anima quando ENTRA NA FAIXA CENTRAL da
                   tela (onViewportEnter) — fica centralizada em foco, e a
                   próxima só aparece quando você rola até ela. `i <= focused`
                   mantém as anteriores visíveis. */
                <motion.li
                  key={step.title}
                  initial={reduced ? "show" : "hidden"}
                  animate={reduced || i <= focused ? "show" : "hidden"}
                  onViewportEnter={() => {
                    if (!reduced) setFocused(i);
                  }}
                  viewport={{ margin: "-40% 0px -40% 0px" }}
                  className="relative pl-16 md:pl-0"
                >
                  {/* Nó numerado sobre a linha (aceso quando em foco) */}
                  <motion.span
                    variants={{ hidden: { scale: 0 }, show: { scale: 1 } }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 17,
                      delay: 0.1,
                    }}
                    className="absolute top-1 left-0 md:left-1/2 md:-translate-x-1/2"
                  >
                    <span
                      className={`grid size-10 place-items-center rounded-full border font-mono text-sm font-bold transition-all duration-500 ${
                        isFocused
                          ? "scale-110 border-accent bg-accent text-background shadow-[0_0_20px_rgba(198,255,52,0.4)]"
                          : "border-accent/40 bg-surface text-accent"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </motion.span>

                  {/* Card da etapa, deslizando do seu lado da linha.
                     O foco (visual diferenciado) fica num wrapper interno
                     para não brigar com o transform do motion. */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: fromLeft ? -48 : 48 },
                      show: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
                    className={`md:w-[calc(50%-44px)] ${fromLeft ? "" : "md:ml-auto"}`}
                  >
                    {/* Em foco: STROKE EM GRADIENTE com as MESMAS CORES da
                       linha (accent → accent-2) + halo difuso (glow). O anel
                       cruza com fade suave conforme o foco troca no scroll. */}
                    <div
                      className={`relative transition-transform duration-500 ${
                        isFocused ? "scale-[1.03]" : ""
                      }`}
                    >
                      <div
                        className={`absolute -inset-[2px] transition-opacity duration-500 ${
                          isFocused ? "opacity-100" : "opacity-0"
                        }`}
                        aria-hidden
                      >
                        {/* anel nítido em gradiente, 2px uniformes */}
                        <div className="absolute inset-0 rounded-[18px] bg-gradient-to-r from-accent to-accent-2" />
                        {/* máscara interna (o vidro é translúcido) */}
                        <div className="absolute inset-[2px] rounded-2xl bg-surface" />
                      </div>
                      {/* em foco, a sombra própria do vidro é desligada —
                         ela pintava por cima do anel e esfumava a borda
                         de baixo (boxShadow inline vence o .glass) */}
                      <div
                        style={isFocused ? { boxShadow: "none" } : undefined}
                        className={`glass relative rounded-2xl p-6 transition-colors duration-500 ${
                          isFocused ? "border-transparent bg-accent/[0.05]" : "hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid size-8 shrink-0 place-items-center text-accent">
                            <step.icon className="size-5" aria-hidden strokeWidth={1.5} />
                          </span>
                          <h3 className="font-semibold">{step.title}</h3>
                        </div>
                        <p className="mt-3 text-sm text-muted">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* Depois de "Evolução contínua", a linha se SOLTA da timeline:
           serpenteia, passa por pins de updates reais e sai da tela. */}
        <TimelineTail reduced={reduced} />
      </div>
    </section>
  );
}

/* =========================================================
   CAUDA LIVRE DA TIMELINE — ajuste aqui.

   PINS: exemplos de evolução contínua que aparecem conforme a
   linha passa por eles. `at` é o ponto do desenho (0–1) em que
   o pin acende; d/m são as posições (%) desktop/mobile.
   Os caminhos SVG usam preserveAspectRatio="none", então as
   coordenadas do viewBox mapeiam direto em % do contêiner.
   ========================================================= */
const PINS = [
  { label: "+ Módulo de NPS dos clientes", at: 0.3, d: { x: 72, y: 38 }, m: { x: 70, y: 33 } },
  { label: "+ Integração com o ERP", at: 0.58, d: { x: 29, y: 70 }, m: { x: 30, y: 70 } },
  { label: "+ Agente de IA de cobrança", at: 0.82, d: { x: 70, y: 90 }, m: { x: 65, y: 92 } },
];

function TailPin({
  pin,
  progress,
  reduced,
}: {
  pin: (typeof PINS)[number];
  progress: MotionValue<number>;
  reduced: boolean | null;
}) {
  const opacity = useTransform(progress, transform([pin.at, pin.at + 0.08], [0, 1]));
  const scale = useTransform(progress, transform([pin.at, pin.at + 0.08], [0.6, 1]));
  const vars = {
    "--pin-x": `${pin.m.x}%`,
    "--pin-y": `${pin.m.y}%`,
    "--pin-x-md": `${pin.d.x}%`,
    "--pin-y-md": `${pin.d.y}%`,
  } as Record<string, string>;
  return (
    <motion.div
      style={{ ...vars, ...(reduced ? {} : { opacity, scale }) }}
      className="absolute left-[var(--pin-x)] top-[var(--pin-y)] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 md:left-[var(--pin-x-md)] md:top-[var(--pin-y-md)]"
    >
      <span className="relative grid size-3 place-items-center">
        <span className="absolute size-3 animate-ping rounded-full bg-accent-2/40" />
        <span className="size-2 rounded-full bg-accent-2 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
      </span>
      <span className="glass rounded-full px-3 py-1.5 text-[10px] font-medium whitespace-nowrap text-foreground/90">
        {pin.label}
      </span>
    </motion.div>
  );
}

function TimelineTail({ reduced }: { reduced: boolean | null }) {
  const tailRef = useRef<HTMLDivElement>(null);
  /* SINCRONIA: a linha reta da timeline completa quando o fim da
     lista cruza 50% da viewport ("end 0.5" lá em cima). A cauda
     começa nesse MESMO instante — o topo dela está colado no fim
     da lista, então o desenho parte de "start 0.5". */
  const { scrollYProgress } = useScroll({
    target: tailRef,
    offset: ["start 0.5", "end 0.4"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const pathLength = useTransform(progress, transform([0, 0.95], [0, 1]));

  return (
    <div ref={tailRef} className="relative mx-auto mt-2 h-64 max-w-4xl overflow-hidden md:h-80">
      {/* Desenho desktop (parte do centro) e mobile (parte da esquerda).
         O traço nasce e morre em fade, então o encaixe com a timeline
         é suave em qualquer largura de tela. */}
      <svg
        viewBox="0 0 600 320"
        preserveAspectRatio="none"
        className="hidden h-full w-full md:block"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="tail-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0" />
            <stop offset="12%" stopColor="var(--accent-2)" stopOpacity="0.9" />
            <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 300 0 C 300 60, 425 62, 435 122 C 444 178, 185 168, 172 224 C 160 278, 400 268, 620 330"
          stroke="url(#tail-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          style={reduced ? undefined : { pathLength }}
        />
      </svg>
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        className="h-full w-full md:hidden"
        fill="none"
        aria-hidden
      >
        {/* gradiente duplicado: refs para defs dentro de svg com
           display:none falham em alguns navegadores */}
        <defs>
          <linearGradient id="tail-grad-m" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0" />
            <stop offset="12%" stopColor="var(--accent-2)" stopOpacity="0.9" />
            <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 22 0 C 22 50, 280 42, 288 100 C 295 152, 105 150, 118 210 C 128 258, 300 252, 420 300"
          stroke="url(#tail-grad-m)"
          strokeWidth="2"
          strokeLinecap="round"
          style={reduced ? undefined : { pathLength }}
        />
      </svg>

      {/* Pins de updates ao longo do caminho */}
      {PINS.map((pin) => (
        <TailPin key={pin.label} pin={pin} progress={progress} reduced={reduced} />
      ))}
    </div>
  );
}
