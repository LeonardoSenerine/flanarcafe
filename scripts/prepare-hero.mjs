// Monta a foto do hero a partir do Orange coffee (assets/fotos, 1440x1920, vertical).
// O fundo da foto é só parede e mesa desfocadas, então as laterais são estendidas
// esticando a primeira e a última coluna e desfocando: vira uma foto horizontal
// com o copo à direita e espaço livre na parede para o título. Para o celular, o
// mesmo truque em cima e embaixo deixa o copo menor e mais baixo. Rode com: npm run hero
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "assets", "fotos", "10-drink-laranja-camadas.jpg");
const out = path.join(root, "public", "media", "hero-cafe.jpg");
const outVertical = path.join(root, "public", "media", "hero-cafe-vertical.jpg");

const W = 3200;
const H = 1920;
const PW = 1440;
// Centro do copo em ~68% da largura (o site usa object-position 68% no celular).
const esquerda = Math.round(0.68 * W - PW / 2);
const direita = W - esquerda - PW;
// Largura da emenda, onde a foto some aos poucos sobre a extensão.
const emenda = 220;

const extensao = async (x, largura) => {
  const coluna = await sharp(src).extract({ left: x, top: 0, width: 16, height: H }).toBuffer();
  return sharp(coluna).resize(largura, H, { fit: "fill" }).blur(24).toBuffer();
};

const mascara = Buffer.from(
  `<svg width="${PW}" height="${H}"><defs><linearGradient id="g" x1="0" x2="1">` +
    `<stop offset="0" stop-color="white" stop-opacity="0"/>` +
    `<stop offset="${emenda / PW}" stop-color="white"/>` +
    `<stop offset="${1 - emenda / PW}" stop-color="white"/>` +
    `<stop offset="1" stop-color="white" stop-opacity="0"/>` +
    `</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
);
const foto = await sharp(src).ensureAlpha().composite([{ input: mascara, blend: "dest-in" }]).png().toBuffer();

await sharp({ create: { width: W, height: H, channels: 3, background: "#888" } })
  .composite([
    { input: await extensao(0, esquerda + emenda), left: 0, top: 0 },
    { input: await extensao(PW - 16, direita + emenda), left: esquerda + PW - emenda, top: 0 },
    { input: foto, left: esquerda, top: 0 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(out);
console.log("hero-cafe", `${W}x${H}`);

// Versão vertical: parede esticada para cima e mesa para baixo.
const VH = 3000;
const topo = 700;
const base = VH - topo - H;
const faixaV = async (y, altura) => {
  const linha = await sharp(src).extract({ left: 0, top: y, width: PW, height: 16 }).toBuffer();
  return sharp(linha).resize(PW, altura, { fit: "fill" }).blur(24).toBuffer();
};
const mascaraV = Buffer.from(
  `<svg width="${PW}" height="${H}"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1">` +
    `<stop offset="0" stop-color="white" stop-opacity="0"/>` +
    `<stop offset="${emenda / H}" stop-color="white"/>` +
    `<stop offset="${1 - emenda / H}" stop-color="white"/>` +
    `<stop offset="1" stop-color="white" stop-opacity="0"/>` +
    `</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
);
const fotoV = await sharp(src).ensureAlpha().composite([{ input: mascaraV, blend: "dest-in" }]).png().toBuffer();
await sharp({ create: { width: PW, height: VH, channels: 3, background: "#888" } })
  .composite([
    { input: await faixaV(0, topo + emenda), left: 0, top: 0 },
    { input: await faixaV(H - 16, base + emenda), left: 0, top: topo + H - emenda },
    { input: fotoV, left: 0, top: topo },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(outVertical);
console.log("hero-cafe-vertical", `${PW}x${VH}`);
