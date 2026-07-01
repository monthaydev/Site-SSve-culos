import { BadgeStatus } from "@/lib/types";

const config: Record<BadgeStatus, { label: string; classes: string }> = {
  destaque: { label: "Destaque", classes: "bg-brand-red text-white" },
  novo: { label: "Novo", classes: "bg-[#1a8a2e] text-white" },
  oferta: { label: "Oferta", classes: "bg-[#d97706] text-white" },
  reservado: { label: "Reservado", classes: "bg-[#555] text-white" },
};

export default function Badge({ status }: { status: BadgeStatus }) {
  const { label, classes } = config[status];
  return (
    <span
      className={`inline-block font-condensed font-bold text-xs uppercase tracking-widest px-2 py-0.5 ${classes}`}
    >
      {label}
    </span>
  );
}
