import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Syne } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Serifa de display (títulos) — dá a cara editorial/premium.
   Para trocar a fonte dos títulos, troque aqui. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

/* Fonte da MARCA (wordmark) — distinta do corpo e do título.
   Troque por outra Google Font aqui para testar o logo. */
const syne = Syne({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["700", "800"],
});

// AJUSTE AQUI: título e descrição que aparecem no Google e na aba do navegador
export const metadata: Metadata = {
  title: "Inteligência Operacional para a sua empresa | ia.consulting",
  description:
    "Transforme operação bagunçada em inteligência operacional. Centralize dados, processos, dashboards, automações e IA em uma plataforma sob medida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
