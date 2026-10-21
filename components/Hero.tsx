"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { simbolo, wordmark } from "@/lib/logo";

// Contorno externo do grão (primeiro trecho do anel): vira a "janela" do zoom.
const graoExterno = simbolo.anel.slice(0, simbolo.anel.indexOf("M", 1));

// Mesmo verde da capa do cardápio impresso, para os grãos desenhados emendarem.
const VERDE_CAPA = "#3b4c29";

// Hero: a marca aparece como na capa do cardápio; ao rolar, a câmera entra
// pelo grão do logo e o salão aparece por dentro dele até tomar a tela.
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const furo = useRef<SVGPathElement>(null);
  const marca = useRef<SVGGElement>(null);
  // Só para o viewBox do SVG; as animações leem o tamanho direto da janela.
  const [tela, setTela] = useState({ w: 1440, h: 900 });

  // As animações são criadas uma vez só. Recriar o pin do hero ao medir a tela
  // deixava as seções de baixo (o pin da bancada) com posições antigas.
  useGSAP(
    () => {
      let w = window.innerWidth;
      let h = window.innerHeight;
      const estado = { zoom: 1, giro: 0, centroY: 0.4 };

      // Mesma transformação para o grão laranja e para o furo da máscara.
      const aplicar = () => {
        const altura = w < 768 ? Math.min(w * 0.42, h * 0.24) : Math.min(w * 0.2, h * 0.3);
        const s = (altura / simbolo.h) * estado.zoom;
        const t = `translate(${w / 2} ${h * estado.centroY}) rotate(${estado.giro}) scale(${s}) translate(${-simbolo.w / 2} ${-simbolo.h / 2})`;
        marca.current?.setAttribute("transform", t);
        furo.current?.setAttribute("transform", t);
      };
      const medir = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        setTela({ w, h });
        aplicar();
      };
      medir();
      window.addEventListener("resize", medir);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrada, como a capa do cardápio ganhando vida.
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo(estado, { zoom: 0.4, giro: -80 }, { zoom: 1, giro: 0, duration: 1.8, onUpdate: aplicar }, 0)
          .from(marca.current, { opacity: 0, duration: 0.8 }, 0)
          .from(".hero-vinco", { scale: 0, transformOrigin: "85% 10%", duration: 1.4 }, 0.5)
          .fromTo(".hero-nome", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.inOut" }, 0.7)
          .from(".hero-cafe", { y: 16, autoAlpha: 0, duration: 1 }, 1.4)
          .from(".hero-graos-topo", { xPercent: 30, yPercent: -30, autoAlpha: 0, duration: 1.8 }, 0.2)
          .from(".hero-graos-base", { xPercent: -30, yPercent: 30, autoAlpha: 0, duration: 1.8 }, 0.3)
          .from(".hero-dica", { y: 12, autoAlpha: 0, duration: 1 }, 1.8);

        gsap.to(".hero-dica-linha", { scaleY: 0.3, transformOrigin: "50% 100%", duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 });

        // Scroll: entra pelo grão até o salão ocupar a tela.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=200%", scrub: 1, pin: true },
          })
          .to(".hero-texto", { autoAlpha: 0, y: -40, duration: 0.15 }, 0)
          .to(".hero-dica", { autoAlpha: 0, duration: 0.08 }, 0)
          .to(".hero-graos-topo", { xPercent: 40, yPercent: -40, autoAlpha: 0, duration: 0.3 }, 0)
          .to(".hero-graos-base", { xPercent: -40, yPercent: 40, autoAlpha: 0, duration: 0.3 }, 0)
          .to(".hero-vinco", { opacity: 0, duration: 0.12 }, 0.02)
          .to(furo.current, { opacity: 1, duration: 0.15 }, 0.05)
          .to(estado, { zoom: 28, centroY: 0.5, duration: 0.8, ease: "power3.in", onUpdate: aplicar }, 0.12)
          .fromTo(".hero-foto", { scale: 1.25 }, { scale: 1, duration: 0.92 }, 0.08)
          .fromTo(".hero-final", { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.82)
          .to({}, { duration: 0.1 });
      });

      return () => window.removeEventListener("resize", medir);
    },
    { scope: root },
  );

  return (
    <section id="topo" ref={root} className="relative h-svh overflow-hidden" style={{ backgroundColor: VERDE_CAPA }}>
      <h1 className="sr-only">Flanar Café</h1>

      {/* O salão, que aparece por dentro do grão */}
      <div className="hero-foto absolute inset-0">
        <Image
          src="/pessoas/cliente-waffle.jpg"
          alt="Cliente no salão da Flanar com waffle e café, olhando pela janela"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_38%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${tela.w} ${tela.h}`} preserveAspectRatio="none" aria-hidden>
        <defs>
          <mask id="hero-furo" maskUnits="userSpaceOnUse" x="0" y="0" width={tela.w} height={tela.h}>
            <rect width={tela.w} height={tela.h} fill="white" />
            <path ref={furo} d={graoExterno} fill="black" opacity="0" />
          </mask>
        </defs>
        <rect width={tela.w} height={tela.h} fill={VERDE_CAPA} mask="url(#hero-furo)" />
        <g ref={marca}>
          <path className="fill-laranja" fillRule="evenodd" d={simbolo.anel} />
          <path className="hero-vinco fill-laranja" d={simbolo.vinco} />
        </g>
      </svg>

      {/* Grãos desenhados da capa do cardápio */}
      <Image
        src="/cardapio/capa-topo.webp"
        alt=""
        width={854}
        height={600}
        priority
        className="hero-graos-topo pointer-events-none absolute [mask-image:linear-gradient(to_left,black_65%,transparent),linear-gradient(to_top,transparent,black_35%)] [mask-composite:intersect] -top-2 -right-2 w-[78vw] max-w-[640px] md:w-[42vw]"
      />
      <Image
        src="/cardapio/capa-base.webp"
        alt=""
        width={800}
        height={615}
        priority
        className="hero-graos-base pointer-events-none absolute [mask-image:linear-gradient(to_right,black_60%,transparent),linear-gradient(to_bottom,transparent,black_30%)] [mask-composite:intersect] -bottom-2 -left-2 w-[70vw] max-w-[520px] md:w-[30vw]"
      />

      {/* Nome, como na capa: "flanar" claro e "café" laranja */}
      <div className="hero-texto absolute inset-x-0 top-[57%] flex flex-col items-center md:top-[60%]">
        <svg viewBox={`0 0 ${wordmark.w} ${wordmark.h}`} className="hero-nome h-[13vw] w-auto md:h-[min(9vw,13svh)]" role="img" aria-label="flanar">
          <path className="fill-leite stroke-leite" strokeWidth={wordmark.peso} strokeLinejoin="round" d={wordmark.d} />
        </svg>
        <p className="hero-cafe display-soft mt-2 text-[6vw] text-laranja md:text-[min(3vw,4.4svh)]">café</p>
      </div>

      <div className="hero-dica absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-sm text-areia md:bottom-8">
        Role para entrar
        <span className="hero-dica-linha block h-10 w-px bg-areia/70" aria-hidden />
      </div>

      {/* Quando a câmera termina de entrar */}
      {/* Texto à esquerda para não cobrir o rosto da cliente, que fica à direita */}
      <div className="hero-final invisible absolute inset-0 flex flex-col justify-end bg-gradient-to-r from-black/45 via-black/10 to-transparent px-6 pb-[12svh] text-leite md:px-12">
        <p className="display-tight max-w-[9ch] text-[16vw] md:text-[7vw]">Vem viver seu momento flanar.</p>
        <p className="mt-5 max-w-sm text-lg text-leite/90">Cafés especiais, cardápio artesanal e um salão verde no centro de Itatiba.</p>
      </div>
    </section>
  );
}
