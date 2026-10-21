import type { Metadata } from "next";
import { PaginaSimples } from "@/components/PaginaSimples";
import { contato } from "@/lib/content";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como o site da Flanar Café trata os dados de quem visita: o que é coletado, por quem e como falar com a gente.",
  alternates: { canonical: "/privacidade" },
};

const atualizada = "21 de outubro de 2026";

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-verde/15 py-8 md:grid md:grid-cols-12 md:gap-10 md:py-10">
      <h2 className="display-soft text-2xl md:col-span-4 md:text-3xl">{titulo}</h2>
      <div className="mt-4 space-y-4 text-lg leading-relaxed text-verde/85 md:col-span-8 md:mt-0">{children}</div>
    </section>
  );
}

const link = "font-semibold underline decoration-laranja decoration-2 underline-offset-4";

export default function Privacidade() {
  return (
    <PaginaSimples>
      <article className="mx-auto max-w-[1100px] px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
        <p className="text-sm font-semibold tracking-[0.14em] text-laranja-escuro uppercase">Atualizada em {atualizada}</p>
        <h1 className="display-tight mt-4 text-[17vw] md:text-[8vw]">Política de privacidade</h1>
        <p className="mt-8 max-w-[52ch] text-xl leading-relaxed md:text-2xl">
          O site da Flanar é só uma vitrine: mostra o cardápio, o salão e como chegar. Ele não tem cadastro, formulário, login nem
          loja, e não pede seu nome, e-mail, telefone ou dados de pagamento.
        </p>

        <div className="mt-14">
          <Secao titulo="Quem somos">
            <p>
              Flanar Café, cafeteria no endereço {contato.endereco}, {contato.bairro}. Esta política segue a Lei Geral de Proteção de Dados
              (Lei 13.709/2018, a LGPD).
            </p>
          </Secao>

          <Secao titulo="O que é registrado quando você visita">
            <p>
              Como qualquer site, a empresa que hospeda o nosso (a Vercel) registra dados técnicos de cada acesso: endereço IP, tipo de
              navegador e aparelho, data, hora e página visitada. Esses registros servem para o site funcionar e se proteger de abusos, e
              são apagados automaticamente pela própria Vercel depois de um tempo.
            </p>
            <p>
              Nós não usamos cookies próprios, nem ferramentas de estatística, rastreamento ou anúncios. As fontes e as fotos são
              servidas pelo próprio site.
            </p>
          </Secao>

          <Secao titulo="Mapa e links de outros serviços">
            <p>
              A seção &ldquo;Como chegar&rdquo; mostra um mapa do Google Maps. Quando ele carrega, o Google recebe dados do seu acesso e pode
              usar cookies, de acordo com a{" "}
              <a href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noreferrer" className={link}>
                política de privacidade do Google
              </a>
              .
            </p>
            <p>
              Os botões para o Instagram, o Linktree (delivery), o Google Maps e o Waze levam para fora do nosso site. Lá valem as
              regras de cada serviço.
            </p>
          </Secao>

          <Secao titulo="Seus direitos">
            <p>
              Pela LGPD, você pode pedir para saber se tratamos algum dado seu, ter acesso a ele, corrigi-lo ou pedir que seja apagado.
              Como o site não guarda dados pessoais, na prática isso vale para qualquer conversa que você tenha com a gente pelos nossos
              canais.
            </p>
          </Secao>

          <Secao titulo="Fale com a gente">
            <p>
              Qualquer dúvida sobre privacidade, chama no Instagram{" "}
              <a href={contato.instagram} target="_blank" rel="noreferrer" className={link}>
                {contato.instagramHandle}
              </a>{" "}
              ou fala com a gente no balcão.
            </p>
          </Secao>

          <Secao titulo="Mudanças nesta política">
            <p>Se o site mudar (por exemplo, ganhar reservas ou pedidos online), esta página será atualizada e a data lá em cima também.</p>
          </Secao>
        </div>
      </article>
    </PaginaSimples>
  );
}
