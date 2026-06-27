import type { LucideIcon } from "lucide-react";
import {
  Table2,
  MessageCircle,
  FileText,
  TrendingUp,
  Target,
  Scale,
  Truck,
  FolderOpen,
  Headphones,
  Wallet,
  CalendarDays,
  Cpu,
  BarChart3,
  Inbox,
} from "lucide-react";

/* =========================================================
   CARDS FLUTUANTES DO HERO — ajuste tudo aqui.

   POSIÇÕES: distribuídas num "anel" ao redor do texto central
   (que ocupa ~25–75% x, ~30–70% y), com espaçamento regular:
   linha de cima, coluna direita, linha de baixo, coluna esquerda.
   Nenhum card nasce fora da tela (cards largos ficam mais ao
   centro). `leftM/topM` sobrescrevem a posição no MOBILE.

   - left / top   : posição inicial DESKTOP em % da tela
   - leftM / topM : posição inicial MOBILE (opcional; padrão = desktop)
   - rotate       : rotação inicial em graus (ar "caótico")
   - target       : âncora de destino no dashboard (ver DashboardMockup)
   - delay        : 0–1, sincronizado com o BUILD do mockup para o
                    pouso coincidir com o módulo acendendo
   - desktopOnly  : true esconde o card no mobile (menos ruído)
   ========================================================= */
export type OpsCardConfig = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** cor do ícone (classe Tailwind) — cada área tem a sua */
  color: string;
  left: number;
  top: number;
  leftM?: number;
  topM?: number;
  rotate: number;
  target: string;
  delay: number;
  desktopOnly?: boolean;
};

/* Posições ESPALHADAS de forma orgânica (não-simétrica), evitando o
   miolo central (onde fica o texto/dashboard). Cada card tem um leve
   ângulo próprio. As coordenadas foram escolhidas "a olho" para não
   formarem um anel/oval — ajuste left/top à vontade. */
export const OPS_CARDS: OpsCardConfig[] = [
  /* Distribuídos em volta do texto central — densos o suficiente p/
     não deixar buracos, mas SEM invadir a navbar (topo) nem a coluna
     do texto (miolo). 4 à esquerda, 3 no topo, 3 à direita, 4 embaixo. */
  { id: "planilhas", label: "Planilhas", icon: Table2, color: "text-foreground/55", left: 9, top: 16, leftM: 4, topM: 14, rotate: -6, target: "side-visao", delay: 0 },
  { id: "financeiro", label: "Financeiro", icon: Wallet, color: "text-foreground/55", left: 25, top: 12, leftM: 56, topM: 14, rotate: 5, target: "side-financeiro", delay: 0.05 },
  { id: "vendas", label: "Vendas", icon: TrendingUp, color: "text-foreground/55", left: 84, top: 58, rotate: -7, target: "kpi-vendas", delay: 0.1, desktopOnly: true },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-foreground/55", left: 80, top: 16, rotate: 4, target: "side-atendimento", delay: 0.15, desktopOnly: true },

  { id: "metas", label: "Metas", icon: Target, color: "text-foreground/55", left: 4, top: 40, rotate: 9, target: "kpis", delay: 0.2, desktopOnly: true },
  { id: "juridico", label: "Jurídico", icon: Scale, color: "text-foreground/55", left: 89, top: 37, rotate: -5, target: "side-juridico", delay: 0.25, desktopOnly: true },
  { id: "atendimento", label: "Atendimento", icon: Headphones, color: "text-foreground/55", left: 39, top: 83, rotate: 7, target: "kpi-atendimentos", delay: 0.3, desktopOnly: true },
  { id: "indicadores", label: "Indicadores", icon: BarChart3, color: "text-foreground/55", left: 9, top: 62, rotate: -3, target: "chart", delay: 0.35, desktopOnly: true },
  { id: "fornecedores", label: "Fornecedores", icon: Truck, color: "text-foreground/55", left: 13, top: 84, rotate: 6, target: "side-fornecedores", delay: 0.4, desktopOnly: true },

  { id: "relatorios", label: "Relatórios manuais", icon: FileText, color: "text-foreground/55", left: 27, top: 86, leftM: 5, topM: 84, rotate: -4, target: "chart", delay: 0.5 },
  { id: "calendario", label: "Calendário", icon: CalendarDays, color: "text-foreground/55", left: 85, top: 80, rotate: -8, target: "side-planejamento", delay: 0.55, desktopOnly: true },
  { id: "custos-ia", label: "Custos de IA/API", icon: Cpu, color: "text-foreground/55", left: 66, top: 85, rotate: 5, target: "kpi-custo", delay: 0.6, desktopOnly: true },
  { id: "solicitacoes", label: "Solicitações internas", icon: Inbox, color: "text-foreground/55", left: 69, top: 13, rotate: -6, target: "solicitacoes", delay: 0.75, desktopOnly: true },
  { id: "documentos", label: "Documentos", icon: FolderOpen, color: "text-foreground/55", left: 52, top: 89, leftM: 58, topM: 84, rotate: 8, target: "side-chat", delay: 0.9 },
];
