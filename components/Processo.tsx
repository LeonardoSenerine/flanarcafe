import { etapas } from "@/lib/content";
import { LoopVideo } from "./LoopVideo";
import { AnimacoesProcesso } from "./Animacoes";

// No desktop, o scroll vertical vira um passeio horizontal pela bancada.
// No celular, as etapas ficam uma embaixo da outra, sem texto cortado na borda.
export function Processo() {

  return (
    <section id="processo" className="relative bg-verde text-areia">
      <AnimacoesProcesso />
      <div className="relative flex flex-col justify-center py-24 md:h-svh md:overflow-hidden md:py-0 md:motion-reduce:overflow-x-auto">
        <div className="processo-trilho flex flex-col gap-12 px-5 md:w-max md:flex-row md:items-center md:gap-10 md:px-[6vw]">
          <div className="md:w-[36vw] md:shrink-0">
            <h2 className="display-tight text-[23vw] md:text-[9.5vw]">Feito na hora</h2>
            <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-areia/90">
              Café especial em vários métodos de preparo e uma cozinha artesanal. Cada pedido passa pelas mãos de alguém da casa, e quase tudo acontece à vista de onde você está sentado.
            </p>
          </div>

          {etapas.map((etapa) => (
            <article key={etapa.titulo} className="etapa grid grid-cols-[42%_1fr] items-center gap-5 md:block md:w-[23vw] md:shrink-0">
              <div className="etapa-moldura relative aspect-[540/660] overflow-hidden rounded-[24px] bg-verde-escuro md:rounded-[28px]">
                <LoopVideo name={etapa.video} label={etapa.texto} className="etapa-video absolute inset-0 h-full w-full object-cover" />
                <span className="absolute top-4 left-4 hidden rounded-full bg-areia-claro/90 px-3 py-1 text-sm font-medium text-verde md:block">
                  {etapa.estacao}
                </span>
              </div>
              <div className="etapa-texto">
                <p className="text-sm font-semibold tracking-[0.12em] text-laranja-claro uppercase md:hidden">{etapa.estacao}</p>
                <h3 className="etapa-titulo display-tight mt-2 text-[10vw] md:mt-5 md:text-[5.5vw]">{etapa.titulo}</h3>
                <p className="mt-3 max-w-[34ch] leading-relaxed text-areia/90">{etapa.texto}</p>
              </div>
            </article>
          ))}

          <div className="hidden w-[4vw] shrink-0 md:block" aria-hidden />
        </div>

        <div className="absolute inset-x-[6vw] bottom-8 hidden h-[3px] overflow-hidden rounded-full bg-areia/15 md:block md:motion-reduce:hidden">
          <div className="processo-barra h-full origin-left bg-laranja" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
