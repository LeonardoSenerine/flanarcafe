// Cardápio da Flanar, transcrito do cardápio impresso (assets/cardapio).
// Preços em reais. "temp" marca as bebidas quentes e geladas, como no impresso.

export type Item = {
  nome: string;
  preco: number;
  texto?: string;
  temp?: "quente" | "gelado";
};

export type Adicional = { nome: string; preco: number };

export type Foto = { src: string; alt: string; pos?: string };

export type Grupo = {
  id: string;
  aba: string;
  origem: string;
  titulo: string;
  texto: string;
  foto: Foto;
  itens: Item[];
  adicionais?: Adicional[];
};

export const combo = {
  nome: "Café da manhã",
  preco: 44.9,
  inclui: ["Ovos mexidos com tomate cereja", "Pão de focaccia", "Bolo de vó", "1 bebida"],
  bebidas: ["Café prensa francesa", "Café com leite", "Suco"],
  foto: "/cardapio/combo.webp",
};

export const metodos = {
  preco: 15.9,
  volume: "180ml",
  opcoes: [
    { id: "prensa", nome: "Prensa francesa", nota: "Mais suave e aromático", foto: "/cardapio/prensa.webp" },
    { id: "v60", nome: "V60", nota: "Clássico e equilibrado", foto: "/cardapio/v60.webp" },
    { id: "aeropress", nome: "Aeropress", nota: "Mais intenso", foto: "/cardapio/metodo-aeropress.webp" },
  ],
  graos: [
    { id: "chocolate", nome: "Chocolate", nota: "Mais intensidade" },
    { id: "frutado", nome: "Frutado", nota: "Mais frescor" },
  ],
  paraDois: {
    nome: "Café para dois",
    preco: 29.9,
    texto: "380ml de café coado na prensa francesa, V60 ou Aeropress.",
    foto: "/cardapio/para-dois.webp",
  },
  sobre:
    "Trabalhamos com cafés especiais, que estão acima da categoria de cafés gourmet: bebidas mais aromáticas e saborosas. Para mais detalhes, é só perguntar ao barista.",
};

