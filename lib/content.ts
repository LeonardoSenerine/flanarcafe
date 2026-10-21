// Conteúdo do site num lugar só, pra facilitar a troca de textos e fotos.

// Dados do perfil do Google e do Instagram da Flanar.
export const contato = {
  endereco: "Rua Santa Clara, 90",
  bairro: "Centro, Itatiba, SP",
  horarios: [
    { dias: "Segunda a sexta", horas: "8h às 18h" },
    { dias: "Sábado", horas: "8h às 17h" },
    { dias: "Domingo", horas: "8h às 13h" },
  ],
  instagram: "https://www.instagram.com/flanarcafe/",
  instagramHandle: "@flanarcafe",
  links: "https://linktr.ee/flanarcafe",
  mapsBusca: "Flanar Café, Rua Santa Clara, 90, Itatiba - SP",
};

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contato.mapsBusca)}`;
export const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(contato.mapsBusca)}`;
export const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(contato.mapsBusca)}&output=embed`;

export const nav = [
  { href: "#sobre", label: "Sobre" },
  { href: "#processo", label: "Na bancada" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#como-chegar", label: "Como chegar" },
];

export type Etapa = {
  estacao: string;
  titulo: string;
  texto: string;
  video: string;
};

export const etapas: Etapa[] = [
  {
    estacao: "No balcão",
    titulo: "Coar",
    texto: "Café passado na prensa e servido direto na caneca, sem esperar esfriar.",
    video: "coar",
  },
  {
    estacao: "No balcão",
    titulo: "Montar",
    texto: "Calda, leite e café em camadas, uma por cima da outra, e espuma na colher pra fechar.",
    video: "camadas",
  },
  {
    estacao: "Na cozinha",
    titulo: "Prensar",
    texto: "A focaccia artesanal vai pra chapa até ganhar casquinha por fora.",
    video: "prensar",
  },
  {
    estacao: "Na cozinha",
    titulo: "Dourar",
    texto: "Um toque de maçarico no recheio pra dourar por cima antes de fechar o sanduíche.",
    video: "macarico",
  },
  {
    estacao: "Na confeitaria",
    titulo: "Finalizar",
    texto: "Doce de leite desenhado em cima do waffle na hora que ele sai da máquina.",
    video: "doce-de-leite",
  },
];

export const galeria = [
  "/fotos/waffle-calda-frutas-vermelhas.jpg",
  "/fotos/pao-de-queijo.jpg",
  "/fotos/latte-gelado.jpg",
  "/fotos/brownie-sorvete.jpg",
  "/fotos/sanduiche-focaccia-presunto-queijo.jpg",
  "/fotos/chocolate-quente-chantilly.jpg",
  "/fotos/waffle-geleia-latte.jpg",
  "/fotos/ovos-mexidos.jpg",
  "/fotos/drink-laranja-camadas.jpg",
  "/fotos/pao-de-queijo-doce-de-leite.jpg",
  "/fotos/suco-laranja.jpg",
  "/fotos/focaccia-presunto-mel.jpg",
];
