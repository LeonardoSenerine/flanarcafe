"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { simbolo, wordmark } from "@/lib/logo";
import { grupos, reais } from "@/lib/cardapio";
import { contato } from "@/lib/content";
import { Simbolo } from "./Logo";
import { Seta } from "./Seta";

// Contorno externo do grão (primeiro trecho do anel): vira a "janela" do zoom.
const graoExterno = simbolo.anel.slice(0, simbolo.anel.indexOf("M", 1));

// Mesmo verde da capa do cardápio impresso, para os grãos desenhados emendarem.
const VERDE_CAPA = "#3b4c29";

const orange = grupos.flatMap((g) => g.itens).find((i) => i.nome === "Orange coffee")!;

// Colagem: o Orange coffee grande e os pratos da casa em volta, todos na mesma
// forma, numa grade de 3x3. "fundo" é a profundidade do efeito do mouse (desktop).
const colagem = [
  { src: "/fotos/drink-laranja-camadas.jpg", alt: "Orange coffee em camadas no copo canelado", className: "col-span-2 row-span-2", pos: "50% 60%", fundo: 6 },
  { src: "/fotos/waffle-frutas.jpg", alt: "Waffle de Liège com frutas", className: "", pos: "50% 50%", fundo: 14 },
  { src: "/fotos/pao-de-queijo.jpg", alt: "Mini pães de queijo", className: "", pos: "40% 50%", fundo: 10 },
  { src: "/fotos/ovos-mexidos.jpg", alt: "Ovos mexidos com cebolinha", className: "", pos: "50% 60%", fundo: 12 },
  { src: "/fotos/trio-cafes.jpg", alt: "Cappuccinos e café com leite na caneca verde da Flanar", className: "col-span-2", pos: "50% 62%", fundo: 8 },
];

// Sem JavaScript, mostra o hero pronto (as animações começam escondidas no CSS).
const semScript = ".hero-final{visibility:visible!important}.hero-intro{display:none}.entrada,.cabecalho-entrada{visibility:visible!important}";

