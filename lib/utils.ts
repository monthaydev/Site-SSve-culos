export function formatPreco(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKm(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value) + " km";
}

/** Resumo curto do(s) preço(s) de locação para cards (ex.: "R$ 250/dia"). */
export function resumoLocacao(diaria?: number, mensal?: number): string | null {
  if (diaria) return `${formatPreco(diaria)}/dia`;
  if (mensal) return `${formatPreco(mensal)}/mês`;
  return null;
}

/** Formata um número de WhatsApp salvo como dígitos (com DDI) para exibição. Ex.: "5569999528051" → "(69) 99952-8051". */
export function formatWhatsapp(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const local = digits.length > 11 ? digits.slice(-11) : digits;
  if (local.length !== 11) return raw;
  return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
}
