import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AccountManager } from "@/components/account-manager";

export default async function ContaPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-10">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Área do Cliente</p>
        <h1 className="text-4xl font-black text-slate-900 md:text-5xl">Minha Conta</h1>
      </div>
      
      <AccountManager initialUser={session.user} />
    </div>
  );
}
