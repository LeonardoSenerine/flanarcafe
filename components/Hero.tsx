"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { simbolo, wordmark } from "@/lib/logo";
import { grupos, reais } from "@/lib/cardapio";
import { contato } from "@/lib/content";
import { Simbolo } from "./Logo";

// Contorno externo do grão (primeiro trecho do anel): vira a "janela" do zoom.
const graoExterno = simbolo.anel.slice(0, simbolo.anel.indexOf("M", 1));

// Mesmo verde da capa do cardápio impresso, para os grãos desenhados emendarem.
const VERDE_CAPA = "#3b4c29";

const orange = grupos.flatMap((g) => g.itens).find((i) => i.nome === "Orange coffee")!;

// Foto horizontal no desktop (copo à direita) e vertical no celular (copo menor, embaixo).
const fotoAlt = "Orange coffee em camadas no copo canelado, sobre a mesa de madeira da Flanar, com a parede verde-menta atrás";
const { props: fotoDesktop } = getImageProps({ src: "/media/hero-cafe.jpg", alt: fotoAlt, width: 3200, height: 1920, sizes: "100vw", priority: true });
const { props: fotoCelular } = getImageProps({ src: "/media/hero-cafe-vertical.jpg", alt: fotoAlt, width: 1440, height: 3000, sizes: "100vw", priority: true });

// Horário de hoje, pelo dia da semana de quem está vendo.
function useHorarioDeHoje() {
  const [horas, setHoras] = useState<string | null>(null);
  useEffect(() => {
    const dia = new Date().getDay();
    setHoras(contato.horarios[dia === 0 ? 2 : dia === 6 ? 1 : 0].horas);
  }, []);
  return horas;
}

