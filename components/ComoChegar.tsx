import Image from "next/image";
import { contato, mapsEmbed, mapsUrl, wazeUrl } from "@/lib/content";
import { AnimacoesComoChegar } from "./Animacoes";
import { Seta } from "./Seta";

export function ComoChegar() {

  return (
    <section id="como-chegar" className="relative z-10 -mt-10 rounded-t-[40px] bg-verde-medio px-5 py-28 text-leite md:-mt-16 md:rounded-t-[64px] md:px-8 md:py-40">
      <AnimacoesComoChegar />
      <div className="mx-auto grid max-w-[1400px] gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <h2 className="display-tight text-[23vw] md:text-[9vw]">Como chegar</h2>

          <address className="display-soft mt-10 text-[1.9rem] not-italic md:mt-14 md:text-[2.4rem]">
            {contato.endereco}
            <br />
            <span className="text-leite/90">{contato.bairro}</span>
          </address>

          <dl className="mt-10 max-w-md">
            {contato.horarios.map((h) => (
              <div key={h.dias} className="flex justify-between gap-6 border-t border-leite/25 py-4 text-lg">
                <dt>{h.dias}</dt>
                <dd className="font-semibold">{h.horas}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-areia px-6 py-3.5 font-semibold text-verde transition hover:-translate-y-0.5 hover:bg-leite">
              Abrir no Google Maps
              <Seta direcao="fora" />
            </a>
            <a href={wazeUrl} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-medium ring-1 ring-leite/50 transition-colors hover:bg-leite/10">
              Abrir no Waze
              <Seta direcao="fora" />
            </a>
          </div>
          <p className="mt-8 max-w-[40ch] leading-relaxed text-leite/85">
            Prefere receber em casa? A Flanar também entrega.{" "}
            <a href={contato.links} target="_blank" rel="noreferrer" className="font-semibold underline decoration-laranja decoration-2 underline-offset-4">
              Ver delivery e outros links
            </a>
          </p>
        </div>

        <div className="relative md:col-span-7">
          <div className="mapa h-[110vw] overflow-hidden rounded-[32px] bg-verde md:h-[640px]">
            <iframe
              src={mapsEmbed}
              title="Mapa com a localização da Flanar Café"
              className="h-full w-full border-0 saturate-[0.8]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          {/* A fachada, pra reconhecer de longe quem chega pela rua */}
          <figure className="fachada absolute -bottom-12 -left-3 aspect-[3/4] w-[46%] overflow-hidden rounded-[28px] ring-8 ring-verde-medio md:-bottom-16 md:-left-12 md:w-[32%]">
            <Image
              src="/fotos/fachada.jpg"
              alt="Fachada da Flanar Café: letreiro verde com o logo laranja, paredes laranja e a porta de entrada entre duas vitrines"
              fill
              sizes="(min-width: 768px) 22vw, 46vw"
              className="object-cover object-[50%_45%]"
            />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-leite/90 px-3 py-1 text-sm font-semibold text-verde backdrop-blur">É aqui</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
