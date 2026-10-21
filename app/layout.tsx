import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flanar Café",
  description: "Café especial, focaccia artesanal, waffle de Liège e um salão verde pra ficar sem pressa. Vem viver seu momento flanar.",
};

export const viewport: Viewport = {
  themeColor: "#3a4c26",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${instrument.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
