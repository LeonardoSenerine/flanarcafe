import Link from "next/link";
import { contato, nav } from "@/lib/content";
import { LogoVertical } from "./Logo";
import { AnimacoesRodape } from "./Animacoes";

export function Rodape() {

  return (
    <footer id="rodape" className="relative z-20 -mt-10 overflow-hidden rounded-t-[40px] bg-verde px-5 pt-20 pb-6 text-areia md:-mt-16 md:rounded-t-[64px] md:px-8 md:pt-28">
      <AnimacoesRodape />
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <LogoVertical className="h-36 w-auto text-leite md:h-44" />
          <p className="display-soft mt-8 max-w-[16ch] text-[2.2rem] md:text-[3rem]">Vem viver seu momento flanar.</p>
        </div>
        <address className="text-lg leading-relaxed not-italic">
          {contato.endereco}
          <br />
          {contato.bairro}
          <br />
          {contato.horarios.map((h) => (
            <span key={h.dias} className="block text-areia/90">
              {h.dias}, {h.horas}
            </span>
          ))}
        </address>
        <nav aria-label="Rodapé" className="flex flex-col gap-2 text-lg">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-laranja">
              {item.label}
            </a>
          ))}
          <a href={contato.instagram} target="_blank" rel="noreferrer" className="hover:text-laranja">
            Instagram {contato.instagramHandle}
          </a>
        </nav>
      </div>

      <p aria-hidden className="rodape-palavra display-tight mt-16 flex justify-center overflow-hidden pt-[0.06em] text-[39vw] leading-[0.78] text-laranja md:mt-24">
        {"flanar".split("").map((l, i) => (
          <span key={i} className="rodape-letra inline-block">
            {l}
          </span>
        ))}
      </p>

      <p className="mt-6 text-center text-sm text-areia/90">
        © {new Date().getFullYear()} Flanar Café ·{" "}
        <Link href="/privacidade" className="underline-offset-4 hover:text-laranja hover:underline">
          Política de privacidade
        </Link>
      </p>
    </footer>
  );
}
