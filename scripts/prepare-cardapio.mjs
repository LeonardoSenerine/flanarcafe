// Recorta as fotos de produto das páginas do cardápio impresso da Flanar
// (assets/cardapio/*.png, 1414x2000, fundo branco) para usar no site.
// Rode com: npm run cardapio
import { mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const paginas = path.join(root, "assets", "cardapio");
const saida = path.join(root, "public", "cardapio");
mkdirSync(saida, { recursive: true });

// [nome, página, x, y, largura, altura]
const recortes = [
  // Café da manhã e salgados
  ["combo", 2, 0, 900, 1414, 990],
  ["ovos", 3, 0, 40, 560, 630],
  ["misto-quente", 3, 905, 575, 509, 575],
  ["queijo-quente", 3, 0, 965, 640, 600],
  ["pao-de-queijo", 3, 860, 1400, 554, 600],
  // Sanduíches
  ["sanduiches", 4, 0, 305, 1414, 300],
  // Métodos
  ["prensa", 6, 140, 440, 260, 400],
  ["v60", 6, 600, 450, 310, 395],
  ["metodo-aeropress", 6, 1022, 378, 186, 474],
  ["para-dois", 6, 322, 1566, 448, 284],
  // Bebidas
  ["orange-coffee", 7, 95, 95, 470, 590],
  ["cafe-caramelo", 7, 915, 425, 455, 600],
  ["leitinho", 7, 0, 860, 500, 600],
  ["chocolate-chantilly", 7, 900, 1255, 380, 745],
  ["espresso", 8, 0, 0, 575, 665],
  ["cappuccino-nutella", 8, 925, 545, 440, 660],
  ["shake-ovomaltine", 8, 135, 970, 340, 740],
  ["vem-verao", 8, 920, 1475, 405, 520],
  // Doces
  ["waffle", 5, 0, 1270, 1414, 730],
  ["caramel-slice", 9, 0, 190, 505, 355],
  ["iced-waffle", 9, 0, 545, 515, 470],
  ["bolo-de-vo", 9, 0, 1040, 565, 425],
];

// Ilustrações da capa (grãos desenhados sobre o verde), para o hero.
// Recortadas longe do "flanar café" impresso na capa.
const capa = [
  ["capa-topo", 1, 560, 0, 854, 600],
  ["capa-base", 1, 0, 1385, 800, 615],
];

for (const [nome, pag, left, top, width, height] of recortes) {
  await sharp(path.join(paginas, `${pag}.png`))
    .extract({ left, top, width, height })
    .webp({ quality: 86 })
    .toFile(path.join(saida, `${nome}.webp`));
  console.log(nome);
}

// Na capa, o verde de fundo vira transparente (chroma key), para os grãos
// poderem passar por cima do logo sem um retângulo verde junto.
const verde = [0x3b, 0x4c, 0x29];
for (const [nome, pag, left, top, width, height] of capa) {
  const { data, info } = await sharp(path.join(paginas, `${pag}.png`))
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const dist = Math.hypot(data[i] - verde[0], data[i + 1] - verde[1], data[i + 2] - verde[2]);
    data[i + 3] = Math.round(255 * Math.min(1, Math.max(0, (dist - 18) / 50)));
  }
  await sharp(data, { raw: info }).webp({ quality: 90, alphaQuality: 90 }).toFile(path.join(saida, `${nome}.webp`));
  console.log(nome, "(sem fundo)");
}
