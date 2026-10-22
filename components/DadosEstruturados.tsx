import { contato, mapsUrl, site } from "@/lib/content";

// Dados da cafeteria no formato schema.org, para o Google mostrar endereço,
// horários e Instagram na busca e no Maps.
const dias = [
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  ["Saturday"],
  ["Sunday"],
];
const hora = (h: string) => h.replace(/(\d+)h/, (_, n: string) => `${n.padStart(2, "0")}:00`);

const dados = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: site.nome,
  description: site.descricao,
  url: site.url,
  image: [`${site.url}/fotos/fachada.jpg`, `${site.url}/fotos/salao-cappuccino-cookie.jpg`, `${site.url}/opengraph-image.jpg`],
  logo: `${site.url}/marca/flanar-avatar.svg`,
  menu: `${site.url}/#cardapio`,
  servesCuisine: ["Café especial", "Café da manhã", "Sanduíches", "Doces"],
  address: {
    "@type": "PostalAddress",
    streetAddress: contato.endereco,
    addressLocality: "Itatiba",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  hasMap: mapsUrl,
  openingHoursSpecification: contato.horarios.map((h, i) => {
    const [abre, fecha] = h.horas.split(" às ").map(hora);
    return { "@type": "OpeningHoursSpecification", dayOfWeek: dias[i], opens: abre, closes: fecha };
  }),
  sameAs: [contato.instagram, contato.links],
};

export function DadosEstruturados() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }} />;
}
