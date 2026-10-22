"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Animações das seções da página inicial. As seções em si são renderizadas no
// servidor; aqui ficam só os efeitos, para o celular hidratar menos coisa.
// Sem "scope": os seletores já são únicos de cada seção (sobre-, processo-…),
// e um escopo por texto quebraria a renderização no servidor.

export function AnimacoesSobre() {
  useGSAP(
    () => {
      const secao = document.getElementById("sobre")!;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // A foto do salão chega como cartão arredondado e se abre (igual à bancada),
        // anda mais devagar que a página e o título sobe por cima.
        const abertura = secao.querySelector(".sobre-abertura");
        gsap.fromTo(
          abertura,
          { clipPath: "inset(0% 4% 0% 4% round 48px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: abertura, start: "top bottom", end: "top 15%", scrub: 0.8 } },
        );
        gsap.fromTo(
          ".sobre-abertura-imagem",
          { yPercent: -8 },
          { yPercent: 8, ease: "none", scrollTrigger: { trigger: abertura, start: "top bottom", end: "bottom top", scrub: 0.8 } },
        );
        gsap
          .timeline({ scrollTrigger: { trigger: abertura, start: "top 45%" }, defaults: { ease: "expo.out" } })
          .from(".sobre-titulo", { yPercent: 110, duration: 1.2, stagger: 0.12 })
          .from(".sobre-legenda", { y: 16, autoAlpha: 0, duration: 0.9 }, 0.3);

        // O texto vai "acendendo" palavra por palavra conforme a leitura. Começa em
        // 70% para continuar legível antes de acender (3:1, texto grande).
        gsap.fromTo(
          ".sobre-palavra",
          { opacity: 0.7 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: { trigger: ".sobre-texto", start: "top 80%", end: "bottom 45%", scrub: 0.8 },
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
    },
  );
  return null;
}

export function AnimacoesProcesso() {
  useGSAP(
    () => {
      const secao = document.getElementById("processo")!;
      const trilho = secao.querySelector<HTMLDivElement>(".processo-trilho")!;
      const mm = gsap.matchMedia();

      // A bancada chega como um cartão verde arredondado e se abre até tomar a tela.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          secao,
          { clipPath: "inset(0% 4% 0% 4% round 48px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: secao, start: "top bottom", end: "top 15%", scrub: 0.8 } },
        );
      });
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const distancia = () => trilho.scrollWidth - window.innerWidth;

        const passeio = gsap.to(trilho, {
          x: () => -distancia(),
          ease: "none",
          scrollTrigger: {
            trigger: secao,
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
  );
  return null;
}

export function AnimacoesFaixas() {
  useGSAP(
    () => {
      const secao = document.getElementById("faixas")!;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loops = [
          gsap.to(".faixa-a", { xPercent: -50, repeat: -1, duration: 40, ease: "none" }),
          gsap.fromTo(".faixa-b", { xPercent: -50 }, { xPercent: 0, repeat: -1, duration: 40, ease: "none" }),
        ];
        ScrollTrigger.create({
          trigger: secao,
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
  );
  return null;
}

export function AnimacoesGaleria() {
  useGSAP(
    () => {
      const secao = document.getElementById("galeria")!;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: secao, start: "top bottom", end: "bottom top", scrub: 1 };
        gsap.fromTo(".galeria-a", { xPercent: 0 }, { xPercent: -28, ease: "none", scrollTrigger: st });
        gsap.fromTo(".galeria-b", { xPercent: -28 }, { xPercent: 0, ease: "none", scrollTrigger: st });
      });
    },
  );
  return null;
}

export function AnimacoesComoChegar() {
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
            scrollTrigger: { trigger: ".mapa", start: "top 90%", end: "center 55%", scrub: 0.8 },
          },
        );
        gsap.from(".fachada", {
          rotate: -25,
          scale: 0.6,
          ease: "none",
          scrollTrigger: { trigger: ".mapa", start: "top 90%", end: "center 55%", scrub: 0.8 },
        });
      });
    },
  );
  return null;
}

export function AnimacoesRodape() {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".rodape-letra", {
          yPercent: 100,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: ".rodape-palavra", start: "top bottom", end: "bottom bottom", scrub: 0.8 },
        });
      });
    },
  );
  return null;
}

export function AnimacoesFaixaFoto() {
  useGSAP(() => {
    const secao = document.getElementById("faixa-foto")!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // A foto anda mais devagar que a página, como se estivesse atrás de uma janela.
      gsap.fromTo(
        ".faixafoto-imagem",
        { yPercent: -10 },
        { yPercent: 10, ease: "none", scrollTrigger: { trigger: secao, start: "top bottom", end: "bottom top", scrub: 0.8 } },
      );
      gsap
        .timeline({ scrollTrigger: { trigger: secao, start: "top 55%" }, defaults: { ease: "expo.out" } })
        .from(".faixafoto-titulo", { yPercent: 110, duration: 1.2, stagger: 0.12 })
        .from(".faixafoto-linha", { y: 16, autoAlpha: 0, duration: 0.9 }, 0.2);
    });
  });
  return null;
}
