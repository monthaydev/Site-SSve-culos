"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { X, Upload, Loader2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

async function converterSeHeic(file: File): Promise<File> {
  const ehHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.hei[cf]$/i.test(file.name);
  if (!ehHeic) return file;

  const heic2any = (await import("heic2any")).default;
  const resultado = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.85 });
  const blob = Array.isArray(resultado) ? resultado[0] : resultado;
  const nomeConvertido = file.name.replace(/\.hei[cf]$/i, ".jpg");
  return new File([blob], nomeConvertido, { type: "image/jpeg" });
}

interface VeiculoFormData {
  marca?: string;
  modelo?: string;
  versao?: string;
  ano_fab?: number;
  ano_mod?: number;
  km?: number;
  preco?: number;
  preco_anterior?: number | null;
  combustivel?: string;
  cambio?: string;
  cor?: string;
  portas?: number;
  categoria?: string;
  condicao?: string;
  badge?: string | null;
  fotos?: string[];
  opcionais?: string[];
  descricao?: string;
  ativo?: boolean;
  para_venda?: boolean;
  para_locacao?: boolean;
  preco_diaria?: number | null;
  preco_mensal?: number | null;
}

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: VeiculoFormData;
  submitLabel?: string;
  marcas?: { id: string; nome: string }[];
  cores?: { id: string; nome: string }[];
}

