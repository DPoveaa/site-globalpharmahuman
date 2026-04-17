"use client";

import { useState, useEffect } from "react";
import { UserPlus, Users, Search, ShieldCheck, ShieldAlert } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoteEmail, setPromoteEmail] = useState("");
  const [promoteRole, setPromoteRole] = useState("ADMIN");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePromote() {
    if (!promoteEmail) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: promoteEmail, role: promoteRole })
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message ?? "Erro ao alterar cargo.");
      } else {
        alert("Cargo atualizado com sucesso!");
        setPromoteEmail("");
        fetchUsers();
      }
    } catch (error) {
      alert("Erro ao alterar cargo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-brand-100 p-2 text-brand-600">
          <Users size={24} />
        </div>
        <h1 className="text-3xl font-bold text-brand-900">Gerenciar Usuários</h1>
      </div>

      {/* Promover Usuário */}
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-brand-900">Promover Usuário</h2>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-500">
              E-mail da conta existente
            </label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
              <input
                type="email"
                placeholder="Ex: joao@gmail.com"
                className="w-full rounded-xl border border-brand-200 py-2.5 pl-10 pr-4 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                value={promoteEmail}
                onChange={(e) => setPromoteEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1 md:w-48">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-500">
              Cargo
            </label>
            <select
              className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              value={promoteRole}
              onChange={(e) => setPromoteRole(e.target.value)}
            >
              <option value="ADMIN">Administrador</option>
              <option value="CUSTOMER">Cliente</option>
            </select>
          </div>
          <button
            onClick={handlePromote}
            disabled={saving || !promoteEmail}
            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {saving ? "Salvando..." : (
              <>
                <ShieldCheck size={20} />
                Atualizar
              </>
            )}
          </button>
        </div>
        <p className="mt-3 text-xs text-brand-500 italic">
          O usuário precisa estar cadastrado no banco antes de ser promovido.
        </p>
      </div>

      {/* Lista de Usuários */}
      <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
        <div className="bg-brand-50 px-6 py-4">
          <h2 className="font-semibold text-brand-900">Usuários Cadastrados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50 text-xs font-semibold uppercase tracking-wider text-brand-600">
              <tr>
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">E-mail</th>
                <th className="px-6 py-3">Cargo</th>
                <th className="px-6 py-3">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-brand-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-900">{user.name}</td>
                  <td className="px-6 py-4 text-brand-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
                      user.role === 'ADMIN' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'ADMIN' ? <ShieldCheck size={12} /> : null}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-brand-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
