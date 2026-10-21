// Gera o logo da Flanar em vetor: símbolo redesenhado a partir do logo
// original e o nome convertido em curvas (Tenor Sans).
// Saídas: public/marca/*.svg, app/icon.svg e lib/logo.ts. Rode com: npm run logo
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import opentype from "opentype.js";

const root = path.resolve(import.meta.dirname, "..");
const fontFile = path.join(root, "node_modules/@fontsource/tenor-sans/files/tenor-sans-latin-400-normal.woff");
const buf = readFileSync(fontFile);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

const cores = { verde: "#3a4c26", laranja: "#e3723f", leite: "#f7f2ea" };
const r = (n) => Math.round(n * 100) / 100;

// ---------- Símbolo ----------
// Grão inclinado 37°: elipse externa menos uma interna deslocada, o que
// deixa o traço grosso embaixo à esquerda e fino em cima à direita,
// como uma pincelada. O vinco é uma folha com a ponta fina no alto.
const giro = (37 * Math.PI) / 180;
const pivo = [255, 248];
const girar = ([x, y]) => {
  const dx = x - pivo[0];
  const dy = y - pivo[1];
  return [pivo[0] + dx * Math.cos(giro) - dy * Math.sin(giro), pivo[1] + dx * Math.sin(giro) + dy * Math.cos(giro)];
};

const externa = { c: [252, 252], rx: 198, ry: 254 };
const interna = { c: [272, 240], rx: 142, ry: 200 };

// Caixa do símbolo = caixa da elipse externa girada.
const [ecx, ecy] = girar(externa.c);
const meiaL = Math.hypot(externa.rx * Math.cos(giro), externa.ry * Math.sin(giro));
const meiaA = Math.hypot(externa.rx * Math.sin(giro), externa.ry * Math.cos(giro));
const sx0 = ecx - meiaL;
const sy0 = ecy - meiaA;
const simboloW = meiaL * 2;
const simboloH = meiaA * 2;

const vincoBruto = "M345 128C320 185 250 218 188 243C140 266 110 305 92 350L120 408C152 345 205 318 262 292C318 265 350 210 345 128Z";

// Desloca e escala o símbolo para começar em (x,y) com a altura pedida.
const moverPath = (d, dx, dy, s = 1) =>
  d.replace(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g, (_, x, y) => `${r((+x + dx) * s)} ${r((+y + dy) * s)}`);
// Arcos têm raios e flags que não são coordenadas, então o anel é refeito já deslocado.
function anelEm(dx, dy, s = 1) {
  const el = (c, rx, ry, sentido) => {
    const [cx, cy] = girar(c);
    const v = [ry * Math.sin(giro), -ry * Math.cos(giro)];
    const p = (x, y) => `${r((x + dx) * s)} ${r((y + dy) * s)}`;
    return `M${p(cx + v[0], cy + v[1])}A${r(rx * s)} ${r(ry * s)} 37 1 ${sentido} ${p(cx - v[0], cy - v[1])}A${r(rx * s)} ${r(ry * s)} 37 1 ${sentido} ${p(cx + v[0], cy + v[1])}Z`;
  };
  return el(externa.c, externa.rx, externa.ry, 0) + el(interna.c, interna.rx, interna.ry, 1);
}

function simbolo(x, y, altura) {
  const s = altura / simboloH;
  const dx = x / s - sx0;
  const dy = y / s - sy0;
  return { anel: anelEm(dx, dy, s), vinco: moverPath(vincoBruto, dx, dy, s), w: simboloW * s, h: altura };
}

// ---------- Texto em curvas ----------
function texto(str, x, baseline, size, tracking) {
  const p = font.getPath(str, x, baseline, size, { kerning: true, letterSpacing: tracking });
  const bb = p.getBoundingBox();
  // Serialização própria: o toPathData(2) do opentype.js v2 gera NaN em
  // algumas curvas, e o navegador para de desenhar no primeiro erro.
  const n = (v) => r(v).toString();
  const d = p.commands
    .map((c) => {
      if (c.type === "M" || c.type === "L") return `${c.type}${n(c.x)} ${n(c.y)}`;
      if (c.type === "Q") return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
      if (c.type === "C") return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
      return "Z";
    })
    .join("");
  return { d, bb };
}
function medir(str, size, tracking) {
  return texto(str, 0, 0, size, tracking).bb;
}

