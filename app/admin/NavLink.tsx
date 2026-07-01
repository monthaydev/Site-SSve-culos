"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, Tag, Palette, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin",          label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/veiculos", label: "Veículos",  icon: Car },
  { href: "/admin/marcas",   label: "Marcas",    icon: Tag },
  { href: "/admin/cores",    label: "Cores",     icon: Palette },
  { href: "/admin/vendedores", label: "Vendedores", icon: Users },
];

function NavLink({ href, label, icon: Icon, exact }: NavItem) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm group transition-colors ${
        isActive
          ? "bg-brand-red/10 text-c-text"
          : "text-c-text2 hover:text-c-text hover:bg-c-surface2"
      }`}
    >
      <Icon
        size={16}
        className={`shrink-0 transition-colors ${
          isActive ? "text-brand-red" : "group-hover:text-brand-red"
        }`}
      />
      {label}
      {isActive && (
        <div className="ml-auto w-1 h-3.5 bg-brand-red rounded-full" />
      )}
    </Link>
  );
}

function NavLinkTab({ href, label, icon: Icon, exact }: NavItem) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors shrink-0 border-b-2 ${
        isActive
          ? "text-c-text border-brand-red"
          : "text-c-text3 border-transparent hover:text-c-text2"
      }`}
    >
      <Icon size={14} className={isActive ? "text-brand-red" : ""} />
      {label}
    </Link>
  );
}

export function AdminSidebarNav() {
  return (
    <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} {...item} />
      ))}
    </nav>
  );
}

export function AdminTabNav() {
  return (
    <nav className="lg:hidden flex border-b border-c-border2 bg-c-bg-alt overflow-x-auto">
      {NAV_ITEMS.map((item) => (
        <NavLinkTab key={item.href} {...item} />
      ))}
    </nav>
  );
}
