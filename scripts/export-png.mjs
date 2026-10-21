// Exporta os SVGs do logo (public/marca) em PNG de alta resolução.
// Saída em assets/marca/png, fora do site publicado. Roda junto com: npm run logo
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const svgs = path.join(root, "public", "marca");
const out = path.join(root, "assets", "marca", "png");
mkdirSync(out, { recursive: true });

// [arquivo SVG, largura em px, nome de saída]
const exportar = [
  ["flanar-vertical-fundo-escuro.svg", 3000, "flanar-vertical-fundo-escuro"],
  ["flanar-vertical-fundo-claro.svg", 3000, "flanar-vertical-fundo-claro"],
  ["flanar-vertical-verde.svg", 3000, "flanar-vertical-verde"],
  ["flanar-horizontal-fundo-escuro.svg", 4000, "flanar-horizontal-fundo-escuro"],
  ["flanar-horizontal-fundo-claro.svg", 4000, "flanar-horizontal-fundo-claro"],
  ["flanar-simbolo-verde.svg", 2000, "flanar-simbolo-verde"],
  ["flanar-simbolo-laranja.svg", 2000, "flanar-simbolo-laranja"],
  ["flanar-simbolo-leite.svg", 2000, "flanar-simbolo-leite"],
  ["flanar-avatar.svg", 1080, "flanar-avatar-1080"],
  ["flanar-avatar.svg", 2160, "flanar-avatar-2160"],
];

async function rasterizar(svgPath, largura, destino) {
  const svg = readFileSync(svgPath);
  const viewBox = svg.toString().match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const larguraSvg = Number(viewBox[1]);
  // Renderiza já na densidade final para o contorno sair nítido, sem ampliar bitmap.
  const density = Math.min(72 * (largura / larguraSvg), 100000);
  const info = await sharp(svg, { density }).resize({ width: largura }).png({ compressionLevel: 9 }).toFile(destino);
  return info;
}

for (const [arquivo, largura, nome] of exportar) {
  const info = await rasterizar(path.join(svgs, arquivo), largura, path.join(out, `${nome}.png`));
  console.log(`${nome}.png`.padEnd(40), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
}

// Ícone para a tela inicial do iPhone (o Next usa app/apple-icon.png automaticamente).
const icone = await rasterizar(path.join(root, "app", "icon.svg"), 180, path.join(root, "app", "apple-icon.png"));
console.log("app/apple-icon.png".padEnd(40), `${icone.width}x${icone.height}`);
