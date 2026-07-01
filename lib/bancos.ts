export interface Banco {
  nome: string;
  logo: string;
  /** Altura ideal do logo dentro do card (px) — equaliza o peso visual entre marcas. */
  logoH: number;
  desc: string;
}

export const BANCOS: Banco[] = [
  {
    nome: "BV Financeira",
    logo: "/bancos/bv.svg",
    logoH: 40,
    desc: "Um dos maiores bancos especializados em financiamento de veículos do Brasil. Trabalhamos com a BV para facilitar a realização do seu sonho.",
  },
  {
    nome: "Banco Bradesco",
    logo: "/bancos/bradesco.svg",
    logoH: 22,
    desc: "Tradição e solidez com condições especiais para financiamento de veículos novos e usados.",
  },
  {
    nome: "C6 Bank",
    logo: "/bancos/c6.svg",
    logoH: 22,
    desc: "Banco digital com análise de crédito simplificada e taxas diferenciadas para você.",
  },
];
