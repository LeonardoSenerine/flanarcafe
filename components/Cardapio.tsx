"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { combo, grupos, metodos, reais, type Adicional, type Grupo, type Item } from "@/lib/cardapio";
import { LoopVideo } from "./LoopVideo";

// ---------- Peças ----------

function Floco() {
  return (
    <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17l17.4-10M9 4l3 2 3-2M9 20l3-2 3 2" />
    </svg>
  );
}
function Chama() {
  return (
    <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
      <path d="M12 22c4 0 7-2.8 7-7 0-4.6-4-7-5-11-2.5 2-3 4.5-2.6 6.5C10 9.5 9.2 8 9 6.5 6.6 8.6 5 11.4 5 15c0 4.2 3 7 7 7z" />
    </svg>
  );
}

function Linha({ item }: { item: Item }) {
  return (
    <li className="cardapio-item flex items-baseline justify-between gap-4 py-4 md:gap-6 md:py-5">
      <div>
        <h4 className="display-soft flex items-center gap-2 text-[1.2rem] md:text-[1.6rem]">
          {item.nome}
          {item.temp && (
            <span className="text-laranja-escuro">
              {item.temp === "gelado" ? <Floco /> : <Chama />}
              <span className="sr-only">({item.temp})</span>
            </span>
          )}
        </h4>
        {item.texto && <p className="mt-1 max-w-[52ch] text-[0.95rem] leading-relaxed text-verde/75 md:mt-1.5 md:text-base">{item.texto}</p>}
      </div>
      <span className="shrink-0 font-bold tabular-nums md:text-lg">{reais(item.preco)}</span>
    </li>
  );
}

