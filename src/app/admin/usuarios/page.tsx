"use client";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Users, ShieldCheck, ChevronDown, Phone, Plus, X, Key, Settings2, Save, UserCog } from "lucide-react";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: "ADMIN" | "EMPLOYEE" | "CUSTOMER";
  permissions: string[];
  createdAt: string;
};

const PERMISSION_OPTIONS = [
  { id: "view_dashboard", label: "Ver Dashboard" },
  { id: "manage_products", label: "Gerenciar Produtos" },
  { id: "manage_promotions", label: "Gerenciar Promoções" },
  { id: "manage_orders", label: "Gerenciar Pedidos" },
  { id: "manage_shipping", label: "Gerenciar Frete" },
  { id: "manage_settings", label: "Configurações Gerais" },
  { id: "manage_loyalty", label: "Gerenciar Fidelidade" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", phone: "", email: "", password: "", permissions: [] as string[] });

  const [editPermissionsUser, setEditPermissionsUser] = useState<UserRow | null>(null);
  const [editPermissionsList, setEditPermissionsList] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();

    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.role-dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const json: unknown = await response.json();
        if (Array.isArray(json)) {
          setUsers(json as UserRow[]);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePromote(email: string, role: string) {
    if (!email) return;
    setSaving(true);
    setOpenDropdownId(null);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role })
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message ?? "Erro ao alterar cargo.");
      } else {
        toast.success("Cargo atualizado com sucesso!");
        fetchUsers();
      }
    } catch {
      toast.error("Erro ao alterar cargo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateEmployee(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee)
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message ?? "Erro ao criar funcionário.");
      } else {
        toast.success("Funcionário criado com sucesso!");
        setShowCreateModal(false);
        setNewEmployee({ name: "", phone: "", email: "", password: "", permissions: [] });
        fetchUsers();
      }
    } catch {
      toast.error("Erro ao criar funcionário.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePermissions(e: React.FormEvent) {
    e.preventDefault();
    if (!editPermissionsUser) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/employees/${editPermissionsUser.id}/permissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: editPermissionsList })
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message ?? "Erro ao atualizar permissões.");
      } else {
        toast.success("Permissões atualizadas com sucesso!");
        setEditPermissionsUser(null);
        fetchUsers();
      }
    } catch {
      toast.error("Erro ao atualizar permissões.");
    } finally {
      setSaving(false);
    }
  }

  function togglePermission(permId: string, currentList: string[], setList: (v: string[]) => void) {
    if (currentList.includes(permId)) {
      setList(currentList.filter(id => id !== permId));
    } else {
      setList([...currentList, permId]);
    }
  }

  if (loading) return <div className="flex h-32 items-center justify-center font-semibold text-slate-500 animate-pulse">Carregando contas...</div>;

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 p-2 text-indigo-600 shadow-inner">
            <Users size={24} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Contas & Permissões</h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20"
        >
          <Plus size={18} />
          Novo Funcionário
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-50/80 px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Lista de Contas</h2>
          <span className="text-xs font-bold bg-white text-slate-600 px-3 py-1 rounded-full border border-slate-200 shadow-sm">{users.length} usuários</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar pb-4">
          <table className="w-full min-w-[800px] text-left text-sm border-collapse">
            <thead className="bg-white text-xs font-bold uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">E-mail / Contato</th>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Permissões</th>
                <th className="px-6 py-4 text-right">Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5 align-middle whitespace-nowrap">
                    <p className="font-bold text-slate-900">{user.name || "Sem nome definido"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Cadastrado em {new Date(user.createdAt).toLocaleDateString("pt-BR")}</p>
                  </td>
                  <td className="px-6 py-5 align-middle whitespace-nowrap">
                    <p className="font-medium text-slate-700">{user.email}</p>
                    {user.phone && (
                      <a href={`https://wa.me/${user.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-600 transition text-xs font-medium mt-1">
                        <Phone size={12} />
                        {user.phone}
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-5 align-middle whitespace-nowrap">
                    <div className="relative role-dropdown-container">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                        disabled={saving}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition focus:ring-2 focus:ring-offset-1 disabled:opacity-50 ${user.role === 'ADMIN'
                          ? 'bg-amber-100 text-amber-700 border-transparent hover:bg-amber-200'
                          : user.role === 'EMPLOYEE'
                            ? 'bg-indigo-100 text-indigo-700 border-transparent hover:bg-indigo-200'
                            : 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200'
                          }`}
                      >
                        {user.role === 'ADMIN' ? <ShieldCheck size={14} /> : user.role === 'EMPLOYEE' ? <UserCog size={14} /> : <Users size={14} />}
                        {user.role === 'ADMIN' ? 'Administrador' : user.role === 'EMPLOYEE' ? 'Funcionário' : 'Cliente'}
                        <ChevronDown size={14} className={`transition-transform opacity-50 ${openDropdownId === user.id ? 'rotate-180' : ''}`} />
                      </button>

                      {openDropdownId === user.id && (
                        <div className="absolute left-0 top-full mt-2 w-[160px] rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-200/50 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <button
                            onClick={() => handlePromote(user.email, 'ADMIN')}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-slate-600 transition hover:bg-amber-50 hover:text-amber-700"
                          >
                            <ShieldCheck size={14} />
                            Administrador
                          </button>
                          <button
                            onClick={() => handlePromote(user.email, 'EMPLOYEE')}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            <UserCog size={14} />
                            Funcionário
                          </button>
                          <button
                            onClick={() => handlePromote(user.email, 'CUSTOMER')}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Users size={14} />
                            Cliente
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    {user.role === "EMPLOYEE" ? (
                      <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                        {user.permissions && user.permissions.length > 0 ? (
                          <>
                            {user.permissions.slice(0, 3).map(p => (
                              <span key={p} className="bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
                                {PERMISSION_OPTIONS.find(opt => opt.id === p)?.label || p}
                              </span>
                            ))}
                            {user.permissions.length > 3 && (
                              <span className="bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
                                +{user.permissions.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded inline-block">Sem acessos</span>
                        )}
                      </div>
                    ) : user.role === "ADMIN" ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded inline-block">Acesso Total</span>
                    ) : (
                      <span className="text-slate-300 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-5 align-middle text-right whitespace-nowrap">
                    {user.role === "EMPLOYEE" && (
                      <button
                        onClick={() => {
                          setEditPermissionsUser(user);
                          setEditPermissionsList(user.permissions || []);
                        }}
                        className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Settings2 size={14} />
                        Acessos
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NOVO FUNCIONÁRIO */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
                  <UserCog size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900">Novo Funcionário</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 transition bg-white p-2 rounded-full border border-slate-100 hover:border-slate-300 shadow-sm">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="createEmployeeForm" onSubmit={handleCreateEmployee} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Nome (Opcional)</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="Nome do funcionário"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">WhatsApp / Telefone (Opcional)</label>
                  <input
                    type="text"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">E-mail de Acesso</label>
                  <input
                    type="email"
                    required
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="funcionario@exemplo.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Senha Temporária</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                      <Key size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={newEmployee.password}
                      onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      placeholder="Min. 6 caracteres"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">O funcionário será forçado a trocar esta senha no primeiro acesso.</p>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 block">Permissões Iniciais</label>
                  <div className="grid grid-cols-1 gap-2">
                    {PERMISSION_OPTIONS.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 cursor-pointer transition-colors group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={newEmployee.permissions.includes(opt.id)}
                            onChange={() => togglePermission(opt.id, newEmployee.permissions, (list) => setNewEmployee({ ...newEmployee, permissions: list }))}
                            className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded text-indigo-600 checked:border-indigo-600 checked:bg-indigo-600 transition-colors cursor-pointer"
                          />
                          <svg className="absolute w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-2 stroke-current fill-none transition-opacity" viewBox="0 0 12 10">
                            <polyline points="1.5 6 4.5 9 10.5 1" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className="border-t border-slate-100 p-6 bg-slate-50/50 shrink-0">
              <button
                type="submit"
                form="createEmployeeForm"
                disabled={saving}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 disabled:opacity-50"
              >
                {saving ? "Criando..." : "Criar Funcionário"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PERMISSÕES */}
      {editPermissionsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Editar Permissões</h3>
                  <p className="text-xs font-medium text-slate-500">{editPermissionsUser.email}</p>
                </div>
              </div>
              <button onClick={() => setEditPermissionsUser(null)} className="text-slate-400 hover:text-slate-600 transition bg-white p-2 rounded-full border border-slate-100 hover:border-slate-300 shadow-sm">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="editPermissionsForm" onSubmit={handleSavePermissions} className="space-y-2">
                {PERMISSION_OPTIONS.map((opt) => (
                  <label key={opt.id} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${editPermissionsList.includes(opt.id) ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-300 bg-white'}`}>
                    <span className={`text-sm font-bold ${editPermissionsList.includes(opt.id) ? 'text-emerald-900' : 'text-slate-600'}`}>{opt.label}</span>
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={editPermissionsList.includes(opt.id)}
                        onChange={() => togglePermission(opt.id, editPermissionsList, setEditPermissionsList)}
                        className="peer appearance-none w-6 h-6 border-2 border-slate-200 rounded-lg text-emerald-500 checked:border-emerald-500 checked:bg-emerald-500 transition-colors cursor-pointer"
                      />
                      <svg className="absolute w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-2 stroke-current fill-none transition-opacity" viewBox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </label>
                ))}
              </form>
            </div>
            <div className="border-t border-slate-100 p-6 bg-slate-50/50 shrink-0">
              <button
                type="submit"
                form="editPermissionsForm"
                disabled={saving}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 disabled:opacity-50"
              >
                {saving ? "Salvando..." : (
                  <>
                    <Save size={18} />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
