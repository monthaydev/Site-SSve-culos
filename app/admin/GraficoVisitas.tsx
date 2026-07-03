export interface DiaVisitas {
  dia: string; // "YYYY-MM-DD"
  paginas_vistas: number;
}

function formatarDiaMes(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

// Retângulo com cantos arredondados só no topo, encostado na base (baseline).
function pathBarra(x: number, y: number, w: number, h: number, r: number) {
  if (h <= 0) return `M ${x} ${y + h} L ${x + w} ${y + h} Z`;
  const raio = Math.min(r, w / 2, h);
  return `
    M ${x} ${y + h}
    L ${x} ${y + raio}
    Q ${x} ${y} ${x + raio} ${y}
    L ${x + w - raio} ${y}
    Q ${x + w} ${y} ${x + w} ${y + raio}
    L ${x + w} ${y + h}
    Z
  `;
}

export default function GraficoVisitas({ dados }: { dados: DiaVisitas[] }) {
  const largura = 600;
  const altura = 140;
  const baseY = altura - 20;
  const alturaMaxBarra = baseY - 10;

  const max = Math.max(1, ...dados.map((d) => d.paginas_vistas));
  const gap = 3;
  const larguraBarra = largura / dados.length - gap;

  return (
    <svg
      viewBox={`0 0 ${largura} ${altura}`}
      className="w-full h-auto"
      role="img"
      aria-label="Acessos diários ao site nos últimos 30 dias"
    >
      <line
        x1={0}
        y1={baseY}
        x2={largura}
        y2={baseY}
        stroke="var(--c-border2)"
        strokeWidth={1}
      />
      {dados.map((d, i) => {
        const h = (d.paginas_vistas / max) * alturaMaxBarra;
        const x = i * (larguraBarra + gap);
        return (
          <path
            key={d.dia}
            d={pathBarra(x, baseY - h, larguraBarra, h, 2)}
            fill="#C8102E"
            fillOpacity={d.paginas_vistas === 0 ? 0.1 : 0.85}
          >
            <title>
              {formatarDiaMes(d.dia)}: {d.paginas_vistas} acesso
              {d.paginas_vistas === 1 ? "" : "s"}
            </title>
          </path>
        );
      })}
      {dados.map((d, i) =>
        i % 5 === 0 ? (
          <text
            key={`label-${d.dia}`}
            x={i * (larguraBarra + gap) + larguraBarra / 2}
            y={altura - 4}
            fontSize={9}
            textAnchor="middle"
            fill="var(--c-text4)"
          >
            {formatarDiaMes(d.dia)}
          </text>
        ) : null
      )}
    </svg>
  );
}
