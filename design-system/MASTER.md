# SS Veículos — Design System (MASTER)

> Fonte de verdade do redesign. Gerado com a skill **ui-ux-pro-max** (perfil *Automotive/Car Dealership*) + **frontend-design**, validado com o cliente em 2026-06-15.
> Regra de uso: ao construir uma página, leia este arquivo. Se existir `design-system/pages/<pagina>.md`, ela tem prioridade sobre o MASTER.

---

## 0. Decisões travadas (não reverter sem ordem do cliente)

1. **Tema base CLARO** — fundo claro por padrão; modo escuro continua disponível no toggle.
2. **WhatsApp concentrado na conversão** — fora dos cards de listagem; presente na página interna do veículo e em 1 botão flutuante discreto.
3. **Home inventory-first** — busca + estoque são protagonistas; marketing reduzido a uma faixa de confiança enxuta.

**Princípio-guia:** o cliente entra → vê carros → busca → filtra → se interessa → fala com o vendedor. Cada decisão de UI serve a essa jornada. Nada de "landing page".

---

## 1. Perfil de produto (skill)

- **Tipo:** Automotive / Car Dealership
- **Estilo:** Motion-Driven + imagery de alta qualidade · Hero-Centric **compacto** + Feature-Rich
- **Conversão:** catálogo navegável → contato com vendedor (WhatsApp/telefone)
- **Referência visual:** rondoniaveiculos.com.br (inventory-first, busca no topo, grid + paginação)

---

## 2. Cores (tokens semânticos)

Mapeados sobre as variáveis `--c-*` já existentes em `app/globals.css`. A marca (vermelho `#C8102E`, preto `#0D0D0D`, branco) é preservada; o vermelho é a **cor de ação** (CTAs, preço, destaque), nunca cor de fundo de grandes áreas.

### Tema claro (padrão)
| Token | Valor | Uso |
|---|---|---|
| `--c-bg` | `#F5F6F8` | Fundo da página |
| `--c-bg-alt` | `#EEF0F3` | Faixas alternadas |
| `--c-surface` | `#FFFFFF` | Card de veículo, inputs |
| `--c-raised` | `#FAFBFC` | Blocos elevados |
| `--c-border` | `#E2E8F0` | Bordas (skill automotive) |
| `--c-text` | `#0F172A` | Texto principal |
| `--c-text2` | `#475569` | Texto secundário |
| `--c-text3` | `#94A3B8` | Texto terciário/labels |
| **Ação** | `#C8102E` (hover `#E01030`) | CTA, preço, badges de oferta |
| Slate primário | `#1E293B` | Cabeçalho/rodapé, texto forte |

### Tema escuro (toggle) — manter base atual
`#0D0D0D` fundo · `#1A1A1A` surface · `#2A2A2A` border · texto `#FFFFFF/#A0A0A0`. Vermelho de ação idêntico.

> **Contraste:** todo par texto/fundo ≥ 4.5:1. Vermelho `#C8102E` sobre branco passa AA para texto bold/preço; **não** usar vermelho para texto pequeno em cinza.

---

## 3. Tipografia

Manter a base atual — combina com o perfil esportivo/industrial automotivo:
- **Display:** Bebas Neue (`--font-bebas`) — números grandes, títulos, preço
- **Condensed:** Barlow Condensed (`--font-barlow-condensed`) — labels, specs, botões uppercase
- **Corpo:** Barlow (`--font-barlow`) — descrições, texto corrido (mín. **16px** no mobile)

Escala: 12 · 14 · 16 · 18 · 24 · 32 · 48. Line-height corpo 1.5–1.7. Números de preço/specs com `tabular-nums`.

---

## 4. Componentes-chave

### Card de veículo (listagem) — SEM WhatsApp
- Foto `aspect-[4/3]`, `loading="lazy"`, `object-cover`, dimensões reservadas (sem CLS)
- Badge de status no canto (Destaque/Novo/Oferta/Reservado)
- Marca + Modelo + Versão · Ano fab/mod · KM · Combustível · Câmbio · Cor
- Preço em Bebas, vermelho, destaque visual; preço anterior riscado se houver
- **1 CTA único:** `Ver detalhes` (leva à página interna). Card inteiro clicável.
- Hover: leve elevação + borda vermelha sutil. `rounded-xl`, sombra sutil.

### Busca/Filtros
- **Home:** barra de busca rápida (Marca, Faixa de preço, Categoria, + "Buscar") que leva a `/estoque` com query.
- **/estoque:** sidebar desktop / drawer mobile com todos os filtros (Categoria, Marca→Modelo dependente, Ano de/até, Preço, KM, Combustível, Câmbio, Cor, Portas, Condição) + ordenação. Filtros refletidos na URL (compartilhável, deep-link).
- Contador de resultados sempre visível. Botão "Limpar (n)".

### Botões
- Touch target ≥ 44px. `cursor-pointer`. Feedback de press em 150–300ms.
- Primário: fundo vermelho, texto branco, uppercase condensed.
- Secundário: borda + hover vermelho.
- Estado de loading com spinner; desabilitar durante async.

### WhatsApp (política)
- **Listagem:** nenhum.
- **Página do veículo:** bloco de CTAs — `Tenho interesse — WhatsApp` (primário) + `Agendar visita` + `Ligar`.
- **Global:** 1 botão flutuante discreto (sem pulsar agressivo; respeitar `prefers-reduced-motion`).

---

## 5. Estrutura da Home (inventory-first)

1. **Hero compacto** (≤ 60dvh) com headline curta + **barra de busca integrada**.
2. **Veículos em destaque** — grid 1/2/3 colunas, logo abaixo do hero.
3. **Categorias** — Carro · Caminhão · Utilitário · Van (sem Moto).
4. **Faixa de confiança enxuta** — "22 anos", garantia, parceiros (BV/Bradesco/C6) em UMA seção compacta.
5. **Rodapé** — contato, mapa, redes, horário.

Removido da home: diferenciais extensos, bloco de serviços duplicado, CTA final redundante (migram para `/sobre` e `/servicos`).

---

## 6. Guard-rails de UX (skill — prioridade 1→3)

- **Acessibilidade:** contraste 4.5:1, `alt` descritivo nas fotos, foco visível, labels em inputs, cor nunca é o único indicador.
- **Touch/Interação:** alvos ≥ 44px, espaçamento ≥ 8px, feedback de toque < 100ms, nada depender só de hover.
- **Performance:** imagens WebP/AVIF (next/image), `loading="lazy"` abaixo da dobra, **reservar dimensão** (CLS < 0.1), virtualizar/paginar listas grandes, debounce na busca.
- **Responsivo mobile-first:** breakpoints 375/768/1024/1440; sem scroll horizontal; `min-h-dvh`.
- **Animação:** 150–300ms, só `transform`/`opacity`, respeitar `prefers-reduced-motion`.

---

## 7. Anti-padrões a evitar

- ❌ WhatsApp repetido em cada card e seção.
- ❌ Hero ocupando a tela inteira empurrando o estoque para baixo da dobra.
- ❌ Vermelho como fundo de grandes áreas (é cor de ação).
- ❌ Texto pequeno cinza-sobre-cinza.
- ❌ Imagens sem dimensão reservada (layout shift).
- ❌ Emoji como ícone (usar Lucide, já em uso).
- ❌ Marketing acima do inventário na home.

---

## 8. Stack de implementação

Next.js (App Router) + React + TypeScript + Tailwind. Manter `next/image`, tokens `--c-*` em `globals.css`, ícones Lucide. Sem libs novas de UI sem necessidade.
