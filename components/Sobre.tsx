import Image from "next/image";
import { AnimacoesSobre } from "./Animacoes";

const texto =
  "A Flanar nasceu da vontade de desacelerar no meio da correria do centro de Itatiba. Parede verde-menta, mesas de madeira, poltronas de veludo e café passado sem pressa. Aqui dá pra chegar sozinho e começar o dia, marcar com a amiga, abrir o notebook ou só sentar perto da janela e ver a rua passar.";

// Fotos do Instagram da Flanar; pos = enquadramento no rosto de cada uma.
// Grade alinhada ao texto: uma alta à esquerda e duas menores à direita.
const fotos = [
  {
    src: "/pessoas/barista.jpg",
    alt: "Atendente da Flanar sorrindo enquanto passa a maquininha para uma cliente no balcão",
    legenda: "No balcão",
    posicao: "row-span-2",
    pos: "40% 45%",
  },
  {
    src: "/pessoas/cliente-shake.jpg",
    alt: "Cliente sorrindo com um shake no copo canelado, encostada na parede verde",
    legenda: "Hora do shake",
    posicao: "aspect-[4/5]",
    pos: "45% 30%",
  },
  {
    src: "/pessoas/cliente-vem-verao.jpg",
    alt: "Cliente brindando com o Vem Verão, ao lado de uma planta",
    legenda: "Um brinde de Vem verão",
    posicao: "aspect-[4/5]",
    pos: "55% 30%",
  },
];

export function Sobre() {

  return (
    <section id="sobre" className="relative bg-areia px-5 pt-20 pb-28 md:px-8 md:pt-28 md:pb-44">
      <AnimacoesSobre />

      {/* Abertura: o salão ao fundo, a mesa e o café na frente */}
      <div className="sobre-abertura relative -mx-5 -mt-20 mb-16 h-[88svh] min-h-[520px] overflow-hidden bg-verde-escuro text-leite md:-mx-8 md:-mt-28 md:mb-28">
        <div className="sobre-abertura-imagem absolute inset-x-0 -inset-y-[10%]">
          <Image
            src="/fotos/salao-cappuccino-cookie.jpg"
            alt="Cappuccino com chantilly e cookie na mesa de madeira; ao fundo, o salão da Flanar com poltronas verdes de veludo, banquetas, luminárias de palha e plantas"
            fill
            sizes="100vw"
            className="object-cover object-[50%_62%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end gap-5 px-5 pb-10 md:flex-row md:items-end md:justify-between md:px-8 md:pb-14">
          <h2 className="display-tight text-[19vw] md:text-[9vw]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="sobre-titulo block">Um café</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="sobre-titulo block">
                pra ficar<span className="text-laranja">.</span>
              </span>
            </span>
          </h2>
          <p className="sobre-legenda max-w-[30ch] text-lg leading-snug text-leite/90 md:pb-[1vw] md:text-right">
            Poltronas de veludo, mesas de madeira e café passado sem pressa.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-20 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7">
          <p className="sobre-texto display-soft text-[1.75rem] leading-[1.15] md:text-[2.6rem]">
            {texto.split(" ").map((palavra, i) => (
              <span key={i} className="sobre-palavra">
                {palavra}{" "}
              </span>
            ))}
          </p>
          <p className="mt-10 max-w-[54ch] text-lg leading-relaxed text-verde/90 md:mt-14">
            Na cozinha tem focaccia artesanal, ovos cremosos e pão de queijo saindo quentinho. No balcão, café especial, espresso e
            bebidas geladas montadas em camadas. E sempre um docinho pra acompanhar.
          </p>
        </div>

        <div className="sobre-fotos grid grid-cols-2 gap-3 self-start md:col-span-5 md:gap-4">
          {fotos.map((f) => (
            <figure key={f.src} className={`group relative ${f.posicao}`}>
              <div className="sobre-foto absolute inset-0 overflow-hidden rounded-[28px] md:rounded-[32px]">
                <div className="sobre-revela absolute inset-0">
                  {/* Zoom do mouse num invólucro próprio: a foto em si é animada pelo GSAP. */}
                  <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]">
                    <Image src={f.src} alt={f.alt} fill sizes="(min-width: 768px) 22vw, 50vw" className="object-cover" style={{ objectPosition: f.pos }} />
                  </div>
                </div>
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-leite/90 px-3 py-1 text-xs font-semibold text-verde backdrop-blur transition-transform duration-500 ease-out group-hover:-translate-y-1 md:bottom-4 md:left-4 md:text-sm">
                  {f.legenda}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
