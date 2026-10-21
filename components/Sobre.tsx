"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const texto =
  "A Flanar nasceu da vontade de desacelerar no meio da correria do centro de Itatiba. Parede verde-menta, mesas de madeira, poltronas de veludo e café passado sem pressa. Aqui dá pra chegar sozinho e começar o dia, marcar com a amiga, abrir o notebook ou só sentar perto da janela e ver a rua passar.";

const fotos = [
  {
    src: "/media/salao.jpg",
    alt: "Salão da Flanar com poltronas verdes, mesas de madeira e uma planta grande no canto",
    className: "right-0 top-0 w-[74%] aspect-[720/1000] rounded-[32px]",
    velocidade: -8,
  },
  {
    src: "/media/bandeja.jpg",
    alt: "Cliente sorrindo diante da bandeja de café da manhã, com focaccia, ovos mexidos, bolo e suco de laranja",
    className: "left-0 top-[34%] w-[56%] aspect-[720/960] rounded-t-full rounded-b-[24px] ring-8 ring-areia",
    velocidade: -22,
  },
  {
    src: "/media/janela.jpg",
    alt: "Janela do salão aberta para a rua num dia de sol",
    className: "right-[4%] bottom-0 w-[44%] aspect-square rounded-full ring-8 ring-areia",
    velocidade: -40,
  },
];

export function Sobre() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // O texto vai "acendendo" palavra por palavra conforme a leitura.
        gsap.fromTo(
          ".sobre-palavra",
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: { trigger: ".sobre-texto", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );

        // Fotos em profundidades diferentes.
        gsap.utils.toArray<HTMLElement>(".sobre-foto").forEach((el) => {
          gsap.to(el, {
            yPercent: Number(el.dataset.velocidade),
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="sobre" ref={root} className="relative bg-areia px-5 pt-20 pb-28 md:px-8 md:pt-28 md:pb-44">
      <div className="mx-auto grid max-w-[1400px] gap-20 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7">
          <h2 className="display-tight text-[19vw] md:text-[8.5vw]">Um café pra ficar</h2>
          <p className="sobre-texto display-soft mt-10 text-[1.75rem] leading-[1.15] md:mt-14 md:text-[2.6rem]">
            {texto.split(" ").map((palavra, i) => (
              <span key={i} className="sobre-palavra">
                {palavra}{" "}
              </span>
            ))}
          </p>
          <p className="mt-10 max-w-[54ch] text-lg leading-relaxed text-verde/85 md:mt-14">
            Na cozinha tem focaccia artesanal, ovos cremosos e pão de queijo saindo quentinho. No balcão, café especial, espresso e
            bebidas geladas montadas em camadas. E sempre um docinho pra acompanhar.
          </p>
        </div>

        <div className="relative min-h-[118vw] md:col-span-5 md:min-h-0">
          {fotos.map((f) => (
            <div key={f.src} data-velocidade={f.velocidade} className={`sobre-foto absolute overflow-hidden ${f.className}`}>
              <Image src={f.src} alt={f.alt} fill sizes="(min-width: 768px) 30vw, 70vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