// Hero: a marca aparece como na capa do cardápio e, sem esperar o scroll, a
// câmera entra pelo grão do logo e revela o Orange coffee em cima da mesa.
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const furo = useRef<SVGPathElement>(null);
  const marca = useRef<SVGGElement>(null);
  // Só para o viewBox do SVG; as animações leem o tamanho direto da janela.
  const [tela, setTela] = useState({ w: 1440, h: 900 });
  const horas = useHorarioDeHoje();

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

      const header = document.querySelector("header");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-intro", { autoAlpha: 0 });
        gsap.set(".hero-final", { autoAlpha: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        // 1. A capa do cardápio ganhando vida.
        tl.set(".hero-final", { autoAlpha: 1 })
          .from(header, { autoAlpha: 0, y: -30, duration: 1 }, 0.2)
          .fromTo(estado, { zoom: 0.4, giro: -80 }, { zoom: 1, giro: 0, duration: 1.6, onUpdate: aplicar }, 0)
          .from(marca.current, { opacity: 0, duration: 0.7 }, 0)
          .from(".hero-vinco", { scale: 0, transformOrigin: "85% 10%", duration: 1.2 }, 0.4)
          .fromTo(".hero-nome", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut" }, 0.55)
          .from(".hero-cafe", { y: 16, autoAlpha: 0, duration: 0.9 }, 1.2)
          .from(".hero-graos-topo", { xPercent: 30, yPercent: -30, autoAlpha: 0, duration: 1.6 }, 0.1)
          .from(".hero-graos-base", { xPercent: -30, yPercent: 30, autoAlpha: 0, duration: 1.6 }, 0.2);

        // 2. Sozinha, a câmera entra pelo grão até o café ocupar a tela.
        tl.addLabel("entrar", 2.3)
          .to(".hero-texto", { autoAlpha: 0, y: -40, duration: 0.5, ease: "power2.in" }, "entrar")
          .to(".hero-graos-topo", { xPercent: 40, yPercent: -40, autoAlpha: 0, duration: 0.8, ease: "power2.in" }, "entrar")
          .to(".hero-graos-base", { xPercent: -40, yPercent: 40, autoAlpha: 0, duration: 0.8, ease: "power2.in" }, "entrar")
          .to(".hero-vinco", { opacity: 0, duration: 0.3, ease: "none" }, "entrar")
          .set(furo.current, { opacity: 1 }, "entrar+=0.15")
          .to(estado, { zoom: 30, centroY: 0.5, duration: 1.3, ease: "power3.in", onUpdate: aplicar }, "entrar+=0.15")
          .fromTo(".hero-foto", { scale: 1.3 }, { scale: 1, duration: 2.2, ease: "power3.out" }, "entrar+=0.5")
          .set(".hero-intro", { autoAlpha: 0 }, "entrar+=1.45");

        // 3. O texto e os detalhes entram por cima da foto.
        tl.addLabel("final", "entrar+=1.2")
          .from(".hero-linha", { yPercent: 110, duration: 1.1, stagger: 0.12 }, "final")
          .from(".hero-detalhe", { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, "final+=0.35")
          .from(".hero-selo", { scale: 0, rotate: -120, duration: 1.4 }, "final+=0.3")
          .from(".hero-etiqueta-linha", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.8, ease: "power3.inOut" }, "final+=0.5")
          .from(".hero-etiqueta-texto", { x: -16, autoAlpha: 0, duration: 0.8 }, "final+=0.9");

        // Quem já quer descer não precisa esperar: qualquer gesto acelera a entrada.
        const pressa = () => tl.timeScale(3.5);
        const eventos = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
        eventos.forEach((e) => window.addEventListener(e, pressa, { once: true, passive: true }));

        gsap.to(".hero-selo-texto", { rotate: 360, duration: 18, repeat: -1, ease: "none", transformOrigin: "50% 50%" });

        // Depois da entrada, a foto fica mais lenta que a página ao rolar.
        gsap.to(".hero-parallax", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        return () => eventos.forEach((e) => window.removeEventListener(e, pressa));
      });

      return () => window.removeEventListener("resize", medir);
    },
    { scope: root },
  );

  return (
    <section
      id="topo"
      ref={root}
      className="relative h-svh min-h-[560px] overflow-hidden [--foco:50%] md:[--foco:68%]"
      style={{ backgroundColor: VERDE_CAPA }}
    >
      {/* O café, que aparece por dentro do grão */}
      <div className="hero-parallax absolute inset-0">
        <div className="hero-foto absolute inset-0">
          <picture>
            <source media="(min-width: 768px)" srcSet={fotoDesktop.srcSet ?? fotoDesktop.src} sizes={fotoDesktop.sizes} />
            <img {...fotoCelular} alt={fotoAlt} className="absolute inset-0 h-full w-full object-cover object-[var(--foco)_50%]" />
          </picture>
        </div>
      </div>

      {/* Mesma geometria da foto (cover, foco no copo) para os detalhes ficarem presos nele. */}
      <div className="hero-final invisible pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

        <div className="absolute top-1/2 left-[var(--foco)] aspect-[1440/3000] w-[max(100%,calc(100svh*1440/3000))] -translate-x-[var(--foco)] -translate-y-1/2 md:aspect-[3200/1920] md:w-[max(100%,calc(100svh*3200/1920))]">
          {/* Etiqueta do copo */}
          <div className="absolute top-[38%] left-[80.5%] hidden items-center gap-3 min-[1360px]:flex">
            <span className="hero-etiqueta-linha block h-px w-[4vw] bg-verde" aria-hidden />
            <p className="hero-etiqueta-texto text-verde">
              <span className="display-soft block text-2xl">{orange.nome}</span>
              <span className="block text-sm font-medium">A bebida da casa · {reais(orange.preco)}</span>
            </p>
          </div>

          {/* Selo que gira */}
          <div className="hero-selo absolute top-[42%] left-[72%] w-[clamp(84px,9vw,150px)] -translate-x-1/2 md:top-[62%] md:left-[79%]">
            <div className="relative aspect-square rounded-full bg-laranja text-verde shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]">
              <svg viewBox="0 0 100 100" className="hero-selo-texto absolute inset-0 h-full w-full" aria-hidden>
                <defs>
                  <path id="hero-selo-circulo" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1 -74 0" />
                </defs>
                <text className="fill-verde text-[9.4px] font-bold tracking-[0.14em] uppercase">
                  <textPath href="#hero-selo-circulo">café especial • feito na hora •</textPath>
                </text>
              </svg>
              <Simbolo className="absolute inset-[33%] h-[34%] w-[34%] text-verde" />
            </div>
          </div>
        </div>

        <div className="relative flex h-full flex-col justify-between px-5 pt-[15svh] pb-7 md:px-12 md:pt-[17svh] md:pb-10">
          <h1 className="display-tight text-[17vw] whitespace-nowrap text-verde md:text-[min(7.4vw,15svh)]">
            <span className="sr-only">Flanar Café. </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="hero-linha block">Vem viver seu</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="hero-linha block">
                momento <span className="text-laranja-escuro">flanar.</span>
              </span>
            </span>
          </h1>

          <div className="pointer-events-auto text-leite">
            <div className="max-w-lg">
              <p className="hero-detalhe hidden text-lg leading-relaxed text-leite/90 md:block md:text-xl">
                Cafés especiais, cozinha artesanal e um salão verde no centro de Itatiba.
              </p>
              <div className="hero-detalhe mt-5 flex flex-wrap gap-3">
                <a href="#cardapio" className="rounded-full bg-laranja px-6 py-3 font-semibold text-verde transition-colors hover:bg-leite">
                  Ver o cardápio
                </a>
                <a href="#como-chegar" className="rounded-full px-6 py-3 font-semibold text-leite ring-1 ring-leite/60 transition-colors hover:bg-leite/10">
                  Como chegar
                </a>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm md:text-base">
                <li className="hero-detalhe flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-laranja" aria-hidden />
                  {horas ? `Hoje, das ${horas}` : "Todos os dias, a partir das 8h"}
                </li>
                <li className="hero-detalhe flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-laranja" aria-hidden />
                  {contato.endereco}, {contato.bairro}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Abertura: a capa do cardápio, com o grão que vira janela */}
      <div className="hero-intro absolute inset-0" aria-hidden>
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${tela.w} ${tela.h}`} preserveAspectRatio="none">
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
          <svg viewBox={`0 0 ${wordmark.w} ${wordmark.h}`} className="hero-nome h-[13vw] w-auto md:h-[min(9vw,13svh)]">
            <path className="fill-leite stroke-leite" strokeWidth={wordmark.peso} strokeLinejoin="round" d={wordmark.d} />
          </svg>
          <p className="hero-cafe display-soft mt-2 text-[6vw] text-laranja md:text-[min(3vw,4.4svh)]">café</p>
        </div>
      </div>
    </section>
  );
}
