import type { Metadata } from "next";
import Deck from "./Deck";

/* Apresentação interativa (deck) — Sistema de Gestão de Estoque & Comissões.
   Servida em /presentation_01, na mesma base/identidade do SystemFlow. */
export const metadata: Metadata = {
  title: "Proposta de Estoque & Comissões | SystemFlow",
  description:
    "Apresentação da plataforma sob medida de gestão de estoque e comissões: do grupo de WhatsApp e da planilha para tudo num só lugar, em tempo real.",
};

export default function Presentation01Page() {
  return <Deck />;
}