function Adicionais({ lista }: { lista: Adicional[] }) {
  return (
    <div className="cardapio-item mt-8 rounded-[24px] bg-verde/[0.06] p-5 md:p-6">
      <p className="text-sm font-semibold tracking-[0.12em] text-laranja-escuro uppercase">Adicionais</p>
      <ul className="mt-3 space-y-2">
        {lista.map((a) => (
          <li key={a.nome} className="flex items-baseline justify-between gap-4">
            <span>+ {a.nome}</span>
            <span className="font-bold whitespace-nowrap tabular-nums">{reais(a.preco)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Toda seção tem a mesma moldura de cantos arredondados: alta no desktop,
// mais baixa no celular para a foto não ocupar a tela inteira.
function Moldura({ numero, children }: { numero: number; children: React.ReactNode }) {
  return (
    <div className="cardapio-moldura relative aspect-[4/3] overflow-hidden rounded-[28px] bg-verde-escuro md:aspect-[4/5] md:rounded-[32px]">
      <div className="cardapio-zoom absolute inset-0">{children}</div>
      <span className="absolute top-5 left-5 rounded-full bg-leite/90 px-3.5 py-1.5 text-sm font-semibold text-verde tabular-nums backdrop-blur">
        {String(numero).padStart(2, "0")} / {String(secoes.length).padStart(2, "0")}
      </span>
    </div>
  );
}

function Cabecalho({ id, numero, origem, titulo, texto, claro }: { id: string; numero: number; origem: string; titulo: string; texto: string; claro?: boolean }) {
  return (
    <>
      <p className={`cardapio-item text-sm font-semibold tracking-[0.14em] uppercase ${claro ? "text-laranja" : "text-laranja-escuro"}`}>
        {String(numero).padStart(2, "0")} · {origem}
      </p>
      <h3 id={id} className="cardapio-item display-tight mt-3 text-[14vw] md:mt-4 md:text-[6vw]">{titulo}</h3>
      <p className="cardapio-item mt-4 max-w-[46ch] leading-relaxed opacity-85 md:mt-5 md:text-lg">{texto}</p>
    </>
  );
}

// ---------- Seções ----------

const fundos = ["bg-white", "bg-leite"];

function SecaoGrupo({ grupo, numero }: { grupo: Grupo; numero: number }) {
  const inverte = numero % 2 === 0;
  return (
    <section id={`cardapio-${grupo.id}`} aria-labelledby={`titulo-${grupo.id}`} className={`cardapio-secao px-5 py-16 md:px-8 md:py-32 ${fundos[numero % 2]}`}>
      {/* Celular: título, foto e lista, nessa ordem. Desktop: a foto ocupa a coluna inteira ao lado. */}
      <div className="mx-auto grid max-w-[1300px] gap-8 md:grid-cols-12 md:gap-x-16 md:gap-y-10">
        <div className={`md:col-span-7 md:row-start-1 ${inverte ? "md:col-start-1" : "md:col-start-6"}`}>
          <Cabecalho id={`titulo-${grupo.id}`} numero={numero} origem={grupo.origem} titulo={grupo.titulo} texto={grupo.texto} />
        </div>
        <div className={`md:col-span-5 md:row-span-2 md:row-start-1 ${inverte ? "md:col-start-8" : "md:col-start-1"}`}>
          <div className="md:sticky md:top-28">
            <Moldura numero={numero}>
              <Image
                src={grupo.foto.src}
                alt={grupo.foto.alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
                style={{ objectPosition: grupo.foto.pos }}
              />
            </Moldura>
          </div>
        </div>
        <div className={`md:col-span-7 ${inverte ? "md:col-start-1" : "md:col-start-6"}`}>
          <ul className="divide-y divide-verde/15 border-y border-verde/15">
            {grupo.itens.map((item) => (
              <Linha key={item.nome} item={item} />
            ))}
          </ul>
          {grupo.adicionais && <Adicionais lista={grupo.adicionais} />}
        </div>
      </div>
    </section>
  );
}

// Monte seu café: o único bloco verde, para quebrar o ritmo no meio do cardápio.
function SecaoMetodos({ numero }: { numero: number }) {
  const [metodo, setMetodo] = useState(metodos.opcoes[1].id);
  const [grao, setGrao] = useState(metodos.graos[0].id);
  const m = metodos.opcoes.find((o) => o.id === metodo)!;
  const g = metodos.graos.find((o) => o.id === grao)!;

  return (
    <section id="cardapio-metodos" aria-labelledby="titulo-metodos" className="cardapio-secao bg-verde px-5 py-16 text-leite md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1300px] gap-8 md:grid-cols-12 md:gap-x-16 md:gap-y-10">
        <div className="md:col-span-7 md:col-start-6 md:row-start-1">
          <Cabecalho id="titulo-metodos" numero={numero} origem="Do balcão" titulo="Cafés especiais" texto={metodos.sobre} claro />
        </div>
        <div className="md:col-span-5 md:col-start-1 md:row-span-2 md:row-start-1">
          <div className="md:sticky md:top-28">
            <Moldura numero={numero}>
              <LoopVideo name="coar" label="Café saindo da prensa francesa direto para a caneca verde" className="absolute inset-0 h-full w-full object-cover" />
            </Moldura>
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6">
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
                  grao === o.id ? "bg-laranja text-verde ring-laranja" : "text-leite ring-leite/25 hover:ring-leite/50"
                }`}
              >
                <span className="block font-bold">{o.nome}</span>
                <span className="block text-sm opacity-85">{o.nota}</span>
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
        </div>
      </div>
    </section>
  );
}

// ---------- Cardápio ----------

type Secao = { id: string; nome: string; grupo?: Grupo };
const secoes: Secao[] = [
  ...grupos.slice(0, 2).map((g) => ({ id: g.id, nome: g.aba, grupo: g })),
  { id: "metodos", nome: "Cafés especiais" },
  ...grupos.slice(2).map((g) => ({ id: g.id, nome: g.aba, grupo: g })),
];

export function Cardapio() {
  const root = useRef<HTMLElement>(null);
  const [ativa, setAtiva] = useState(secoes[0].id);
  const indice = useRef<HTMLOListElement>(null);

  // No celular o índice não cabe inteiro: rola até a seção ativa.
  useEffect(() => {
    const lista = indice.current;
    const item = lista?.querySelector<HTMLElement>(`[data-secao="${ativa}"]`);
    if (lista && item) lista.scrollTo({ left: item.offsetLeft - 20, behavior: "smooth" });
  }, [ativa]);

  useGSAP(
    () => {
      // Índice: marca a seção que está na tela.
      gsap.utils.toArray<HTMLElement>(".cardapio-secao").forEach((secao) => {
        ScrollTrigger.create({
          trigger: secao,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => self.isActive && setAtiva(secao.id.replace("cardapio-", "")),
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cardapio-abre", {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
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
            { scale: 1, ease: "none", scrollTrigger: { trigger: secao, start: "top bottom", end: "bottom top", scrub: true } },
          );
          ScrollTrigger.batch(secao.querySelectorAll(".cardapio-item"), {
            start: "top 88%",
            once: true,
            onEnter: (itens) => gsap.from(itens, { y: 28, autoAlpha: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" }),
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="cardapio" ref={root} className="bg-white text-verde">
      <div className="px-5 pt-28 pb-16 md:px-8 md:pt-36 md:pb-24">
        <div className="mx-auto max-w-[1300px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="cardapio-abre display-tight text-[25vw] md:text-[11vw]">Cardápio</h2>
            <p className="cardapio-abre max-w-[36ch] text-lg leading-relaxed text-verde/85 md:pb-[1.2vw]">
              Tudo o que sai da cozinha e do balcão, com os preços de hoje. Cobramos taxa de serviço opcional de 10%.
            </p>
          </div>

          {/* Combo: o destaque do impresso */}
          <article className="cardapio-abre mt-14 grid overflow-hidden rounded-[32px] bg-verde text-leite md:mt-20 md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[520px]">
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
                <span className="rounded-full bg-laranja px-3.5 py-1 text-sm font-bold tracking-[0.12em] text-verde uppercase">Combo</span>
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
        </div>
      </div>

      {/* Índice que acompanha a leitura */}
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
                <span className={`text-xs tabular-nums ${ativa === s.id ? "text-laranja" : "text-verde/50"}`}>{String(i + 1).padStart(2, "0")}</span>
                {s.nome}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {secoes.map((s, i) =>
        s.grupo ? <SecaoGrupo key={s.id} grupo={s.grupo} numero={i + 1} /> : <SecaoMetodos key={s.id} numero={i + 1} />,
      )}
    </section>
  );
}
