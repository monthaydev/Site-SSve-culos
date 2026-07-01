export type BadgeStatus = "destaque" | "novo" | "oferta" | "reservado";

export interface Veiculo {
  id: string;
  slug: string;
  marca: string;
  modelo: string;
  versao: string;
  anoFab: number;
  anoMod: number;
  km: number;
  preco?: number;           // preço de venda (opcional: carro pode ser só de locação)
  precoAnterior?: number;
  paraVenda: boolean;       // aparece em /estoque
  paraLocacao: boolean;     // aparece em /locadora
  precoDiaria?: number;     // valor da diária (locação)
  precoMensal?: number;     // valor mensal (locação)
  combustivel: "Flex" | "Gasolina" | "Diesel" | "Elétrico" | "Híbrido";
  cambio: "Manual" | "Automático" | "CVT" | "Automatizado";
  cor: string;
  portas: number;
  categoria: "Carro" | "Caminhão" | "Utilitário" | "Van";
  condicao: "Novo" | "Seminovo" | "Usado";
  badge?: BadgeStatus;
  fotos: string[];
  opcionais: string[];
  descricao: string;
}
