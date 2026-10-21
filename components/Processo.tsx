"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { etapas } from "@/lib/content";
import { LoopVideo } from "./LoopVideo";

// No desktop, o scroll vertical vira um passeio horizontal pela bancada.
// No celular, as etapas ficam uma embaixo da outra, sem texto cortado na borda.
export function Processo() {
  const root = useRef<HTMLElement>(null);
  const trilho = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const distancia = () => trilho.current!.scrollWidth - window.innerWidth;

        const passeio = gsap.to(trilho.current, {
          x: () => -distancia(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distancia()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(".processo-barra", { scaleX: self.progress }),
          },
        });

        gsap.utils.toArray<HTMLElement>(".etapa").forEach((card) => {
          const st = { trigger: card, containerAnimation: passeio, scrub: true };
          gsap.from(card.querySelector(".etapa-titulo"), {
            xPercent: 45,
            ease: "none",
            scrollTrigger: { ...st, start: "left 100%", end: "left 35%" },
          });
          gsap.fromTo(
            card.querySelector(".etapa-video"),
            { scale: 1.3 },
            { scale: 1, ease: "none", scrollTrigger: { ...st, start: "left 100%", end: "center 50%" } },
          );
        });
      });

      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".etapa").forEach((card) => {
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: "top 82%" }, defaults: { ease: "expo.out" } })
            .fromTo(card.querySelector(".etapa-moldura"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" })
            .from(card.querySelector(".etapa-video"), { scale: 1.3, duration: 1.6 }, 0.2)
            .from(card.querySelectorAll(".etapa-texto > *"), { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.3);
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="processo" ref={root} className="relative bg-verde text-areia">
      <div className="relative flex flex-col justify-center py-24 md:h-svh md:overflow-hidden md:py-0 md:motion-reduce:overflow-x-auto">
        <div ref={trilho} className="flex flex-col gap-12 px-5 md:w-max md:flex-row md:items-center md:gap-10 md:px-[6vw]">
          <div className="md:w-[36vw] md:shrink-0">
            <h2 className="display-tight text-[23vw] md:text-[9.5vw]">Feito na hora</h2>
            <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-areia/80">
              Café especial em vários métodos de preparo e uma cozinha artesanal. Cada pedido passa pelas mãos de alguém da casa, e quase tudo acontece à vista de onde você está sentado.
            </p>
          </div>

          {etapas.map((etapa) => (
            <article key={etapa.titulo} className="etapa grid grid-cols-[42%_1fr] items-center gap-5 md:block md:w-[23vw] md:shrink-0">
              <div className="etapa-moldura relative aspect-[540/660] overflow-hidden rounded-[24px] bg-verde-escuro md:rounded-[28px]">
                <LoopVideo name={etapa.video} label={etapa.texto} className="etapa-video absolute inset-0 h-full w-full object-cover" />
                <span className="absolute top-4 left-4 hidden rounded-full bg-areia-claro/90 px-3 py-1 text-sm font-medium text-verde md:block">
                  {etapa.estacao}
                </span>
              </div>
              <div className="etapa-texto">
                <p className="text-sm font-semibold tracking-[0.12em] text-laranja uppercase md:hidden">{etapa.estacao}</p>
                <h3 className="etapa-titulo display-tight mt-2 text-[10vw] md:mt-5 md:text-[5.5vw]">{etapa.titulo}</h3>
                <p className="mt-3 max-w-[34ch] leading-relaxed text-areia/80">{etapa.texto}</p>
              </div>
            </article>
          ))}

          <div className="hidden w-[4vw] shrink-0 md:block" aria-hidden />
        </div>

        <div className="absolute inset-x-[6vw] bottom-8 hidden h-[3px] overflow-hidden rounded-full bg-areia/15 md:block md:motion-reduce:hidden">
          <div className="processo-barra h-full origin-left bg-laranja" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
