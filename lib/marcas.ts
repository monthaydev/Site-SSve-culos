import { createClient } from "./supabase/server";

export interface Marca {
  id: string;
  nome: string;
}

export async function getMarcas(): Promise<Marca[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("marcas")
    .select("id, nome")
    .order("nome");
  return data ?? [];
}