// ---------- Composições ----------
// A Tenor Sans só tem um peso e é mais leve que o nome no logo original;
// um contorno da mesma cor engrossa as hastes sem deformar as letras.
const PESO = 0.022;
function vertical() {
  const F = 200;
  const tF = 0;
  const bF = medir("flanar", F, tF);
  const wF = bF.x2 - bF.x1;
  const tC = 0.06;
  const bC100 = medir("café", 100, tC);
  const C = (100 * 0.3 * wF) / (bC100.x2 - bC100.x1);
  const bC = medir("café", C, tC);

  const P = 0.12 * wF;
  const simH = 0.44 * wF;
  const g1 = 0.1 * wF;
  const g2 = 0.075 * wF;
  const largura = wF + 2 * P;

  const simX = (largura - simH * (simboloW / simboloH)) / 2 + 0.015 * wF; // compensação ótica da inclinação
  const s = simbolo(simX, P, simH);

  const topoF = P + simH + g1;
  const baseF = topoF - bF.y1;
  const xF = P - bF.x1;
  const fl = texto("flanar", xF, baseF, F, tF);

  const topoC = baseF + g2;
  const baseC = topoC - bC.y1;
  const xC = (largura - (bC.x2 - bC.x1)) / 2 - bC.x1;
  const ca = texto("café", xC, baseC, C, tC);

  const altura = baseC + bC.y2 + P;
  return { w: r(largura), h: r(altura), simbolo: s, flanar: fl.d, cafe: ca.d, pesoF: r(F * PESO), pesoC: r(C * PESO) };
}

function horizontal() {
  const F = 200;
  const tF = 0;
  const bF = medir("flanar", F, tF);
  const wF = bF.x2 - bF.x1;
  const hF = bF.y2 - bF.y1;
  const tC = 0.06;
  const bC100 = medir("café", 100, tC);
  const C = (100 * 0.3 * wF) / (bC100.x2 - bC100.x1);
  const bC = medir("café", C, tC);
  const hC = bC.y2 - bC.y1;

  const P = 0.06 * wF;
  const g2 = 0.06 * wF;
  const bloco = hF + g2 + hC;
  const simH = bloco * 1.12;
  const s = simbolo(P, P, simH);
  const gap = 0.07 * wF;

  const xTexto = P + s.w + gap;
  const topoBloco = P + (simH - bloco) / 2;
  const baseF = topoBloco - bF.y1;
  const fl = texto("flanar", xTexto - bF.x1, baseF, F, tF);
  const baseC = baseF + g2 - bC.y1;
  const ca = texto("café", xTexto - bC.x1 + 0.01 * wF, baseC, C, tC);

  return { w: r(xTexto + wF + P), h: r(simH + 2 * P), simbolo: s, flanar: fl.d, cafe: ca.d, pesoF: r(F * PESO), pesoC: r(C * PESO) };
}

// ---------- Saída ----------
function svg({ w, h, simbolo: s, flanar, cafe, pesoF, pesoC }, cor, fundo) {
  const bg = fundo ? `<rect width="${w}" height="${h}" fill="${fundo}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Flanar Café">${bg}
<path fill="${cor.simbolo}" fill-rule="evenodd" d="${s.anel}"/>
<path fill="${cor.simbolo}" d="${s.vinco}"/>
<path fill="${cor.flanar}" stroke="${cor.flanar}" stroke-width="${pesoF}" stroke-linejoin="round" d="${flanar}"/>
<path fill="${cor.cafe}" stroke="${cor.cafe}" stroke-width="${pesoC}" stroke-linejoin="round" d="${cafe}"/>
</svg>
`;
}

const escuro = { simbolo: cores.leite, flanar: cores.laranja, cafe: cores.leite };
const claro = { simbolo: cores.verde, flanar: cores.laranja, cafe: cores.verde };

const V = vertical();
const H = horizontal();
const S = simbolo(0, 0, 100);

