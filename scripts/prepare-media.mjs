// Gera os recortes de vídeo e as fotos otimizadas usados pelo site.
// Os reels originais (assets/videos) têm legendas embutidas, então cada clipe
// é recortado num trecho e numa área sem texto. Rode com: npm run media
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const root = path.resolve(import.meta.dirname, "..");
const videosIn = path.join(root, "assets", "videos");
const photosIn = path.join(root, "assets", "fotos");
const mediaOut = path.join(root, "public", "media");
const photosOut = path.join(root, "public", "fotos");
mkdirSync(mediaOut, { recursive: true });
mkdirSync(photosOut, { recursive: true });

// Fonte: 720x1280. crop = [largura, altura, x, y]
const clips = [
  // Hero: 3:4, na resolução original e com qualidade alta, porque é o
  // primeiro vídeo que aparece e ocupa quase meia tela.
  { name: "hero-leite", src: "05", start: 0, dur: 4, crop: [720, 960, 0, 320], width: 720, crf: 20 },
  { name: "hero-waffle", src: "01", start: 20.2, dur: 3.6, crop: [720, 960, 0, 260], crf: 21 },
  { name: "coar", src: "08", start: 24.35, dur: 0.9, crop: [720, 880, 0, 0], slow: 2.5 },
  { name: "camadas", src: "05", start: 12, dur: 5, crop: [720, 900, 0, 380] },
  { name: "prensar", src: "04", start: 25.05, dur: 1.6, crop: [720, 880, 0, 0], slow: 1.6 },
  { name: "macarico", src: "04", start: 21, dur: 3, crop: [720, 880, 0, 0] },
  { name: "doce-de-leite", src: "03", start: 16, dur: 4, crop: [720, 860, 0, 0] },
];

// Fotos de pessoas: o "at" é o quadro mais nítido de cada trecho (medido pela
// variância do laplaciano), e "melhorar" tira ruído e realça um pouco.
const stills = [
  { name: "salao", src: "09", at: 1.4, crop: [720, 1000, 0, 0], melhorar: true },
  { name: "bandeja", src: "08", at: 10.4, crop: [720, 960, 0, 80], melhorar: true },
  { name: "janela", src: "08", at: 28.5, crop: [720, 720, 0, 0], melhorar: true },
  { name: "bolo-da-vovo", src: "03", at: 29, crop: [720, 900, 0, 0] },
  { name: "cookie", src: "03", at: 32, crop: [720, 900, 0, 0] },
  { name: "tuna-melt", src: "04", at: 17, crop: [720, 900, 0, 0] },
];

function run(args) {
  const r = spawnSync(ffmpeg, ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg falhou: ${args.join(" ")}`);
}

for (const c of clips) {
  const src = path.join(videosIn, `video-${c.src}.mp4`);
  const [w, h, x, y] = c.crop;
  const scale = `scale=${c.width ?? 540}:-2`;
  const filters = [`crop=${w}:${h}:${x}:${y}`, scale];
  if (c.slow) filters.push(`setpts=${c.slow}*PTS`);
  const vf = filters.join(",");
  run(["-ss", String(c.start), "-t", String(c.dur), "-i", src, "-vf", vf, "-an",
    "-c:v", "libx264", "-preset", "slow", "-crf", String(c.crf ?? 26), "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", path.join(mediaOut, `${c.name}.mp4`)]);
  run(["-ss", String(c.start), "-i", src, "-frames:v", "1", "-vf", `crop=${w}:${h}:${x}:${y},${scale}`,
    "-q:v", "4", path.join(mediaOut, `${c.name}.jpg`)]);
  console.log("clipe", c.name);
}

for (const s of stills) {
  const [w, h, x, y] = s.crop;
  const filtros = [`crop=${w}:${h}:${x}:${y}`];
  if (s.melhorar) filtros.push("hqdn3d=1.5:1.5:3:3", "unsharp=5:5:0.7:5:5:0");
  run(["-ss", String(s.at), "-i", path.join(videosIn, `video-${s.src}.mp4`), "-frames:v", "1",
    "-vf", filtros.join(","), "-q:v", s.melhorar ? "2" : "3", path.join(mediaOut, `${s.name}.jpg`)]);
  console.log("still", s.name);
}

for (const f of readdirSync(photosIn).filter((f) => f.endsWith(".jpg"))) {
  copyFileSync(path.join(photosIn, f), path.join(photosOut, f.replace(/^\d+-/, "")));
}
console.log("fotos copiadas");