const COMBUSTIVEIS = ["Flex", "Gasolina", "Diesel", "Elétrico", "Híbrido"];
const CAMBIOS = ["Manual", "Automático", "CVT", "Automatizado"];
const CATEGORIAS = ["Carro", "Caminhão", "Utilitário", "Van"];
const CONDICOES = ["Novo", "Seminovo", "Usado"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-c-text3 text-xs uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "bg-c-bg border border-c-border rounded-lg text-c-text px-3 py-2.5 text-sm outline-none focus:border-brand-red transition-colors placeholder:text-c-text4 w-full";

const selectCls =
  "bg-c-bg border border-c-border rounded-lg text-c-text px-3 py-2.5 text-sm outline-none focus:border-brand-red transition-colors w-full";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex items-center gap-2 font-bold uppercase tracking-widest text-sm px-8 py-3 rounded-lg transition-colors ${
        pending
          ? "bg-c-border3 text-c-text3 cursor-not-allowed"
          : "bg-brand-red hover:bg-brand-red-hover text-white"
      }`}
    >
      {pending ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          Salvando...
        </>
      ) : (
        label
      )}
    </button>
  );
}

export default function VeiculoForm({
  action,
  defaultValues = {},
  submitLabel = "Salvar",
  marcas = [],
  cores = [],
}: Props) {
  const [fotos, setFotos] = useState<string[]>(defaultValues.fotos ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadErro, setUploadErro] = useState("");
  const [paraVenda, setParaVenda] = useState(defaultValues.para_venda !== false);
  const [paraLocacao, setParaLocacao] = useState(
    defaultValues.para_locacao === true
  );

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivosOriginais = Array.from(e.target.files ?? []);
    if (arquivosOriginais.length === 0) return;

    const MAX_FOTOS = 20;
    const MAX_SIZE_MB = 5;

    if (fotos.length + arquivosOriginais.length > MAX_FOTOS) {
      setUploadErro(`Limite de ${MAX_FOTOS} fotos por veículo.`);
      (e.target as HTMLInputElement).value = "";
      return;
    }

    setUploading(true);
    setUploadErro("");

    let files: File[];
    try {
      files = await Promise.all(arquivosOriginais.map(converterSeHeic));
    } catch {
      setUploadErro("Não foi possível converter uma das fotos HEIC. Tente exportá-la como JPG.");
      setUploading(false);
      (e.target as HTMLInputElement).value = "";
      return;
    }

    const arquivosInvalidos = files.filter(
      (f) => !f.type.startsWith("image/") || f.size > MAX_SIZE_MB * 1024 * 1024
    );
    if (arquivosInvalidos.length > 0) {
      setUploadErro(
        `Arquivo inválido: apenas imagens até ${MAX_SIZE_MB}MB são aceitas.`
      );
      setUploading(false);
      (e.target as HTMLInputElement).value = "";
      return;
    }

    const supabase = createClient();
    const novasUrls: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("veiculos").upload(path, file);
      if (error) {
        setUploadErro(`Erro ao enviar ${file.name}: ${error.message}`);
      } else {
        const { data } = supabase.storage.from("veiculos").getPublicUrl(path);
        novasUrls.push(data.publicUrl);
      }
    }

    setFotos((prev) => [...prev, ...novasUrls]);
    setUploading(false);
    (e.target as HTMLInputElement).value = "";
  }

  function removerFoto(url: string) {
    setFotos((prev) => prev.filter((f) => f !== url));
  }

  function definirPrincipal(url: string) {
    setFotos((prev) => [url, ...prev.filter((f) => f !== url)]);
  }

  return (
    <form action={action} className="flex flex-col gap-6 max-w-3xl">
      {fotos.map((url) => (
        <input key={url} type="hidden" name="fotos_urls" value={url} />
      ))}

      <section className="bg-c-surface rounded-xl shadow-card p-5">
        <h2 className="text-c-text font-bold uppercase tracking-wide text-xs mb-4 pb-3 border-b border-c-border">
          Identificação
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Marca *">
            {marcas.length > 0 ? (
              <select
                name="marca"
                required
                defaultValue={defaultValues.marca ?? ""}
                className={selectCls}
              >
                <option value="" disabled>Selecione…</option>
                {marcas.map((m) => (
                  <option key={m.id} value={m.nome}>{m.nome}</option>
                ))}
              </select>
            ) : (
              <input
                name="marca"
                required
                defaultValue={defaultValues.marca}
                className={inputCls}
                placeholder="Honda"
              />
            )}
          </Field>
          <Field label="Modelo *">
            <input
              name="modelo"
              required
              defaultValue={defaultValues.modelo}
              className={inputCls}
              placeholder="HR-V"
            />
          </Field>
          <Field label="Versão *">
            <input
              name="versao"
              required
              defaultValue={defaultValues.versao}
              className={inputCls}
              placeholder="EXL 1.5 CVT"
            />
          </Field>
          <Field label="Ano Fabricação *">
            <input
              name="ano_fab"
              type="number"
              required
              defaultValue={defaultValues.ano_fab}
              min={1950}
              max={2099}
              className={inputCls}
            />
          </Field>
          <Field label="Ano Modelo *">
            <input
              name="ano_mod"
              type="number"
              required
              defaultValue={defaultValues.ano_mod}
              min={1950}
              max={2099}
              className={inputCls}
            />
          </Field>
          <Field label="Quilometragem">
            <input
              name="km"
              type="number"
              defaultValue={defaultValues.km ?? 0}
              min={0}
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      <section className="bg-c-surface rounded-xl shadow-card p-5">
        <h2 className="text-c-text font-bold uppercase tracking-wide text-xs mb-4 pb-3 border-b border-c-border">
          Características
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="Combustível *">
            <select
              name="combustivel"
              required
              defaultValue={defaultValues.combustivel ?? "Flex"}
              className={selectCls}
            >
              {COMBUSTIVEIS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Câmbio *">
            <select
              name="cambio"
              required
              defaultValue={defaultValues.cambio ?? "Manual"}
              className={selectCls}
            >
              {CAMBIOS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Cor *">
            {cores.length > 0 ? (
              <select
                name="cor"
                required
                defaultValue={defaultValues.cor ?? ""}
                className={selectCls}
              >
                <option value="" disabled>Selecione…</option>
                {cores.map((c) => (
                  <option key={c.id} value={c.nome}>{c.nome}</option>
                ))}
              </select>
            ) : (
              <input
                name="cor"
                required
                defaultValue={defaultValues.cor}
                className={inputCls}
                placeholder="Prata"
              />
            )}
          </Field>
          <Field label="Portas">
            <input
              name="portas"
              type="number"
              defaultValue={defaultValues.portas ?? 4}
              min={0}
              max={6}
              className={inputCls}
            />
          </Field>
          <Field label="Categoria *">
            <select
              name="categoria"
              required
              defaultValue={defaultValues.categoria ?? "Carro"}
              className={selectCls}
            >
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Condição *">
            <select
              name="condicao"
              required
              defaultValue={defaultValues.condicao ?? "Seminovo"}
              className={selectCls}
            >
              {CONDICOES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="bg-c-surface rounded-xl shadow-card p-5">
        <h2 className="text-c-text font-bold uppercase tracking-wide text-xs mb-1 pb-3 border-b border-c-border">
          Disponibilidade
        </h2>
        <p className="text-c-text3 text-xs mt-3 mb-4">
          Marque onde este veículo deve aparecer. O mesmo carro pode estar à
          venda <strong>e</strong> para locação ao mesmo tempo.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <label
            className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors flex-1 ${
              paraVenda ? "border-brand-red bg-brand-red/5" : "border-c-border hover:border-c-border3"
            }`}
          >
            <input
              type="checkbox"
              name="para_venda"
              value="true"
              checked={paraVenda}
              onChange={(e) => setParaVenda(e.target.checked)}
              className="w-4 h-4 accent-brand-red"
            />
            <span className="text-c-text text-sm font-bold uppercase tracking-wide">
              À venda
              <span className="block text-c-text3 text-xs font-normal normal-case tracking-normal">
                Aparece em /estoque
              </span>
            </span>
          </label>

          <label
            className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors flex-1 ${
              paraLocacao ? "border-brand-red bg-brand-red/5" : "border-c-border hover:border-c-border3"
            }`}
          >
            <input
              type="checkbox"
              name="para_locacao"
              value="true"
              checked={paraLocacao}
              onChange={(e) => setParaLocacao(e.target.checked)}
              className="w-4 h-4 accent-brand-red"
            />
            <span className="text-c-text text-sm font-bold uppercase tracking-wide">
              Para locação
              <span className="block text-c-text3 text-xs font-normal normal-case tracking-normal">
                Aparece em /locadora
              </span>
            </span>
          </label>
        </div>

        {!paraVenda && !paraLocacao && (
          <p className="text-brand-red text-xs mb-4">
            Selecione pelo menos uma opção, senão o veículo não aparece em nenhuma página.
          </p>
        )}

        {paraLocacao && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-c-border">
            <Field label="Valor da diária (R$)">
              <input
                name="preco_diaria"
                type="number"
                defaultValue={defaultValues.preco_diaria ?? ""}
                min={0}
                className={inputCls}
                placeholder="Ex: 250"
              />
            </Field>
            <Field label="Valor mensal (R$)">
              <input
                name="preco_mensal"
                type="number"
                defaultValue={defaultValues.preco_mensal ?? ""}
                min={0}
                className={inputCls}
                placeholder="Ex: 4500"
              />
            </Field>
            <p className="sm:col-span-2 text-c-text4 text-xs">
              Preencha diária, mensal ou ambos. Em branco = &quot;sob consulta&quot; no site.
            </p>
          </div>
        )}
      </section>

      <section className="bg-c-surface rounded-xl shadow-card p-5">
        <h2 className="text-c-text font-bold uppercase tracking-wide text-xs mb-4 pb-3 border-b border-c-border">
          Preço de Venda e Destaque
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label={paraVenda ? "Preço de venda (R$) *" : "Preço de venda (R$)"}>
            <input
              name="preco"
              type="number"
              required={paraVenda}
              defaultValue={defaultValues.preco}
              min={0}
              disabled={!paraVenda}
              className={`${inputCls} ${!paraVenda ? "opacity-40 cursor-not-allowed" : ""}`}
              placeholder={paraVenda ? "89900" : "Apenas locação"}
            />
          </Field>
          <Field label="Preço anterior (R$)">
            <input
              name="preco_anterior"
              type="number"
              defaultValue={defaultValues.preco_anterior ?? ""}
              min={0}
              className={inputCls}
              placeholder="Vazio = sem risco"
            />
          </Field>
          <Field label="Badge">
            <select
              name="badge"
              defaultValue={defaultValues.badge ?? ""}
              className={selectCls}
            >
              <option value="">Sem badge</option>
              <option value="destaque">Destaque</option>
              <option value="novo">Novo</option>
              <option value="oferta">Oferta</option>
              <option value="reservado">Reservado</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="bg-c-surface rounded-xl shadow-card p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-c-border">
          <h2 className="text-c-text font-bold uppercase tracking-wide text-xs">
            Fotos
          </h2>
          {fotos.length > 0 && (
            <span className="text-c-text3 text-xs">
              {fotos.length} foto{fotos.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {fotos.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {fotos.map((url, i) => (
              <div key={url} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className={`w-24 h-[4.5rem] object-cover bg-c-border ${i === 0 ? "ring-2 ring-brand-red" : ""}`}
                />

                {i === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-brand-red/90 text-white text-[0.72rem] font-black uppercase tracking-widest text-center py-0.5">
                    Principal
                  </div>
                )}

                <div className="absolute top-0.5 right-0.5 flex flex-col gap-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => removerFoto(url)}
                    className="bg-black/80 text-white p-0.5 hover:bg-brand-red transition-colors"
                    title="Remover foto"
                  >
                    <X size={11} />
                  </button>
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => definirPrincipal(url)}
                      className="bg-black/80 text-yellow-600 p-0.5 hover:bg-yellow-500 hover:text-black transition-colors"
                      title="Definir como foto principal"
                    >
                      <Star size={11} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {uploadErro && (
          <p className="text-brand-red text-xs mb-3">{uploadErro}</p>
        )}

        <label
          className={`flex items-center justify-center gap-3 w-full border-2 border-dashed py-6 cursor-pointer transition-colors ${
            uploading
              ? "border-c-border3 text-c-text3 cursor-not-allowed"
              : "border-brand-red/40 hover:border-brand-red text-c-text3 hover:text-c-text"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin text-brand-red" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Enviando fotos...
              </span>
            </>
          ) : (
            <>
              <Upload size={18} className="text-brand-red" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Clique para adicionar fotos
              </span>
            </>
          )}
          <input
            type="file"
            multiple
            accept="image/*,.heic,.heif"
            className="hidden"
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>
        <p className="text-c-text4 text-xs mt-2">
          JPG, PNG, WEBP ou HEIC (fotos de iPhone são convertidas
          automaticamente). Passe o mouse sobre uma foto para removê-la ou
          definir como principal (estrela).
        </p>
      </section>

      <section className="bg-c-surface rounded-xl shadow-card p-5">
        <h2 className="text-c-text font-bold uppercase tracking-wide text-xs mb-4 pb-3 border-b border-c-border">
          Detalhes
        </h2>
        <div className="flex flex-col gap-4">
          <Field label="Opcionais (um por linha)">
            <textarea
              name="opcionais"
              rows={4}
              defaultValue={(defaultValues.opcionais ?? []).join("\n")}
              className={`${inputCls} resize-y`}
              placeholder={"Ar-condicionado\nCâmera de ré\nBancos de couro"}
            />
          </Field>
          <Field label="Descrição">
            <textarea
              name="descricao"
              rows={4}
              defaultValue={defaultValues.descricao}
              className={`${inputCls} resize-y`}
              placeholder="Veículo em excelente estado, revisões em dia..."
            />
          </Field>
        </div>
      </section>

      <section className="bg-c-surface rounded-xl shadow-card p-5">
        <h2 className="text-c-text font-bold uppercase tracking-wide text-xs mb-4 pb-3 border-b border-c-border">
          Visibilidade
        </h2>
        <Field label="Status">
          <select
            name="ativo"
            defaultValue={defaultValues.ativo !== false ? "true" : "false"}
            className={`${selectCls} max-w-xs`}
          >
            <option value="true">Ativo — aparece no site</option>
            <option value="false">Oculto — não aparece no site</option>
          </select>
        </Field>
      </section>

      <div className="flex items-center gap-3">
        <SubmitButton label={submitLabel} />
        <a
          href="/admin/veiculos"
          className="text-c-text3 hover:text-c-text text-sm transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
