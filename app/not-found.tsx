import type { Metadata } from "next";
import Link from "next/link";
import { PaginaSimples } from "@/components/PaginaSimples";
import { Simbolo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

// 404 com o grão do logo no lugar do zero.
export default function NaoEncontrada() {
  return (
    <PaginaSimples escura>
      <div className="mx-auto flex max-w-[1100px] flex-col items-center px-5 py-20 text-center md:py-28">
        <p className="display-tight flex items-center text-[42vw] leading-none text-areia md:text-[18rem]" aria-label="404">
          <span aria-hidden>4</span>
          <Simbolo className="mx-[0.04em] h-[0.72em] w-auto text-laranja motion-safe:animate-[balanco_4s_ease-in-out_infinite]" />
          <span aria-hidden>4</span>
        </p>
        <h1 className="display-tight mt-6 text-[13vw] md:text-7xl">Essa mesa não existe</h1>
        <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-areia/85">
          A página que você procurou saiu do cardápio ou nunca esteve nele. Mas o café continua passando sem pressa.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-laranja px-6 py-3 font-semibold text-verde transition-colors hover:bg-leite">
            Voltar ao início
          </Link>
          <Link href="/#cardapio" className="rounded-full px-6 py-3 font-semibold ring-1 ring-leite/60 transition-colors hover:bg-leite/10">
            Ver o cardápio
          </Link>
        </div>
      </div>
    </PaginaSimples>
  );
}
