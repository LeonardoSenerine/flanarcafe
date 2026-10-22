import Image from "next/image";
import { contato, galeria } from "@/lib/content";
import { AnimacoesGaleria } from "./Animacoes";
import { Seta } from "./Seta";

function Fileira({ fotos, className }: { fotos: string[]; className: string }) {
  return (
    <div className={`${className} flex w-max gap-3 md:gap-5`}>
      {fotos.map((src) => (
        <div key={src} className="relative aspect-[3/4] h-[46vw] shrink-0 overflow-hidden rounded-[24px] transition-transform duration-500 ease-out hover:-translate-y-2 hover:-rotate-1 md:h-[24vw]">
          <Image src={src} alt="" fill sizes="(min-width: 768px) 18vw, 35vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

// Duas fileiras de fotos que deslizam em sentidos opostos com o scroll.
export function Galeria() {

  return (
    <section id="galeria" aria-labelledby="galeria-titulo" className="overflow-hidden bg-areia py-24 md:py-36">
      <AnimacoesGaleria />
      <Fileira fotos={galeria} className="galeria-a" />

      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 py-16 text-center md:py-24">
        <h2 id="galeria-titulo" className="display-tight text-[20vw] md:text-[10vw]">
          Momento flanar
        </h2>
        <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-verde/90">
          A mesa cheia, a caneca verde, a luz da tarde batendo na parede. No Instagram tem mais.
        </p>
        <a
          href={contato.instagram}
          target="_blank"
          rel="noreferrer"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-verde px-7 py-3.5 font-medium text-areia transition hover:-translate-y-0.5 hover:bg-verde-escuro"
        >
          Seguir {contato.instagramHandle}
          <Seta direcao="fora" />
        </a>
      </div>

      <Fileira fotos={[...galeria].reverse()} className="galeria-b" />
    </section>
  );
}
