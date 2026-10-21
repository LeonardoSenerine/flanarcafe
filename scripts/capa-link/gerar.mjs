// Gera a capa de link (app/opengraph-image.jpg) fotografando capa.html no Chromium.
// Precisa do Playwright com o Chromium instalado:
//   npm i -D playwright && npx playwright install chromium
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(import.meta.dirname, "..", "..");
const pagina = pathToFileURL(path.join(import.meta.dirname, "capa.html")).href;

const navegador = await chromium.launch();
const aba = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await aba.goto(pagina, { waitUntil: "networkidle" });
await aba.evaluate(() => document.fonts.ready);
await aba.screenshot({ path: path.join(root, "app", "opengraph-image.jpg"), type: "jpeg", quality: 88 });
await navegador.close();
console.log("app/opengraph-image.jpg 1200x630");
