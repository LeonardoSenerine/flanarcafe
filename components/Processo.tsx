"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { etapas } from "@/lib/content";
import { LoopVideo } from "./LoopVideo";

// O scroll vertical vira um passeio horizontal pela bancada.
export function Processo() {
  const root = useRef<HTMLElement>(null);
  const trilho = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
    },
    { scope: root },
  );

  return (
    <section id="processo" ref={root} className="relative bg-verde text-areia">
      <div className="relative flex h-svh flex-col justify-center overflow-hidden motion-reduce:overflow-x-auto">
        <div ref={trilho} className="flex w-max items-center gap-5 px-5 md:gap-10 md:px-[6vw]">
          <div className="w-[84vw] shrink-0 md:w-[36vw]">
            <h2 className="display-tight text-[23vw] md:text-[9.5vw]">Feito na hora</h2>
            <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-areia/80">
              Café especial em vários métodos de preparo e uma cozinha artesanal. Cada pedido passa pelas mãos de alguém da casa, e quase tudo acontece à vista de onde você está sentado.
            </p>
          </div>

          {etapas.map((etapa) => (
            <article key={etapa.titulo} className="etapa w-[70vw] shrink-0 md:w-[23vw]">
              <div className="relative aspect-[540/660] overflow-hidden rounded-[28px] bg-verde-escuro">
                <LoopVideo name={etapa.video} label={etapa.texto} className="etapa-video absolute inset-0 h-full w-full object-cover" />
                <span className="absolute top-4 left-4 rounded-full bg-areia-claro/90 px-3 py-1 text-sm font-medium text-verde">
                  {etapa.estacao}
                </span>
              </div>
              <h3 className="etapa-titulo display-tight mt-5 text-[17vw] md:text-[5.5vw]">{etapa.titulo}</h3>
              <p className="mt-3 max-w-[34ch] leading-relaxed text-areia/80">{etapa.texto}</p>
            </article>
          ))}

          <div className="w-[4vw] shrink-0" aria-hidden />
        </div>

        <div className="absolute inset-x-5 bottom-6 h-[3px] overflow-hidden rounded-full bg-areia/15 motion-reduce:hidden md:inset-x-[6vw] md:bottom-8">
          <div className="processo-barra h-full origin-left bg-laranja" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
