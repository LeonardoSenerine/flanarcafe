import { desenvolvedor } from "@/lib/content";
import { Seta } from "./Seta";

// "Desenvolvido por senerine.dev", no mesmo formato do crédito da SURAMU.
export function Credito({ className = "" }: { className?: string }) {
  return (
    <a
      href={desenvolvedor.url}
      target="_blank"
      rel="noopener"
      className={`group inline-flex items-center gap-1 underline-offset-4 hover:underline ${className}`}
    >
      Desenvolvido por <b className="font-bold">{desenvolvedor.nome}</b>
      <Seta direcao="fora" />
    </a>
  );
}
