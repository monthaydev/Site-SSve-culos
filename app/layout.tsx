import type { Metadata } from "next";
import { Bebas_Neue, Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Providers from "./providers";
import { CONFIG, SITE_URL } from "@/lib/config";

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
  metadataBase: new URL(SITE_URL),
  title: "SS Veículos — Há mais de 20 anos realizando sonhos | Cacoal-RO",
  description:
    "Encontre seu próximo veículo na SS Veículos. Carros, caminhões e utilitários em Cacoal-RO. Mais de 22 anos realizando sonhos.",
  keywords: "veículos, carros, seminovos, locadora, Cacoal, Rondônia, SS Veículos",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SS Veículos — Cacoal-RO",
    description: "Há mais de 22 anos realizando sonhos. Venda e locação de veículos.",
    url: SITE_URL,
    siteName: "SS Veículos",
    images: ["/logo-ss-veiculos-fundo.png"],
    locale: "pt_BR",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "SS Veículos",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-ss-veiculos.png`,
  image: `${SITE_URL}/logo-ss-veiculos-fundo.png`,
  telephone: CONFIG.phone.href.replace("tel:", ""),
  email: CONFIG.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Castelo Branco, 20644 — Novo Horizonte",
    addressLocality: "Cacoal",
    addressRegion: "RO",
    addressCountry: "BR",
  },
  openingHours: ["Mo-Fr 08:00-18:00", "Sa 08:00-12:00"],
  sameAs: [CONFIG.social.instagram, CONFIG.social.facebook],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