// Só o nome "flanar", para usar como palavra dentro de títulos do site.
function wordmark() {
  const F = 200;
  const peso = F * PESO;
  const bb = medir("flanar", F, 0);
  const m = peso / 2;
  const t = texto("flanar", m - bb.x1, m - bb.y1, F, 0);
  return { w: r(bb.x2 - bb.x1 + peso), h: r(bb.y2 - bb.y1 + peso), d: t.d, peso: r(peso) };
}
const W = wordmark();

const out = path.join(root, "public", "marca");
mkdirSync(out, { recursive: true });
writeFileSync(path.join(out, "flanar-vertical-fundo-escuro.svg"), svg(V, escuro));
writeFileSync(path.join(out, "flanar-vertical-fundo-claro.svg"), svg(V, claro));
writeFileSync(path.join(out, "flanar-horizontal-fundo-escuro.svg"), svg(H, escuro));
writeFileSync(path.join(out, "flanar-horizontal-fundo-claro.svg"), svg(H, claro));
writeFileSync(path.join(out, "flanar-vertical-verde.svg"), svg(V, escuro, cores.verde));

const simboloSvg = (cor) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(S.w)} 100" role="img" aria-label="Flanar Café">
<path fill="${cor}" fill-rule="evenodd" d="${S.anel}"/>
<path fill="${cor}" d="${S.vinco}"/>
</svg>
`;
writeFileSync(path.join(out, "flanar-simbolo-verde.svg"), simboloSvg(cores.verde));
writeFileSync(path.join(out, "flanar-simbolo-laranja.svg"), simboloSvg(cores.laranja));
writeFileSync(path.join(out, "flanar-simbolo-leite.svg"), simboloSvg(cores.leite));

// Avatar quadrado (Instagram, WhatsApp): logo vertical sobre o verde.
{
  const lado = 1080;
  const escala = (lado * 0.66) / Math.max(V.w, V.h);
  const tx = (lado - V.w * escala) / 2;
  const ty = (lado - V.h * escala) / 2;
  writeFileSync(
    path.join(out, "flanar-avatar.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" role="img" aria-label="Flanar Café">
<rect width="${lado}" height="${lado}" fill="${cores.verde}"/>
<g transform="translate(${r(tx)} ${r(ty)}) scale(${r(escala * 1000) / 1000})">
<path fill="${escuro.simbolo}" fill-rule="evenodd" d="${V.simbolo.anel}"/>
<path fill="${escuro.simbolo}" d="${V.simbolo.vinco}"/>
<path fill="${escuro.flanar}" stroke="${escuro.flanar}" stroke-width="${V.pesoF}" stroke-linejoin="round" d="${V.flanar}"/>
<path fill="${escuro.cafe}" stroke="${escuro.cafe}" stroke-width="${V.pesoC}" stroke-linejoin="round" d="${V.cafe}"/>
</g>
</svg>
`,
  );
}

// Favicon: símbolo claro num quadrado verde arredondado.
{
  const s = simbolo(0, 0, 70);
  const ox = r((100 - s.w) / 2);
  writeFileSync(
    path.join(root, "app", "icon.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" rx="22" fill="${cores.verde}"/>
<g transform="translate(${ox} 15)">
<path fill="${cores.leite}" fill-rule="evenodd" d="${s.anel}"/>
<path fill="${cores.leite}" d="${s.vinco}"/>
</g>
</svg>
`,
  );
}

const ts = (o) => JSON.stringify(o, null, 2);
writeFileSync(
  path.join(root, "lib", "logo.ts"),
  `// Gerado por scripts/build-logo.mjs. Não edite à mão: rode npm run logo.
export const simbolo = ${ts({ w: r(S.w), h: 100, anel: S.anel, vinco: S.vinco })};

export const logoHorizontal = ${ts({ w: H.w, h: H.h, anel: H.simbolo.anel, vinco: H.simbolo.vinco, flanar: H.flanar, cafe: H.cafe, pesoF: H.pesoF, pesoC: H.pesoC })};

export const logoVertical = ${ts({ w: V.w, h: V.h, anel: V.simbolo.anel, vinco: V.simbolo.vinco, flanar: V.flanar, cafe: V.cafe, pesoF: V.pesoF, pesoC: V.pesoC })};

export const wordmark = ${ts(W)};
`,
);

console.log("vertical", V.w, "x", V.h, "| horizontal", H.w, "x", H.h, "| símbolo", r(S.w), "x 100");