// Selo laranja com texto girando em volta do grão.
function Selo({ id, className }: { id: string; className: string }) {
  return (
    <div className={`hero-selo ${className}`}>
      <div className="relative aspect-square rounded-full bg-laranja text-verde shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]">
        <svg viewBox="0 0 100 100" className="hero-selo-texto absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <path id={id} d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1 -74 0" />
          </defs>
          <text className="fill-verde text-[9.4px] font-bold tracking-[0.14em] uppercase">
            <textPath href={`#${id}`}>café especial • feito na hora •</textPath>
          </text>
        </svg>
        <Simbolo className="absolute inset-[33%] h-[34%] w-[34%] text-verde" />
      </div>
    </div>
  );
}

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
// câmera entra pelo grão do logo e revela a colagem com os pratos da casa.
// Tudo que anima já começa escondido no CSS (globals.css), então a página
// nunca mostra o resultado final antes de a animação começar.
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
          .fromTo(header, { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.2)
          .fromTo(estado, { zoom: 0.4, giro: -80 }, { zoom: 1, giro: 0, duration: 1.6, onUpdate: aplicar }, 0)
          .fromTo(marca.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, 0)
          .from(".hero-vinco", { scale: 0, transformOrigin: "85% 10%", duration: 1.2 }, 0.4)
          .fromTo(".hero-nome", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut" }, 0.55)
          .fromTo(".hero-cafe", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 1.2)
          .fromTo(".hero-graos-topo", { xPercent: 30, yPercent: -30, autoAlpha: 0 }, { xPercent: 0, yPercent: 0, autoAlpha: 1, duration: 1.6 }, 0.1)
          .fromTo(".hero-graos-base", { xPercent: -30, yPercent: 30, autoAlpha: 0 }, { xPercent: 0, yPercent: 0, autoAlpha: 1, duration: 1.6 }, 0.2);

        // 2. Sozinha, a câmera entra pelo grão até o café ocupar a tela.
        tl.addLabel("entrar", 2.3)
          .to(".hero-texto", { autoAlpha: 0, y: -40, duration: 0.5, ease: "power2.in" }, "entrar")
          .to(".hero-graos-topo", { xPercent: 40, yPercent: -40, autoAlpha: 0, duration: 0.8, ease: "power2.in" }, "entrar")
          .to(".hero-graos-base", { xPercent: -40, yPercent: 40, autoAlpha: 0, duration: 0.8, ease: "power2.in" }, "entrar")
          .to(".hero-vinco", { opacity: 0, duration: 0.3, ease: "none" }, "entrar")
          .set(furo.current, { opacity: 1 }, "entrar+=0.15")
          .to(estado, { zoom: 30, centroY: 0.5, duration: 1.3, ease: "power3.in", onUpdate: aplicar }, "entrar+=0.15")
          .from(".hero-tile", { scale: 0.82, autoAlpha: 0, duration: 1.3, stagger: 0.09 }, "entrar+=0.45")
          .set(".hero-intro", { autoAlpha: 0 }, "entrar+=1.45");

        // 3. O texto e os detalhes entram por cima da foto.
        tl.addLabel("final", "entrar+=1.2")
          .from(".hero-linha", { yPercent: 110, duration: 1.1, stagger: 0.12 }, "final")
          .from(".hero-detalhe", { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, "final+=0.35")
          .from(".hero-selo", { scale: 0, rotate: -120, duration: 1.4 }, "final+=0.3")
          .from(".hero-etiqueta", { y: -10, autoAlpha: 0, duration: 0.8 }, "final+=0.5");

        // Quem já quer descer não precisa esperar: qualquer gesto acelera a entrada.
        const pressa = () => tl.timeScale(3.5);
        const eventos = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
        eventos.forEach((e) => window.addEventListener(e, pressa, { once: true, passive: true }));

        gsap.to(".hero-selo-texto", { rotate: 360, duration: 18, repeat: -1, ease: "none", transformOrigin: "50% 50%" });

        return () => eventos.forEach((e) => window.removeEventListener(e, pressa));
      });

      // Desktop com mouse: as fotos da colagem acompanham o cursor em
      // profundidades diferentes, bem de leve.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px) and (pointer: fine)", () => {
        const tiles = gsap.utils.toArray<HTMLElement>(".hero-tile-fundo");
        const movers = tiles.map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
          fundo: Number(el.dataset.fundo),
        }));
        const mover = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(-nx * m.fundo * 2);
            m.y(-ny * m.fundo * 2);
          });
        };
        window.addEventListener("pointermove", mover);
        return () => window.removeEventListener("pointermove", mover);
      });

      return () => window.removeEventListener("resize", medir);
    },
    { scope: root },
  );

  return (
    <section
      id="topo"
      ref={root}
      className="relative h-svh min-h-[560px] overflow-hidden"
      style={{ backgroundColor: VERDE_CAPA }}
    >
      <noscript dangerouslySetInnerHTML={{ __html: `<style>${semScript}</style>` }} />

      {/* Fundo claro que aparece por dentro do grão, com o grão do logo bem grande e apagado */}
      <div className="hero-foto absolute inset-0 overflow-hidden bg-areia-claro">
        <Simbolo className="absolute -bottom-[18%] -left-[8%] h-[80%] w-auto text-verde/[0.05] md:-bottom-[25%] md:-left-[6%] md:h-[115%]" />
      </div>

      <div className="hero-final invisible pointer-events-none absolute inset-0">
        <div className="relative flex h-full flex-col gap-4 px-5 pt-[92px] pb-6 md:grid md:grid-cols-12 md:grid-rows-[1fr_auto_auto_1fr] md:gap-x-12 md:gap-y-0 md:px-12 md:pt-[108px] md:pb-10">
          <h1 className="display-tight text-[15vw] whitespace-nowrap text-verde md:col-span-6 md:row-start-2 md:text-[min(6vw,12svh)]">
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

          <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-3 gap-2.5 md:col-span-6 md:col-start-7 md:row-span-4 md:row-start-1 md:gap-4" aria-hidden>
            {colagem.map((f, i) => (
              <div key={f.src} className={`hero-tile relative ${f.className}`}>
                <div data-fundo={f.fundo} className="hero-tile-fundo absolute inset-0">
                  <div className="absolute inset-0 overflow-hidden rounded-[22px] bg-verde/10 md:rounded-[28px]">
                    <Image
                      src={f.src}
                      alt={f.alt}
                      fill
                      priority={i < 2}
                      sizes={i === 0 ? "(min-width: 768px) 34vw, 66vw" : "(min-width: 768px) 17vw, 33vw"}
                      className="object-cover"
                      style={{ objectPosition: f.pos }}
                    />
                  </div>
                  {i === 0 && (
                    <>
                      <p className="hero-etiqueta absolute top-3 left-3 rounded-full bg-leite/90 px-3 py-1 text-xs font-semibold text-verde backdrop-blur md:top-4 md:left-4 md:px-4 md:py-1.5 md:text-sm">
                        {orange.nome} · {reais(orange.preco)}
                      </p>
                      <Selo id="hero-selo" className="absolute -right-4 -bottom-4 z-10 w-[84px] md:-right-6 md:-bottom-6 md:w-[clamp(96px,8vw,136px)]" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pointer-events-auto text-verde md:col-span-6 md:row-start-3 md:mt-8">
            <div className="max-w-lg">
              <p className="hero-detalhe hidden text-xl leading-relaxed text-verde/90 md:block">
                Cafés especiais, cozinha artesanal e um salão verde no centro de Itatiba.
              </p>
              <div className="hero-detalhe flex flex-wrap gap-3 md:mt-6">
                <a href="#cardapio" className="group inline-flex items-center gap-2 rounded-full bg-laranja px-6 py-3 font-semibold text-verde-noite transition hover:-translate-y-0.5 hover:bg-verde hover:text-leite">
                  Ver o cardápio
                  <Seta direcao="baixo" />
                </a>
                <a href="#como-chegar" className="group inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold ring-1 ring-verde/40 transition-colors hover:bg-verde/10">
                  Como chegar
                  <Seta />
                </a>
              </div>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm md:mt-6 md:text-base">
                <li className="hero-detalhe flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-laranja-escuro" aria-hidden />
                  {horas ? `Hoje, das ${horas}` : "Todos os dias, a partir das 8h"}
                </li>
                <li className="hero-detalhe flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-laranja-escuro" aria-hidden />
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
          <g ref={marca} className="entrada">
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
          sizes="(min-width: 768px) 42vw, 78vw"
          className="hero-graos-topo entrada pointer-events-none absolute [mask-image:linear-gradient(to_left,black_65%,transparent),linear-gradient(to_top,transparent,black_35%)] [mask-composite:intersect] -top-2 -right-2 w-[78vw] max-w-[640px] md:w-[42vw]"
        />
        <Image
          src="/cardapio/capa-base.webp"
          alt=""
          width={800}
          height={615}
          priority
          sizes="(min-width: 768px) 30vw, 70vw"
          className="hero-graos-base entrada pointer-events-none absolute [mask-image:linear-gradient(to_right,black_60%,transparent),linear-gradient(to_bottom,transparent,black_30%)] [mask-composite:intersect] -bottom-2 -left-2 w-[70vw] max-w-[520px] md:w-[30vw]"
        />

        {/* Nome, como na capa: "flanar" claro e "café" laranja */}
        <div className="hero-texto absolute inset-x-0 top-[57%] flex flex-col items-center md:top-[60%]">
          <svg viewBox={`0 0 ${wordmark.w} ${wordmark.h}`} className="hero-nome h-[13vw] w-auto md:h-[min(9vw,13svh)]">
            <path className="fill-leite stroke-leite" strokeWidth={wordmark.peso} strokeLinejoin="round" d={wordmark.d} />
          </svg>
          <p className="hero-cafe entrada display-soft mt-2 text-[6vw] text-laranja md:text-[min(3vw,4.4svh)]">café</p>
        </div>
      </div>
    </section>
  );
}
