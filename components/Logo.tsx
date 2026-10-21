import { logoHorizontal, logoVertical, simbolo } from "@/lib/logo";

type Props = { className?: string; title?: string };

// Sem título, o logo é decorativo (o link em volta já tem o nome).
const rotulo = (title: string) => (title ? { role: "img", "aria-label": title } : { "aria-hidden": true });

// Símbolo e "café" seguem a cor do texto (currentColor); "flanar" é sempre laranja.
export function Logo({ className, title = "Flanar Café" }: Props) {
  const l = logoHorizontal;
  return (
    <svg viewBox={`0 0 ${l.w} ${l.h}`} className={className} {...rotulo(title)}>
      <path fill="currentColor" fillRule="evenodd" d={l.anel} />
      <path fill="currentColor" d={l.vinco} />
      <path className="fill-laranja stroke-laranja" strokeWidth={l.pesoF} strokeLinejoin="round" d={l.flanar} />
      <path fill="currentColor" stroke="currentColor" strokeWidth={l.pesoC} strokeLinejoin="round" d={l.cafe} />
    </svg>
  );
}

export function LogoVertical({ className, title = "Flanar Café" }: Props) {
  const l = logoVertical;
  return (
    <svg viewBox={`0 0 ${l.w} ${l.h}`} className={className} {...rotulo(title)}>
      <path fill="currentColor" fillRule="evenodd" d={l.anel} />
      <path fill="currentColor" d={l.vinco} />
      <path className="fill-laranja stroke-laranja" strokeWidth={l.pesoF} strokeLinejoin="round" d={l.flanar} />
      <path fill="currentColor" stroke="currentColor" strokeWidth={l.pesoC} strokeLinejoin="round" d={l.cafe} />
    </svg>
  );
}

export function Simbolo({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${simbolo.w} ${simbolo.h}`} className={className} aria-hidden>
      <path fill="currentColor" fillRule="evenodd" d={simbolo.anel} />
      <path fill="currentColor" d={simbolo.vinco} />
    </svg>
  );
}
