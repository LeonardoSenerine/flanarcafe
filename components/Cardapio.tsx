"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { combo, grupos, metodos, reais, type Adicional, type Item } from "@/lib/cardapio";

// ---------- Peças do cardápio impresso ----------

function Floco() {
  return (
    <svg viewBox="0 0 24 24" className="h-[0.9em] w-[0.9em]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17l17.4-10M9 4l3 2 3-2M9 20l3-2 3 2" />
    </svg>
  );
}
function Chama() {
  return (
    <svg viewBox="0 0 24 24" className="h-[0.9em] w-[0.9em]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
      <path d="M12 22c4 0 7-2.8 7-7 0-4.6-4-7-5-11-2.5 2-3 4.5-2.6 6.5C10 9.5 9.2 8 9 6.5 6.6 8.6 5 11.4 5 15c0 4.2 3 7 7 7z" />
    </svg>
  );
}

// Nome na etiqueta laranja, linha tracejada até o preço: como no impresso.
function Linha({ item }: { item: Item }) {
  return (
    <li className="cardapio-item">
      <div className="flex items-end gap-3">
        <h4 className="inline-flex items-center gap-1.5 bg-laranja-escuro px-2 py-0.5 text-[0.95rem] font-bold tracking-wide text-leite uppercase">
          {item.nome}
          {item.temp === "gelado" && (
            <>
              <Floco />
              <span className="sr-only">(gelado)</span>
            </>
          )}
          {item.temp === "quente" && (
            <>
              <Chama />
              <span className="sr-only">(quente)</span>
            </>
          )}
        </h4>
        <span className="mb-1.5 min-w-6 flex-1 border-b-2 border-dashed border-verde/35" aria-hidden />
        <span className="text-[1.05rem] font-bold whitespace-nowrap text-verde">{reais(item.preco)}</span>
      </div>
      {item.texto && <p className="mt-1.5 max-w-[58ch] leading-relaxed text-verde/85">{item.texto}</p>}
    </li>
  );
}

function Adicionais({ lista }: { lista: Adicional[] }) {
  return (
    <ul className="cardapio-item mt-8 space-y-2">
      {lista.map((a) => (
        <li key={a.nome} className="flex items-center gap-3 rounded-sm bg-laranja-escuro px-3 py-1.5 text-[0.95rem] font-medium text-leite">
          <span>+ {a.nome}</span>
          <span className="flex-1 border-b border-dashed border-leite/50" aria-hidden />
          <span className="font-bold whitespace-nowrap">{reais(a.preco)}</span>
        </li>
      ))}
    </ul>
  );
}

