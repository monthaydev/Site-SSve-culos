import Image from "next/image";
import { loginAction } from "./actions";
import LoginSubmitButton from "./LoginSubmitButton";

export const metadata = { title: "Admin — SS Veículos" };

interface Props {
  searchParams: Promise<{ erro?: string }>;
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const { erro } = await searchParams;

  return (
    <div className="min-h-screen bg-c-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo-ss-veiculos.png"
            alt="SS Veículos"
            width={186}
            height={120}
            priority
            className="h-14 w-auto mb-3"
          />
          <p className="text-c-text3 text-xs uppercase tracking-widest">
            Painel · Acesso restrito
          </p>
        </div>

        <div className="bg-c-surface rounded-2xl shadow-card p-8">
          <h1 className="text-c-text font-bold text-lg uppercase tracking-wide mb-6">
            Entrar no painel
          </h1>

          {erro === "credenciais" && (
            <div className="mb-4 border border-brand-red/40 bg-brand-red/10 rounded-lg px-4 py-3 text-brand-red text-sm">
              E-mail ou senha incorretos.
            </div>
          )}

          <form action={loginAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-c-text2 text-xs uppercase tracking-widest">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="bg-c-bg border border-c-border rounded-lg text-c-text px-4 py-3 text-sm outline-none focus:border-brand-red transition-colors placeholder:text-c-text4"
                placeholder="admin@ssveiculos.com.br"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-c-text2 text-xs uppercase tracking-widest">
                Senha
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="bg-c-bg border border-c-border rounded-lg text-c-text px-4 py-3 text-sm outline-none focus:border-brand-red transition-colors"
              />
            </div>

            <LoginSubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}
