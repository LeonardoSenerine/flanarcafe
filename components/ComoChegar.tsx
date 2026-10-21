"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { contato, mapsEmbed, mapsUrl, wazeUrl } from "@/lib/content";

export function ComoChegar() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".mapa",
          { clipPath: "circle(12% at 50% 50%)" },
          {
            clipPath: "circle(75% at 50% 50%)",
            ease: "none",
            scrollTrigger: { trigger: ".mapa", start: "top 90%", end: "center 55%", scrub: true },
          },
        );
        gsap.from(".janela", {
          rotate: -25,
          scale: 0.6,
          ease: "none",
          scrollTrigger: { trigger: ".mapa", start: "top 90%", end: "center 55%", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="como-chegar" ref={root} className="bg-verde-medio px-5 py-28 text-leite md:px-8 md:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <h2 className="display-tight text-[23vw] md:text-[9vw]">Como chegar</h2>

          <address className="display-soft mt-10 text-[1.9rem] not-italic md:mt-14 md:text-[2.4rem]">
            {contato.endereco}
            <br />
            <span className="text-leite/75">{contato.bairro}</span>
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
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="rounded-full bg-areia px-6 py-3.5 font-semibold text-verde transition-transform hover:-translate-y-0.5">
              Abrir no Google Maps
            </a>
            <a href={wazeUrl} target="_blank" rel="noreferrer" className="rounded-full px-6 py-3.5 font-medium ring-1 ring-leite/50 transition-colors hover:bg-leite/10">
              Abrir no Waze
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
          <div className="janela absolute -bottom-10 -left-4 aspect-square w-[40%] overflow-hidden rounded-full ring-8 ring-verde-medio md:-bottom-12 md:-left-12 md:w-[30%]">
            <Image src="/media/janela.jpg" alt="Vista da janela do salão para a rua" fill sizes="(min-width: 768px) 20vw, 40vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
