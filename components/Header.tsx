"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { contato, nav } from "@/lib/content";
import { Logo } from "./Logo";

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // Some ao descer a página e volta ao subir. Dentro do cardápio fica escondido,
  // porque o índice do cardápio ocupa o topo da tela.
  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const indice = document.getElementById("cardapio-indice");
        const noCardapio = !!indice && indice.getBoundingClientRect().top <= 1 && indice.parentElement!.getBoundingClientRect().bottom > 120;
        const hide = noCardapio || (self.direction === 1 && self.scroll() > 240);
        gsap.to(ref.current, { yPercent: hide ? -160 : 0, duration: 0.45, ease: "power3.out", overwrite: true });
      },
    });
  });

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full bg-areia-claro/85 py-2 pr-2 pl-5 ring-1 ring-verde/10 backdrop-blur-md">
        <a href="#topo" aria-label="Flanar Café, voltar ao início" className="text-verde">
          <Logo title="" className="h-10 w-auto md:h-11" />
        </a>

        <nav aria-label="Seções" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors hover:bg-verde/10">
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={contato.instagram}
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-full bg-verde px-5 py-2.5 text-sm font-medium text-areia transition-colors hover:bg-verde-escuro md:inline-flex"
        >
          Seguir no Instagram
        </a>

        <button
          type="button"
          className="rounded-full bg-verde px-5 py-2.5 text-sm font-medium text-areia md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Seções" className="mt-2 flex flex-col gap-1 rounded-[28px] bg-verde p-6 text-areia md:hidden">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="display-tight py-1 text-6xl">
              {item.label}
            </a>
          ))}
          <a href={contato.instagram} target="_blank" rel="noreferrer" className="mt-4 self-start rounded-full bg-laranja px-5 py-3 text-sm font-semibold text-verde">
            Seguir no Instagram
          </a>
        </nav>
      )}
    </header>
  );
}
