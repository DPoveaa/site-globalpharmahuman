import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { WhatsAppManager } from "@/components/admin/whatsapp-manager";
import { authOptions } from "@/lib/auth";

const REQUIRED_PERMISSION = "manage_whatsapp";

export default async function AdminWhatsappPage() {
  const session = await getServerSession(authOptions);
  const canManage =
    session?.user?.role === "ADMIN" ||
    (session?.user?.role === "EMPLOYEE" && session.user.permissions?.includes(REQUIRED_PERMISSION));

  if (!canManage) redirect("/admin");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Notificações</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">WhatsApp Administrativo</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
          Conecte um WhatsApp via QR Code, cadastre um ou mais números internos para receber novos pedidos,
          envie testes e acompanhe apenas as conversas desses destinatários.
        </p>
      </div>
      <WhatsAppManager />
    </div>
  );
}
