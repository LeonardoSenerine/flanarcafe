"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const texto =
  "A Flanar nasceu da vontade de desacelerar no meio da correria do centro de Itatiba. Parede verde-menta, mesas de madeira, poltronas de veludo e café passado sem pressa. Aqui dá pra chegar sozinho e começar o dia, marcar com a amiga, abrir o notebook ou só sentar perto da janela e ver a rua passar.";

// Fotos do Instagram da Flanar; pos = enquadramento no rosto de cada uma.
// No celular ficam numa grade (uma alta e duas menores); no desktop, sobrepostas.
const fotos = [
  {
    src: "/pessoas/barista.jpg",
    alt: "Atendente da Flanar sorrindo enquanto passa a maquininha para uma cliente no balcão",
    posicao: "row-span-2 md:absolute md:right-0 md:top-0 md:w-[74%] md:aspect-[720/1000]",
    forma: "rounded-[28px] md:rounded-[32px]",
    pos: "40% 45%",
    velocidade: -8,
  },
  {
    src: "/pessoas/cliente-shake.jpg",
    alt: "Cliente sorrindo com um shake no copo canelado, encostada na parede verde",
    posicao: "aspect-[4/5] md:absolute md:left-0 md:top-[34%] md:w-[56%] md:aspect-[720/960]",
    forma: "rounded-[28px] md:rounded-t-full md:rounded-b-[24px] md:ring-8 md:ring-areia",
    pos: "45% 30%",
    velocidade: -22,
  },
  {
    src: "/pessoas/cliente-vem-verao.jpg",
    alt: "Cliente brindando com o Vem Verão, ao lado de uma planta",
    posicao: "aspect-[4/5] md:absolute md:right-[4%] md:bottom-0 md:w-[44%] md:aspect-square",
    forma: "rounded-[28px] md:rounded-full md:ring-8 md:ring-areia",
    pos: "55% 30%",
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

        // As pessoas aparecem uma a uma: a foto abre de baixo para cima,
        // o rosto chega mais perto e a moldura se assenta no lugar.
        gsap
          .timeline({ scrollTrigger: { trigger: ".sobre-fotos", start: "top 78%" }, defaults: { ease: "expo.out" } })
          .fromTo(
            ".sobre-revela",
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, stagger: 0.18, ease: "expo.inOut" },
          )
          .from(".sobre-revela img", { scale: 1.45, duration: 2, stagger: 0.18 }, 0.2)
          .from(".sobre-foto", { y: 60, rotate: (i) => [-4, 5, -6][i], duration: 1.6, stagger: 0.18 }, 0);
      });

      // Fotos em profundidades diferentes, só no desktop, onde elas se sobrepõem.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>(".sobre-camada").forEach((el) => {
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

        <div className="sobre-fotos relative grid grid-cols-2 gap-3 md:col-span-5 md:block">
          {fotos.map((f) => (
            <div key={f.src} data-velocidade={f.velocidade} className={`sobre-camada relative ${f.posicao}`}>
              <div className={`sobre-foto absolute inset-0 overflow-hidden ${f.forma}`}>
                <div className="sobre-revela absolute inset-0">
                  <Image src={f.src} alt={f.alt} fill sizes="(min-width: 768px) 30vw, 50vw" className="object-cover" style={{ objectPosition: f.pos }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
