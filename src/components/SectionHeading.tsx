import type { LucideIcon } from "lucide-react";
import FadeIn from "./FadeIn";
import TextReveal from "./TextReveal";

/* Cabeçalho padrão das seções.
   - align="center" (padrão): tudo centralizado.
   - align="split": EDITORIAL — eyebrow+título à ESQUERDA e a descrição
     na coluna ao LADO.
   O ÍCONE fica SEM caixa, inline ao lado da etiqueta, na cor do texto
   (neutro — não colorido). Passe um ícone lucide neutro (não emoji). */
export default function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
  align = "center",
}: {
  icon?: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "split";
}) {
  const EyebrowRow = (
    <span
      className={`flex items-center gap-2 ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      {Icon && (
        <Icon className="size-4 text-accent" strokeWidth={1.5} aria-hidden />
      )}
      <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        {eyebrow}
      </span>
    </span>
  );

  /* ----- Variante EDITORIAL (assimétrica) ----- */
  if (align === "split") {
    return (
      <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <FadeIn>{EyebrowRow}</FadeIn>
          <TextReveal
            text={title}
            delay={0.1}
            className="font-display mt-4 block text-3xl leading-[1.05] text-balance md:text-5xl"
          />
        </div>
        {description && (
          <FadeIn delay={0.2} className="md:pb-2">
            <p className="text-muted text-pretty md:text-lg">{description}</p>
          </FadeIn>
        )}
      </div>
    );
  }

  /* ----- Variante centralizada (padrão) ----- */
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <FadeIn>{EyebrowRow}</FadeIn>
      <TextReveal
        text={title}
        delay={0.1}
        className="font-display mt-4 block text-3xl leading-[1.1] text-balance md:text-5xl"
      />
      {description && (
        <FadeIn delay={0.24}>
          <p className="mt-5 text-muted text-pretty md:text-lg">{description}</p>
        </FadeIn>
      )}
    </div>
  );
}
