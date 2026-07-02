export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const CONFIG = {
  whatsapp: {
    number: "5569999159972",
    display: "(69) 99915-9972",
  },
  phone: {
    href: "tel:+5569999159972",
    display: "(69) 99915-9972",
  },
  email: "ssveiculoscacoal@hotmail.com",
  address: "Av. Castelo Branco, 20644 — Novo Horizonte, Cacoal-RO",
  hours: {
    weekdays: "Seg–Sex: 8h às 18h",
    saturday: "Sábado: 8h às 12h",
  },
  social: {
    instagram: "https://www.instagram.com/ssveiculoscacoal/",
    instagramLocadora: "https://www.instagram.com/sslocadoracacoal/",
    facebook: "https://www.facebook.com/ssveiculoscacoal1",
  },
  maps: "https://www.google.com/maps/search/?api=1&query=SS+Ve%C3%ADculos+Av.+Castelo+Branco+20644+Cacoal+RO",
  dev: {
    name: "Prisma Agência",
    instagram: "https://www.instagram.com/prisma.mrktg/",
  },
} as const;

export function waLink(msg: string): string {
  return `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(msg)}`;
}

export const WA_DEFAULT = waLink(
  "Olá! Vi o site da SS Veículos e gostaria de mais informações."
);
