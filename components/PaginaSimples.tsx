import Link from "next/link";
import { contato } from "@/lib/content";
import { Logo } from "./Logo";
import { Credito } from "./Credito";

// Moldura das páginas internas (privacidade, 404): só o logo e o caminho de volta,
// sem o menu de âncoras da página inicial.
export function PaginaSimples({ children, escura }: { children: React.ReactNode; escura?: boolean }) {
  return (
    <div className={`flex min-h-svh flex-col ${escura ? "bg-verde text-leite" : "bg-leite text-verde"}`}>
      <header className="px-3 pt-3 md:px-6 md:pt-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full bg-areia-claro/85 py-2 pr-2 pl-5 text-verde ring-1 ring-verde/10 backdrop-blur-md">
          <Link href="/" aria-label="Flanar Café, voltar ao início">
            <Logo title="" className="h-10 w-auto md:h-11" />
          </Link>
          <Link href="/" className="rounded-full bg-verde px-5 py-2.5 text-sm font-medium text-areia transition-colors hover:bg-verde-escuro">
            Voltar ao site
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className={`px-5 py-8 text-sm md:px-8 ${escura ? "text-areia/90" : "text-verde/80"}`}>
        <div className="mx-auto flex max-w-[1400px] flex-wrap justify-between gap-3">
          <p>
            © {new Date().getFullYear()} Flanar Café · {contato.endereco}, {contato.bairro}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacidade" className="underline-offset-4 hover:underline">
              Política de privacidade
            </Link>
            <Credito />
          </div>
        </div>
      </footer>
    </div>
  );
}
