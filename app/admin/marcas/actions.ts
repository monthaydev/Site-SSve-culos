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

export async function criarMarcaAction(formData: FormData) {
  const supabase = await requireAuth();
  const nome = (formData.get("nome") as string).trim();
  if (!nome) return;
  await supabase.from("marcas").insert({ nome });
  revalidatePath("/admin/marcas");
}

export async function excluirMarcaAction(id: string) {
  const supabase = await requireAuth();
  await supabase.from("marcas").delete().eq("id", id);
  revalidatePath("/admin/marcas");
}

export async function editarMarcaAction(id: string, formData: FormData) {
  const supabase = await requireAuth();
  const nome = (formData.get("nome") as string).trim();
  if (!nome) return;
  await supabase.from("marcas").update({ nome }).eq("id", id);
  revalidatePath("/admin/marcas");
}
