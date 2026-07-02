import type { MetadataRoute } from "next";
import { getTodosVeiculos, getVeiculosLocacao } from "@/lib/veiculos";
import { SITE_URL } from "@/lib/config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paginasEstaticas: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/estoque`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/locadora`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/servicos`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/financiamento`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contato`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [veiculosVenda, veiculosLocacao] = await Promise.all([
    getTodosVeiculos(),
    getVeiculosLocacao(),
  ]);

  const paginasEstoque: MetadataRoute.Sitemap = veiculosVenda.map((v) => ({
    url: `${SITE_URL}/estoque/${v.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const paginasLocadora: MetadataRoute.Sitemap = veiculosLocacao.map((v) => ({
    url: `${SITE_URL}/locadora/${v.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...paginasEstaticas, ...paginasEstoque, ...paginasLocadora];
}
