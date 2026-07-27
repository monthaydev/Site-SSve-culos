import type { Veiculo } from "@/lib/types";
import { CONFIG, SITE_URL } from "@/lib/config";

// Termos gerais do negócio para a tag <meta name="keywords">.
// O Google não usa essa tag para ranquear desde 2009 — quem realmente ajuda
// no ranqueamento é o JSON-LD (buildVeiculoJsonLd) e o texto real das páginas.
// Mantida mesmo assim por não ter custo e por compatibilidade com outros buscadores.
export const BASE_KEYWORDS = [
  // marca / negócio
  "SS Veículos", "SS Veículos Cacoal", "SS Locadora Cacoal", "revenda de veículos Cacoal",
  "concessionária Cacoal RO", "loja de carros Cacoal", "loja de veículos Rondônia",
  "melhor loja de carros Cacoal", "SS Veículos Rondônia", "revenda 22 anos Cacoal",
  "Av Castelo Branco Cacoal carros", "loja de automóveis Novo Horizonte Cacoal",

  // compra e venda
  "comprar carro em Cacoal", "comprar carro em Rondônia", "vender carro em Cacoal",
  "avaliação de veículo para troca", "troca de carro Cacoal", "carro na troca Cacoal",
  "carros seminovos Cacoal", "carros usados Cacoal RO", "carros novos Cacoal",
  "veículos seminovos Rondônia", "veículos usados Rondônia", "veículos novos Rondônia",
  "carro com garantia Cacoal", "carro revisado Cacoal", "carro com procedência Cacoal",

  // locação
  "aluguel de carros Cacoal", "locação de veículos Cacoal", "locação de veículos Rondônia",
  "aluguel de carro diária Cacoal", "aluguel de carro mensal Cacoal", "carro para alugar Cacoal",

  // financiamento e serviços
  "financiamento de veículos Cacoal", "financiamento de carros Rondônia", "financiamento BV",
  "financiamento Bradesco", "financiamento C6 Bank", "simulação de financiamento de carro",
  "despachante veicular Cacoal", "transferência de veículo Cacoal", "documentação de veículo Cacoal",

  // categorias
  "carro seminovo", "carro usado", "carro novo", "carro flex", "carro automático",
  "carro manual", "carro CVT", "carro diesel", "carro a gasolina", "carro elétrico",
  "carro híbrido", "caminhão usado", "caminhão seminovo", "utilitário usado",
  "van para locação", "van seminova", "pickup usada", "picape seminova", "SUV seminovo",
  "hatch seminovo", "sedan seminovo",

  // marcas comuns no estoque
  "Volkswagen seminovo", "Chevrolet seminovo", "Fiat seminovo", "Ford seminovo",
  "Toyota seminovo", "Honda seminovo", "Hyundai seminovo", "Renault seminovo",
  "Nissan seminovo", "Jeep seminovo", "Peugeot seminovo", "Citroën seminovo",
  "Mitsubishi seminovo", "Kia seminovo", "BYD seminovo", "Mercedes-Benz seminovo",
  "RAM seminovo", "Iveco seminovo",

  // localização
  "Cacoal", "Cacoal RO", "Rondônia", "Novo Horizonte Cacoal", "carros em Rondônia",
  "revenda Rondônia", "concessionária RO", "loja de carros interior de Rondônia",
  "carros região de Cacoal", "veículos zona da mata rondoniense",

  // cauda longa
  "carro seminovo Cacoal RO", "carro usado com baixa km Cacoal",
  "melhores carros seminovos Rondônia", "financiamento facilitado de carro Cacoal",
  "entrada facilitada carro seminovo", "carro para família Cacoal",
  "carro econômico seminovo Cacoal", "picape a diesel seminova",
  "van de carga seminova", "caminhão truck seminovo",
] as const;

export function veiculoKeywords(v: Veiculo): string[] {
  return [
    `${v.marca} ${v.modelo}`,
    `${v.marca} ${v.modelo} ${v.versao}`,
    `${v.marca} ${v.modelo} ${v.anoMod}`,
    `${v.marca} ${v.modelo} Cacoal`,
    `${v.marca} seminovo`,
    `${v.condicao} ${v.marca} ${v.modelo}`,
    `${v.categoria} ${v.combustivel}`,
    `${v.marca} ${v.modelo} ${v.cambio}`,
    `${v.marca} ${v.modelo} ${v.cor}`,
    "SS Veículos",
    "Cacoal RO",
    "Rondônia",
  ];
}

// Dados estruturados (schema.org) por veículo — o que o Google efetivamente
// usa para elegibilidade a rich results e para entender o conteúdo da página.
export function buildVeiculoJsonLd(v: Veiculo, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${v.marca} ${v.modelo} ${v.versao}`,
    brand: v.marca,
    model: v.modelo,
    vehicleModelDate: String(v.anoMod),
    productionDate: String(v.anoFab),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: v.km,
      unitCode: "KMT",
    },
    fuelType: v.combustivel,
    vehicleTransmission: v.cambio,
    color: v.cor,
    numberOfDoors: v.portas > 0 ? v.portas : undefined,
    vehicleConfiguration: v.categoria,
    itemCondition:
      v.condicao === "Novo"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    image: v.fotos,
    description: v.descricao || undefined,
    url: `${SITE_URL}${path}`,
    offers: v.preco != null
      ? {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: v.preco,
          availability: v.badge === "reservado"
            ? "https://schema.org/Reserved"
            : "https://schema.org/InStock",
          url: `${SITE_URL}${path}`,
          seller: {
            "@type": "AutoDealer",
            name: "SS Veículos",
            telephone: CONFIG.phone.href.replace("tel:", ""),
          },
        }
      : undefined,
  };
}
