"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const itens = ["café especial", "focaccia artesanal", "pão de queijo", "waffle de Liège", "brownie", "ovos mexidos", "bolo da vovó", "chocolate quente"];

function Grao() {
  return (
    <svg viewBox="0 0 20 28" className="mx-[0.35em] inline-block h-[0.42em] w-auto -translate-y-[0.05em]" aria-hidden>
      <ellipse cx="10" cy="14" rx="9" ry="13" fill="currentColor" />
      <path d="M10 2c-4 6 4 18 0 24" stroke="var(--faixa-bg)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Linha({ className }: { className: string }) {
  // Conteúdo duplicado para o loop emendar sem salto.
  return (
    <div className={`${className} flex w-max whitespace-nowrap`}>
      {[0, 1].map((copia) => (
        <span key={copia} className="flex items-center" aria-hidden={copia === 1}>
          {itens.map((item) => (
            <span key={item} className="flex items-center">
              {item}
              <Grao />
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

// Duas faixas cruzadas que correm em sentidos opostos e aceleram com o scroll.
export function Faixas() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loops = [
          gsap.to(".faixa-a", { xPercent: -50, repeat: -1, duration: 40, ease: "none" }),
          gsap.fromTo(".faixa-b", { xPercent: -50 }, { xPercent: 0, repeat: -1, duration: 40, ease: "none" }),
        ];
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 220, 7);
            gsap.to(loops, {
              timeScale: boost,
              duration: 0.2,
              overwrite: true,
              onComplete: () => void gsap.to(loops, { timeScale: 1, duration: 1.2, ease: "power2.out" }),
            });
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative overflow-hidden bg-areia py-[9vw] md:py-[6vw]">
      <div className="display-tight relative z-10 -mx-[5vw] -rotate-3 bg-verde py-[0.18em] text-[13vw] text-areia [--faixa-bg:var(--color-verde)] md:text-[6.5vw]">
        <Linha className="faixa-a" />
      </div>
      <div className="display-tight absolute inset-x-0 top-1/2 -mx-[5vw] -translate-y-1/2 rotate-2 bg-laranja py-[0.18em] text-[13vw] text-verde [--faixa-bg:var(--color-laranja)] md:text-[6.5vw]">
        <Linha className="faixa-b" />
      </div>
    </div>
  );
}
