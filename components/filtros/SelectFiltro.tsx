"use client";

export const inputCls =
  "bg-c-surface border border-c-border text-c-text font-sans text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors w-full";

export default function SelectFiltro({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-condensed text-xs uppercase tracking-widest text-c-text3">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${inputCls} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        <option value="">Todos</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
