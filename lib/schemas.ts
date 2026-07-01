import { z } from "zod";

const anoValido = z.number().int().min(1950).max(2099);

export const VeiculoSchema = z.object({
  marca:          z.string().min(1),
  modelo:         z.string().min(1),
  versao:         z.string().min(1),
  ano_fab:        anoValido,
  ano_mod:        anoValido,
  km:             z.number().int().min(0),
  preco:          z.number().int().min(0).nullable(),
  preco_anterior: z.number().int().min(0).nullable(),
  combustivel:    z.enum(["Flex", "Gasolina", "Diesel", "Elétrico", "Híbrido"]),
  cambio:         z.enum(["Manual", "Automático", "CVT", "Automatizado"]),
  cor:            z.string().min(1),
  portas:         z.number().int().min(0).max(6),
  categoria:      z.enum(["Carro", "Caminhão", "Utilitário", "Van"]),
  condicao:       z.enum(["Novo", "Seminovo", "Usado"]),
  badge:          z.enum(["destaque", "novo", "oferta", "reservado"]).nullable(),
  fotos:          z.array(z.string()),
  opcionais:      z.array(z.string()),
  descricao:      z.string(),
  ativo:          z.boolean(),
  para_venda:     z.boolean(),
  para_locacao:   z.boolean(),
  preco_diaria:   z.number().int().min(0).nullable(),
  preco_mensal:   z.number().int().min(0).nullable(),
});

export type VeiculoDados = z.infer<typeof VeiculoSchema>;