export const grupos: Grupo[] = [
  {
    id: "cafe-da-manha",
    aba: "Café da manhã",
    origem: "Da cozinha",
    titulo: "Café da manhã",
    texto: "Ovos cremosos, focaccia artesanal e pão de queijo saindo quentinho.",
    foto: { src: "/fotos/ovos-mexidos.jpg", alt: "Ovos mexidos cremosos com cebolinha, no prato de cerâmica", pos: "50% 60%" },
    itens: [
      { nome: "Ovos mexidos simples", preco: 13.9, texto: "Ovos mexidos cremosos com cebolinha e pimenta do reino." },
      { nome: "Ovos mexidos com pão artesanal", preco: 20.9, texto: "Ovos mexidos cremosos com cebolinha e pimenta do reino, acompanhados do pão artesanal de focaccia." },
      { nome: "Ovos mexidos da Flanar", preco: 24.9, texto: "Ovos mexidos cremosos com cebolinha e pimenta do reino, pão de focaccia artesanal e tomate cereja assado." },
      { nome: "Misto quente", preco: 15.9, texto: "Pão de forma na chapa recheado com presunto e muçarela." },
      { nome: "Queijo quente", preco: 17.9, texto: "Pão de forma na chapa recheado com requeijão e muçarela maçaricada." },
      { nome: "Pão de queijo", preco: 15.9, texto: "Porção com 5 mini pães de queijo." },
    ],
    adicionais: [
      { nome: "Melado de cana no queijo quente", preco: 3.9 },
      { nome: "Doce de leite no pão de queijo", preco: 4.9 },
    ],
  },
  {
    id: "sanduiches",
    aba: "Sanduíches",
    origem: "Da cozinha",
    titulo: "Sanduíches especiais",
    texto: "Todos no pão de focaccia artesanal, feito por aqui.",
    foto: { src: "/fotos/sanduiche-focaccia-presunto-queijo.jpg", alt: "Sanduíche de presunto e queijo na focaccia artesanal", pos: "50% 55%" },
    itens: [
      { nome: "Tomate cereja", preco: 29.9, texto: "Focaccia recheada com pasta de queijo artesanal, tomate cereja assado e queijo parmesão ralado." },
      { nome: "Tuna melt", preco: 32.9, texto: "Focaccia recheada com rúcula, patê de atum, picles e queijo muçarela derretido." },
      { nome: "Presunto e nozes", preco: 31.9, texto: "Focaccia recheada com pasta de queijo artesanal, nozes, tomate e presunto." },
    ],
  },
  {
    id: "espressos",
    aba: "Espressos",
    origem: "Do balcão",
    titulo: "Espressos e cappuccinos",
    texto: "Da dose curta ao cappuccino com Nutella.",
    foto: { src: "/fotos/trio-cafes.jpg", alt: "Cappuccinos e café com leite na caneca verde da Flanar, em cima da mesa", pos: "50% 60%" },
    itens: [
      { nome: "Espresso 40ml", preco: 9.9 },
      { nome: "Espresso duplo 80ml", preco: 14.9 },
      { nome: "Espresso com panna", preco: 13.9, texto: "Espresso com uma camada de chantilly." },
      { nome: "Café com leite", preco: 13.9 },
      { nome: "Cappuccino de Nutella", preco: 22.9, texto: "Espresso, leite vaporizado, finalizado com Nutella.", temp: "quente" },
      { nome: "Cappuccino de doce de leite", preco: 19.9, texto: "Espresso, leite vaporizado, finalizado com doce de leite.", temp: "quente" },
      { nome: "Cappuccino cacau e canela", preco: 16.9, texto: "Espresso, leite vaporizado, com um toque de cacau e canela.", temp: "quente" },
    ],
    adicionais: [{ nome: "Borda de Nutella ou doce de leite", preco: 4.9 }],
  },
  {
    id: "da-casa",
    aba: "Da casa",
    origem: "Do balcão",
    titulo: "Bebidas da casa",
    texto: "As receitas que só tem aqui, quentes e geladas.",
    foto: { src: "/fotos/latte-gelado.jpg", alt: "Café gelado em camadas de leite e caramelo no copo canelado", pos: "50% 55%" },
    itens: [
      { nome: "Orange coffee", preco: 18.9, texto: "Xarope artesanal de laranja, leite gelado vaporizado e espresso. Um drink deliciosamente equilibrado.", temp: "gelado" },
      { nome: "Café caramelo", preco: 17.9, texto: "Leite vaporizado com uma dose de espresso e xarope de caramelo.", temp: "gelado" },
      { nome: "Leitinho da vovó", preco: 16.9, texto: "Infusão de leite cremoso, canela, melado de cana e açúcar mascavo, finalizado com espresso.", temp: "quente" },
      { nome: "Chocolate quente", preco: 19.9, texto: "Chocolate quente cremoso, feito com cacau 70%.", temp: "quente" },
      { nome: "Chocolate quente com chantilly", preco: 22.9, texto: "Chocolate quente cremoso, feito com cacau 70%, e chantilly.", temp: "quente" },
    ],
    adicionais: [
      { nome: "Trocar o leite por zero lactose", preco: 1.9 },
      { nome: "Trocar o leite por leite vegetal", preco: 4.9 },
    ],
  },
  {
    id: "gelados",
    aba: "Gelados",
    origem: "Do balcão",
    titulo: "Shakes e gelados",
    texto: "Pra dia quente, ou pra quem não abre mão de gelado.",
    foto: { src: "/fotos/bebida-chantilly-cacau.jpg", alt: "Shake com chantilly e cacau no copo canelado", pos: "50% 40%" },
    itens: [
      { nome: "Shake de Ovomaltine", preco: 22.9, texto: "Leite gelado cremoso batido com Ovomaltine, finalizado com chantilly e Ovomaltine.", temp: "gelado" },
      { nome: "Shake de chocolate branco", preco: 21.9, texto: "Leite gelado cremoso batido com leite condensado, finalizado com chantilly e raspas de chocolate branco.", temp: "gelado" },
      { nome: "Suco natural de laranja", preco: 15.9, temp: "gelado" },
      { nome: "Vem verão", preco: 16.9, texto: "Infusão de maracujá, gengibre e especiarias.", temp: "gelado" },
      { nome: "Água com ou sem gás", preco: 4.9, temp: "gelado" },
    ],
  },
  {
    id: "doces",
    aba: "Doces",
    origem: "Da confeitaria",
    titulo: "Doces",
    texto: "Waffle de Liège, brownie, bolo de vó e companhia.",
    foto: { src: "/fotos/waffle-calda-frutas-vermelhas.jpg", alt: "Calda de frutas vermelhas sendo derramada sobre o waffle de Liège", pos: "50% 50%" },
    itens: [
      { nome: "Waffle de Liège", preco: 23.9, texto: "Com um acompanhamento à escolha: doce de leite, geleia de frutas vermelhas ou Nutella." },
      { nome: "Iced waffle", preco: 28.9, texto: "Waffle com uma bola de sorvete e um acompanhamento: Nutella, doce de leite ou geleia de frutas vermelhas." },
      { nome: "Caramel slice", preco: 12.9, texto: "Camada de farofa de coco e caramelo, coberta com chocolate meio amargo." },
      { nome: "Brownie", preco: 14.9, texto: "Brownie cremoso com gotas de chocolate meio amargo." },
      { nome: "Iced brownie", preco: 21.9, texto: "Brownie com uma bola de sorvete." },
      { nome: "Iced brownie Nutella", preco: 25.9, texto: "Brownie com Nutella ou doce de leite e uma bola de sorvete." },
      { nome: "Cookie artesanal", preco: 14.9, texto: "Cookie artesanal com gotas de chocolate." },
      { nome: "Bolo de vó de laranja", preco: 9.9 },
    ],
    adicionais: [{ nome: "Geleia de frutas vermelhas no bolo", preco: 4.9 }],
  },
];

export const reais = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
