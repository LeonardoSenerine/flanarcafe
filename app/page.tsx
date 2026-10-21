import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Faixas } from "@/components/Faixas";
import { Sobre } from "@/components/Sobre";
import { Processo } from "@/components/Processo";
import { Cardapio } from "@/components/Cardapio";
import { Galeria } from "@/components/Galeria";
import { ComoChegar } from "@/components/ComoChegar";
import { Rodape } from "@/components/Rodape";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Faixas />
        <Sobre />
        <Processo />
        <Cardapio />
        <Galeria />
        <ComoChegar />
      </main>
      <Rodape />
    </>
  );
}
