"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { metodos, reais } from "@/lib/cardapio";

// As partes do cardápio que precisam rodar no navegador. O resto (listas,
// preços, fotos) é renderizado no servidor e não pesa na hidratação.

// Monte seu café: escolha de método e grão.
export function MonteSeuCafe() {
  const [metodo, setMetodo] = useState(metodos.opcoes[1].id);
  const [grao, setGrao] = useState(metodos.graos[0].id);
  const m = metodos.opcoes.find((o) => o.id === metodo)!;
  const g = metodos.graos.find((o) => o.id === grao)!;

  return (
    <>
      <div className="cardapio-item flex items-baseline justify-between gap-4 border-t border-leite/20 pt-6">
        <p className="display-soft text-2xl">1. Escolha o método</p>
        <span className="text-sm text-areia">{metodos.volume}</span>
      </div>
      <div role="radiogroup" aria-label="Método de preparo" className="cardapio-item mt-5 grid grid-cols-3 gap-2.5 md:gap-3">
        {metodos.opcoes.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={metodo === o.id}
            onClick={() => setMetodo(o.id)}
            className={`flex flex-col items-center rounded-[20px] bg-white p-2.5 pb-3 text-center text-verde ring-4 transition md:rounded-[24px] md:p-3 md:pb-4 ${
              metodo === o.id ? "ring-laranja" : "ring-transparent hover:ring-leite/40"
            }`}
          >
            <span className="flex h-20 items-end md:h-36">
              <Image src={o.foto} alt="" width={260} height={400} className="h-full w-auto mix-blend-multiply" />
            </span>
            <span className="mt-2 text-sm leading-tight font-bold md:mt-3 md:text-base">{o.nome}</span>
            <span className="mt-0.5 text-xs leading-tight text-laranja-escuro md:text-sm">{o.nota}</span>
          </button>
        ))}
      </div>

      <p className="cardapio-item display-soft mt-10 border-t border-leite/20 pt-6 text-2xl">2. Escolha o grão</p>
      <div role="radiogroup" aria-label="Grão" className="cardapio-item mt-5 grid grid-cols-2 gap-3">
        {metodos.graos.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={grao === o.id}
            onClick={() => setGrao(o.id)}
            className={`rounded-[24px] px-5 py-4 text-left ring-2 transition ${
              grao === o.id ? "bg-laranja text-verde-noite ring-laranja" : "text-leite ring-leite/25 hover:ring-leite/50"
            }`}
          >
            <span className="block font-bold">{o.nome}</span>
            <span className="block text-sm">{o.nota}</span>
          </button>
        ))}
      </div>

      <div className="cardapio-item mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-verde-escuro px-6 py-5" aria-live="polite">
        <p>
          <span className="block text-sm text-areia">Seu café</span>
          <span className="display-soft text-2xl">
            {m.nome}, grão {g.nome.toLowerCase()}
          </span>
        </p>
        <span className="display-forte text-3xl text-laranja">{reais(metodos.preco)}</span>
      </div>

      <div className="cardapio-item mt-4 flex flex-wrap items-baseline justify-between gap-4 rounded-[24px] px-6 py-5 ring-1 ring-leite/20">
        <p>
          <span className="display-soft block text-2xl">{metodos.paraDois.nome}</span>
          <span className="text-areia">{metodos.paraDois.texto}</span>
        </p>
        <span className="text-lg font-bold tabular-nums">{reais(metodos.paraDois.preco)}</span>
      </div>
    </>
  );
}

// Índice que acompanha a leitura: marca a seção na tela e, no celular,
// rola sozinho até ela.
export function IndiceCardapio({ secoes }: { secoes: { id: string; nome: string }[] }) {
  const [ativa, setAtiva] = useState(secoes[0].id);
  const indice = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const lista = indice.current;
    const item = lista?.querySelector<HTMLElement>(`[data-secao="${ativa}"]`);
    if (lista && item) lista.scrollTo({ left: item.offsetLeft - 20, behavior: "smooth" });
  }, [ativa]);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".cardapio-secao").forEach((secao) => {
      ScrollTrigger.create({
        trigger: secao,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => self.isActive && setAtiva(secao.id.replace("cardapio-", "")),
      });
    });
  });

  return (
    <nav id="cardapio-indice" aria-label="Seções do cardápio" className="sticky top-0 z-30 border-y border-verde/10 bg-white/90 backdrop-blur">
      <ol ref={indice} className="relative mx-auto flex max-w-[1300px] gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] md:px-8">
        {secoes.map((s, i) => (
          <li key={s.id} data-secao={s.id} className="shrink-0">
            <a
              href={`#cardapio-${s.id}`}
              aria-current={ativa === s.id ? "true" : undefined}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold whitespace-nowrap transition-colors ${
                ativa === s.id ? "bg-verde text-leite" : "text-verde hover:bg-verde/10"
              }`}
            >
              <span className={`text-xs tabular-nums ${ativa === s.id ? "text-laranja-claro" : "text-laranja-escuro"}`}>{String(i + 1).padStart(2, "0")}</span>
              {s.nome}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Animações de entrada do cardápio.
export function AnimacoesCardapio() {
  useGSAP(() => {
    const root = document.getElementById("cardapio");
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".cardapio-abre", {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root, start: "top 75%" },
      });

      gsap.utils.toArray<HTMLElement>(".cardapio-secao").forEach((secao) => {
        // A foto abre de baixo para cima e desacelera o zoom enquanto a seção passa.
        gsap.fromTo(
          secao.querySelector(".cardapio-moldura"),
          { clipPath: "inset(100% 0% 0% 0% round 32px)" },
          { clipPath: "inset(0% 0% 0% 0% round 32px)", duration: 1.3, ease: "expo.inOut", scrollTrigger: { trigger: secao, start: "top 75%" } },
        );
        gsap.fromTo(
          secao.querySelector(".cardapio-zoom"),
          { scale: 1.25 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: secao, start: "top bottom", end: "bottom top", scrub: 0.8 } },
        );
        // Os itens já começam escondidos: antes, eles apareciam, sumiam ao entrar
        // na tela e só depois faziam o fade (o "pisca").
        const itens = secao.querySelectorAll(".cardapio-item");
        gsap.set(itens, { y: 28, autoAlpha: 0 });
        ScrollTrigger.batch(itens, {
          start: "top 92%",
          once: true,
          onEnter: (lote) => gsap.to(lote, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.05, ease: "power2.out", overwrite: true }),
        });
      });
    });
  });
  return null;
}
