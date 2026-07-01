import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "./login/actions";
import { LogOut, ShieldCheck } from "lucide-react";
import { AdminSidebarNav, AdminTabNav } from "./NavLink";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-c-bg flex">
      <aside className="hidden lg:flex flex-col w-60 border-r border-c-border2 bg-c-bg-alt shrink-0">
        <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-c-border2">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/logo-ss-veiculos.png"
              alt="SS Veículos"
              width={155}
              height={100}
              priority
              className="h-9 w-auto"
            />
          </Link>
          <span className="text-c-text3 text-xs uppercase tracking-widest leading-tight text-right">
            Painel<br />Admin
          </span>
        </div>

        <AdminSidebarNav />

        <div className="px-3 py-4 border-t border-c-border2">
          <div className="flex items-center gap-2 px-3 mb-3">
            <ShieldCheck size={12} className="text-green-500 shrink-0" />
            <p className="text-c-text3 text-sm truncate">{user?.email}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 w-full text-c-text3 hover:text-brand-red hover:bg-brand-red/5 transition-colors text-sm font-medium rounded-sm"
            >
              <LogOut size={15} className="shrink-0" />
              Sair da conta
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-c-border2 bg-c-bg-alt">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/logo-ss-veiculos.png"
              alt="SS Veículos"
              width={124}
              height={80}
              priority
              className="h-7 w-auto"
            />
            <span className="text-c-text3 font-bold text-xs uppercase tracking-widest">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <p className="text-c-text4 text-xs truncate max-w-[160px] hidden sm:block">
              {user?.email}
            </p>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-c-text3 hover:text-brand-red transition-colors p-1"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </header>

        <AdminTabNav />

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
