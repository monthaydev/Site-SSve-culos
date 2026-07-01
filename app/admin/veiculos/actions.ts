"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { VeiculoSchema } from "@/lib/schemas";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function gerarSlug(marca: string, modelo: string, anoMod: number) {
  const base = `${marca}-${modelo}-${anoMod}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${Date.now().toString(36)}`;
}

function intOuNull(value: FormDataEntryValue | null): number | null {
  if (value == null || value === "") return null;
  const n = parseInt(value as string);
  return Number.isFinite(n) ? n : null;
}

// Lê disponibilidade + preços. Garante que o veículo não fique "órfão".
function parseDisponibilidade(formData: FormData) {
  let paraVenda = formData.get("para_venda") === "true";
  const paraLocacao = formData.get("para_locacao") === "true";
  if (!paraVenda && !paraLocacao) paraVenda = true;

  return {
    paraVenda,
    paraLocacao,
    preco: paraVenda ? intOuNull(formData.get("preco")) : null,
    precoDiaria: paraLocacao ? intOuNull(formData.get("preco_diaria")) : null,
    precoMensal: paraLocacao ? intOuNull(formData.get("preco_mensal")) : null,
  };
}

function parseVeiculoFormData(formData: FormData) {
  const opcionaisRaw = formData.get("opcionais") as string;
  const opcionais = opcionaisRaw
    ? opcionaisRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];
  const fotos = formData.getAll("fotos_urls") as string[];
  const disp = parseDisponibilidade(formData);

  return {
    marca:          formData.get("marca") as string,
    modelo:         formData.get("modelo") as string,
    versao:         formData.get("versao") as string,
    ano_fab:        parseInt(formData.get("ano_fab") as string),
    ano_mod:        parseInt(formData.get("ano_mod") as string),
    km:             parseInt(formData.get("km") as string) || 0,
    preco:          disp.preco,
    preco_anterior: formData.get("preco_anterior")
                      ? parseInt(formData.get("preco_anterior") as string)
                      : null,
    combustivel:    formData.get("combustivel") as string,
    cambio:         formData.get("cambio") as string,
    cor:            formData.get("cor") as string,
    portas:         parseInt(formData.get("portas") as string) || 0,
    categoria:      formData.get("categoria") as string,
    condicao:       formData.get("condicao") as string,
    badge:          (formData.get("badge") as string) || null,
    fotos,
    opcionais,
    descricao:      formData.get("descricao") as string,
    ativo:          formData.get("ativo") === "true",
    para_venda:     disp.paraVenda,
    para_locacao:   disp.paraLocacao,
    preco_diaria:   disp.precoDiaria,
    preco_mensal:   disp.precoMensal,
  };
}

export async function criarVeiculoAction(formData: FormData) {
  const supabase = await requireAuth();
  const parsed = VeiculoSchema.safeParse(parseVeiculoFormData(formData));
  if (!parsed.success) redirect("/admin/veiculos/novo?erro=validacao");
  const dados = parsed.data;

  const { error } = await supabase.from("veiculos").insert({
    slug: gerarSlug(dados.marca, dados.modelo, dados.ano_mod),
    ...dados,
  });

  if (error) redirect("/admin/veiculos?erro=criar");
  revalidatePath("/admin/veiculos");
  revalidatePath("/estoque");
  revalidatePath("/locadora");
  redirect("/admin/veiculos?ok=criado");
}

export async function editarVeiculoAction(id: string, formData: FormData) {
  const supabase = await requireAuth();
  const parsed = VeiculoSchema.safeParse(parseVeiculoFormData(formData));
  if (!parsed.success) redirect(`/admin/veiculos/${id}/editar?erro=validacao`);
  const dados = parsed.data;

  const { error } = await supabase
    .from("veiculos")
    .update(dados)
    .eq("id", id);

  if (error) redirect(`/admin/veiculos/${id}/editar?erro=salvar`);
  revalidatePath("/admin/veiculos");
  revalidatePath("/estoque");
  revalidatePath("/locadora");
  redirect("/admin/veiculos?ok=editado");
}

export async function excluirVeiculoAction(id: string) {
  const supabase = await requireAuth();

  const { data: v } = await supabase
    .from("veiculos")
    .select("fotos")
    .eq("id", id)
    .single();

  await supabase.from("veiculos").delete().eq("id", id);

  if (v?.fotos?.length) {
    const paths = (v.fotos as string[])
      .map((url: string) => {
        const match = url.match(/\/veiculos\/(.+)$/);
        return match?.[1] ?? null;
      })
      .filter((p): p is string => p !== null);
    if (paths.length) {
      await supabase.storage.from("veiculos").remove(paths);
    }
  }

  revalidatePath("/admin/veiculos");
  revalidatePath("/estoque");
  revalidatePath("/locadora");
  redirect("/admin/veiculos?ok=excluido");
}

export async function toggleAtivoAction(id: string, ativo: boolean) {
  const supabase = await requireAuth();
  const { error } = await supabase
    .from("veiculos")
    .update({ ativo: !ativo })
    .eq("id", id);
  if (error) return;
  revalidatePath("/admin/veiculos");
  revalidatePath("/estoque");
  revalidatePath("/locadora");
}
