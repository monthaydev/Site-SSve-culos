"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function soDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

export async function criarVendedorAction(formData: FormData) {
  const supabase = await requireAuth();
  const nome = (formData.get("nome") as string).trim();
  const whatsapp = soDigitos((formData.get("whatsapp") as string) ?? "");
  if (!nome || !whatsapp) return;
  await supabase.from("vendedores").insert({ nome, whatsapp });
  revalidatePath("/admin/vendedores");
  revalidatePath("/contato");
}

export async function excluirVendedorAction(id: string) {
  const supabase = await requireAuth();
  await supabase.from("vendedores").delete().eq("id", id);
  revalidatePath("/admin/vendedores");
  revalidatePath("/contato");
}

export async function editarVendedorAction(id: string, formData: FormData) {
  const supabase = await requireAuth();
  const nome = (formData.get("nome") as string).trim();
  const whatsapp = soDigitos((formData.get("whatsapp") as string) ?? "");
  if (!nome || !whatsapp) return;
  await supabase.from("vendedores").update({ nome, whatsapp }).eq("id", id);
  revalidatePath("/admin/vendedores");
  revalidatePath("/contato");
}

export async function alternarAtivoVendedorAction(id: string, ativo: boolean) {
  const supabase = await requireAuth();
  await supabase.from("vendedores").update({ ativo }).eq("id", id);
  revalidatePath("/admin/vendedores");
  revalidatePath("/contato");
}