// Fotos recortadas do impresso, com o arco laranja da marca por trás.
function Vitrine({ fotos }: { fotos: { src: string; alt: string }[] }) {
  const larga = fotos.length === 1;
  return (
    <div className="relative">
      <svg viewBox="0 0 200 200" className="cardapio-arco absolute -top-[8%] -left-[10%] w-[90%] text-laranja" aria-hidden>
        <ellipse cx="100" cy="100" rx="78" ry="92" transform="rotate(34 100 100)" fill="none" stroke="currentColor" strokeWidth="16" />
      </svg>
      <div className={`relative grid gap-4 ${larga ? "" : "grid-cols-2 items-end"}`}>
        {fotos.map((f, i) => (
          // O multiply fica no contêiner animado: o transform dele isolaria o blend da imagem.
          <div key={f.src} className={`cardapio-foto relative mix-blend-multiply ${!larga && i === 1 ? "translate-y-10" : ""}`}>
            <Image src={f.src} alt={f.alt} width={600} height={700} sizes="(min-width: 768px) 20vw, 45vw" className="h-auto w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Monte seu café (métodos) ----------

function MonteSeuCafe() {
  const [metodo, setMetodo] = useState(metodos.opcoes[1].id);
  const [grao, setGrao] = useState(metodos.graos[0].id);
  const m = metodos.opcoes.find((o) => o.id === metodo)!;
  const g = metodos.graos.find((o) => o.id === grao)!;

  return (
    <div className="grid gap-12 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-7">
        <p className="cardapio-item flex items-baseline gap-3">
          <span className="display-tight text-[11vw] md:text-[3.6vw]">Passo inicial</span>
          <span className="display-forte text-2xl text-laranja-texto">{reais(metodos.preco)}</span>
        </p>
        <p className="cardapio-item mt-2 text-lg text-verde/85">{metodos.volume} de café no seu método e grão favorito.</p>

        <div role="radiogroup" aria-label="Método de preparo" className="cardapio-item mt-6 grid grid-cols-3 gap-3">
          {metodos.opcoes.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={metodo === o.id}
              onClick={() => setMetodo(o.id)}
              className={`flex flex-col items-center rounded-[24px] bg-white p-3 pb-4 text-center ring-2 transition ${
                metodo === o.id ? "ring-laranja" : "ring-verde/10 hover:ring-verde/30"
              }`}
            >
              <Image src={o.foto} alt="" width={260} height={400} className="h-28 w-auto mix-blend-multiply md:h-40" />
              <span className="mt-3 font-bold text-verde">{o.nome}</span>
              <span className="text-sm text-laranja-escuro">{o.nota}</span>
            </button>
          ))}
        </div>

        <p className="cardapio-item display-tight mt-10 text-[11vw] md:text-[3.6vw]">Passo final</p>
        <p className="cardapio-item mt-2 text-lg text-verde/85">Escolha seu grão favorito.</p>
        <div role="radiogroup" aria-label="Grão" className="cardapio-item mt-5 flex flex-wrap gap-3">
          {metodos.graos.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={grao === o.id}
              onClick={() => setGrao(o.id)}
              className={`rounded-full px-5 py-3 text-left ring-2 transition ${
                grao === o.id ? "bg-verde text-leite ring-verde" : "bg-white text-verde ring-verde/15 hover:ring-verde/35"
              }`}
            >
              <span className="block font-bold">{o.nome}</span>
              <span className="block text-sm opacity-85">{o.nota}</span>
            </button>
          ))}
        </div>

        <div className="cardapio-item mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-verde px-6 py-5 text-leite" aria-live="polite">
          <p>
            <span className="block text-sm text-areia">Seu café</span>
            <span className="display-soft text-2xl">
              {m.nome} com grão {g.nome.toLowerCase()}, {metodos.volume}
            </span>
          </p>
          <span className="display-forte text-3xl text-laranja">{reais(metodos.preco)}</span>
        </div>
      </div>

      <div className="md:col-span-5">
        <div className="cardapio-item rounded-[28px] bg-areia-claro p-6 md:p-8">
          <p className="text-sm font-semibold text-laranja-escuro">Para compartilhar</p>
          <div className="mt-2 flex items-baseline justify-between gap-4">
            <p className="display-tight text-[10vw] md:text-[3vw]">{metodos.paraDois.nome}</p>
            <span className="display-forte text-2xl text-laranja-texto">{reais(metodos.paraDois.preco)}</span>
          </div>
          <Image src={metodos.paraDois.foto} alt="Duas prensas francesas com café" width={460} height={315} className="mt-4 h-auto w-full mix-blend-multiply" />
          <p className="mt-4 leading-relaxed text-verde/85">{metodos.paraDois.texto}</p>
        </div>
        <p className="cardapio-item mt-6 leading-relaxed text-verde/85">{metodos.sobre}</p>
      </div>
    </div>
  );
}

// ---------- Seção ----------

const abas = [
  ...grupos.slice(0, 2).map((g) => ({ id: g.id, nome: g.aba })),
  { id: "metodos", nome: "Cafés especiais" },
  ...grupos.slice(2).map((g) => ({ id: g.id, nome: g.aba })),
];

export function Cardapio() {
  const root = useRef<HTMLElement>(null);
  const [ativa, setAtiva] = useState(abas[0].id);
  const grupo = grupos.find((g) => g.id === ativa);

  // A cada troca de aba: itens entram em sequência, fotos sobem e o arco gira.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cardapio-item", { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.04, ease: "power3.out" });
        gsap.from(".cardapio-foto", { y: 50, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: "expo.out" });
        gsap.from(".cardapio-arco", { rotate: -40, scale: 0.8, autoAlpha: 0, duration: 1.1, ease: "expo.out", transformOrigin: "50% 50%" });
      });
    },
    { scope: root, dependencies: [ativa] },
  );

  const teclas = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = abas.findIndex((a) => a.id === ativa);
    const prox = abas[(i + (e.key === "ArrowRight" ? 1 : abas.length - 1)) % abas.length];
    setAtiva(prox.id);
    root.current?.querySelector<HTMLButtonElement>(`#aba-${prox.id}`)?.focus();
  };

  return (
    <section id="cardapio" ref={root} className="bg-white px-5 py-28 text-verde md:px-8 md:py-36">
      <div className="mx-auto max-w-[1300px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="display-tight text-[25vw] md:text-[11vw]">Cardápio</h2>
          <p className="max-w-[36ch] text-lg leading-relaxed text-verde/85 md:pb-[1.2vw]">
            Tudo o que sai da cozinha e do balcão, com os preços de hoje. Cobramos taxa de serviço opcional de 10%.
          </p>
        </div>

        {/* Combo: o destaque do impresso */}
        <article className="mt-14 grid overflow-hidden rounded-[32px] bg-verde text-leite md:mt-20 md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[460px]">
            <Image
              src={combo.foto}
              alt="Combo café da manhã: ovos mexidos com tomate cereja, focaccia, bolo de vó e suco"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-6 p-7 md:p-12">
            <p className="flex items-center gap-3">
              <span className="bg-laranja-escuro px-2.5 py-1 text-lg font-bold">Combo</span>
              <span className="display-forte text-3xl">{reais(combo.preco)}</span>
            </p>
            <h3 className="display-forte text-[14vw] leading-[0.9] md:text-[5.2vw]">
              Café da <span className="text-laranja">manhã</span>
            </h3>
            <ul className="space-y-1.5 text-lg">
              {combo.inclui.map((i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-laranja" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
            <div>
              <p className="text-sm text-areia">A bebida pode ser:</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {combo.bebidas.map((b) => (
                  <li key={b} className="rounded-full bg-leite/10 px-3.5 py-1.5 text-sm font-medium ring-1 ring-leite/25">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* Abas */}
        <div className="sticky top-20 z-30 -mx-5 mt-16 bg-white/90 px-5 py-3 backdrop-blur md:top-24 md:mx-0 md:mt-24 md:px-0">
          <div role="tablist" aria-label="Partes do cardápio" onKeyDown={teclas} className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
            {abas.map((a) => (
              <button
                key={a.id}
                id={`aba-${a.id}`}
                type="button"
                role="tab"
                aria-selected={ativa === a.id}
                aria-controls="cardapio-painel"
                tabIndex={ativa === a.id ? 0 : -1}
                onClick={() => setAtiva(a.id)}
                className={`shrink-0 rounded-full px-5 py-2.5 font-semibold whitespace-nowrap transition-colors ${
                  ativa === a.id ? "bg-verde text-leite" : "bg-areia-claro text-verde hover:bg-areia"
                }`}
              >
                {a.nome}
              </button>
            ))}
          </div>
        </div>

        <div id="cardapio-painel" role="tabpanel" aria-labelledby={`aba-${ativa}`} className="mt-12 md:mt-16">
          {grupo ? (
            <div className="grid gap-14 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-5">
                <div className="md:sticky md:top-44">
                  <Vitrine key={grupo.id} fotos={grupo.fotos} />
                </div>
              </div>
              <div className="md:col-span-7">
                <h3 className="cardapio-item display-tight text-[15vw] md:text-[5vw]">{grupo.titulo}</h3>
                <p className="cardapio-item mt-3 max-w-[48ch] text-lg text-verde/85">{grupo.texto}</p>
                <ul className="mt-10 space-y-7">
                  {grupo.itens.map((item) => (
                    <Linha key={item.nome} item={item} />
                  ))}
                </ul>
                {grupo.adicionais && <Adicionais lista={grupo.adicionais} />}
              </div>
            </div>
          ) : (
            <MonteSeuCafe />
          )}
        </div>
      </div>
    </section>
  );
}
