import type { Metadata } from "next";
import { Bebas_Neue, Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Providers from "./providers";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "SS Veículos — Há mais de 20 anos realizando sonhos | Cacoal-RO",
  description:
    "Encontre seu próximo veículo na SS Veículos. Carros, caminhões e utilitários em Cacoal-RO. Mais de 22 anos realizando sonhos.",
  keywords: "veículos, carros, seminovos, locadora, Cacoal, Rondônia, SS Veículos",
  openGraph: {
    title: "SS Veículos — Cacoal-RO",
    description: "Há mais de 22 anos realizando sonhos. Venda e locação de veículos.",
    images: ["/logo-ss-veiculos-fundo.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${bebasNeue.variable} ${barlowCondensed.variable} ${barlow.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-c-bg text-c-text">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
