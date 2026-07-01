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

export async function criarCorAction(formData: FormData) {
  const supabase = await requireAuth();
  const nome = (formData.get("nome") as string).trim();
  if (!nome) return;
  await supabase.from("cores").insert({ nome });
  revalidatePath("/admin/cores");
}

export async function excluirCorAction(id: string) {
  const supabase = await requireAuth();
  await supabase.from("cores").delete().eq("id", id);
  revalidatePath("/admin/cores");
}

export async function editarCorAction(id: string, formData: FormData) {
  const supabase = await requireAuth();
  const nome = (formData.get("nome") as string).trim();
  if (!nome) return;
  await supabase.from("cores").update({ nome }).eq("id", id);
  revalidatePath("/admin/cores");
}
