import { createClient } from "./supabase/server";

export interface Cor {
  id: string;
  nome: string;
}

export async function getCores(): Promise<Cor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cores")
    .select("id, nome")
    .order("nome");
  return data ?? [];
}
