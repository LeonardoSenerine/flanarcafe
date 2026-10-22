import Image from "next/image";
import { AnimacoesFaixaFoto } from "./Animacoes";

// Faixa de foto entre a bancada e o cardápio: uma pausa visual que já
// convida pra escolher.
export function FaixaFoto() {
  return (
    <section id="faixa-foto" aria-label="Escolha o seu momento" className="relative h-[78svh] min-h-[460px] overflow-hidden bg-verde-escuro text-leite">
      <AnimacoesFaixaFoto />
      <div className="faixafoto-imagem absolute -inset-y-[12%] inset-x-0">
        <Image
          src="/fotos/waffle-frutas.jpg"
          alt="Waffle de Liège com geleia de frutas vermelhas, uva, laranja e açúcar de confeiteiro"
          fill
          sizes="100vw"
          className="object-cover object-[50%_58%]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />

      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-12 md:px-8 md:pb-16">
        <p className="faixafoto-linha text-sm font-semibold tracking-[0.14em] text-laranja-claro uppercase">Do café da manhã ao docinho da tarde</p>
        <h2 className="display-tight mt-4 text-[17vw] md:text-[9vw]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="faixafoto-titulo block">Escolha o seu</span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="faixafoto-titulo block">
              momento<span className="text-laranja">.</span>
            </span>
          </span>
        </h2>
      </div>
    </section>
  );
}
