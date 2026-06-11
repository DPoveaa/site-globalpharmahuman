"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  CheckCircle2,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  QrCode,
  RefreshCw,
  Save,
  Send,
  Trash2,
  Wifi,
  WifiOff,
  X,
  XCircle,
  Loader2,
  FileText,
  Download
} from "lucide-react";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
type Recipient = {
  id: string;
  name: string;
  phone: string;
  active: boolean;
};

type WppStatus = {
  status: "DISCONNECTED" | "STARTING" | "QRCODE" | "CONNECTED" | "ERROR";
  qrCode: string | null;
  error: string | null;
  recipients: Recipient[];
};

type ChatMessage = {
  id: string;
  fromMe: boolean;
  body: string;
  timestamp: number;
  sender?: string;
  type?: string;
  mimetype?: string | null;
  filename?: string | null;
  mediaData?: string | null;
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const emptyStatus: WppStatus = {
  status: "DISCONNECTED",
  qrCode: null,
  error: null,
  recipients: []
};

function formatPhone(value: string) {
  return value.replace(/\D/g, "");
}

const STATUS_LABELS: Record<WppStatus["status"], string> = {
  DISCONNECTED: "Desconectado",
  STARTING: "Iniciando...",
  QRCODE: "Aguardando QR",
  CONNECTED: "Conectado",
  ERROR: "Erro"
};

const STATUS_COLORS: Record<WppStatus["status"], string> = {
  DISCONNECTED: "bg-slate-100 text-slate-500",
  STARTING: "bg-amber-50 text-amber-600",
  QRCODE: "bg-blue-50 text-blue-600",
  CONNECTED: "bg-emerald-50 text-emerald-700",
  ERROR: "bg-rose-50 text-rose-700"
};

// ──────────────────────────────────────────────
// Modal: Confirmação de desconexão
// ──────────────────────────────────────────────
function DisconnectConfirmModal({
  onConfirm,
  onCancel
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
          <AlertTriangle size={22} className="text-rose-600" />
        </div>
        <h3 className="mt-4 text-lg font-black text-slate-900">Desconectar WhatsApp?</h3>
        <p className="mt-2 text-sm text-slate-500">
          A sessão será encerrada. Você precisará escanear o QR Code novamente para reconectar e as
          notificações de pedidos serão interrompidas.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-rose-600 py-3 text-sm font-black text-white transition hover:bg-rose-700"
          >
            Sim, desconectar
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Modal: Gerenciar destinatários
// ──────────────────────────────────────────────
function RecipientsModal({
  recipients,
  isConnected,
  saving,
  onUpdate,
  onAdd,
  onRemove,
  onSave,
  onSendTest,
  onClose
}: {
  recipients: Recipient[];
  isConnected: boolean;
  saving: boolean;
  onUpdate: (id: string, patch: Partial<Recipient>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onSave: () => void;
  onSendTest: (phone: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 py-8">
      <div className="w-full max-w-xl rounded-[28px] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Destinatários
            </p>
            <h3 className="mt-0.5 text-lg font-black text-slate-900">Números que recebem pedidos</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          {recipients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <Phone size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-400">Nenhum número cadastrado</p>
              <p className="mt-1 text-xs text-slate-400">
                Clique em "Adicionar número" abaixo para começar
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {recipients.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Nome / Setor
                      </label>
                      <input
                        value={r.name}
                        onChange={(e) => onUpdate(r.id, { name: e.target.value })}
                        placeholder="Ex: Equipe de Vendas"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Número (com DDI)
                      </label>
                      <input
                        value={r.phone}
                        onChange={(e) => onUpdate(r.id, { phone: formatPhone(e.target.value) })}
                        placeholder="5511999999999"
                        inputMode="numeric"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500">
                      <input
                        type="checkbox"
                        checked={r.active}
                        onChange={(e) => onUpdate(r.id, { active: e.target.checked })}
                        className="h-4 w-4 rounded accent-slate-900"
                      />
                      Ativo (recebe notificações)
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onSendTest(r.phone)}
                        disabled={!isConnected || !r.phone}
                        title={isConnected ? "Enviar mensagem de teste" : "Conecte o WhatsApp para testar"}
                        className="rounded-lg bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Enviar teste
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(r.id)}
                        className="rounded-lg bg-rose-50 p-1.5 text-rose-500 transition hover:bg-rose-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-200"
          >
            <Plus size={14} /> Adicionar número
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-600 transition hover:bg-slate-50"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
export function WhatsAppManager() {
  const [serverData, setServerData] = useState<WppStatus>(emptyStatus);
  const [localRecipients, setLocalRecipients] = useState<Recipient[]>([]);
  const recipientsInitialized = useRef(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatNotFound, setChatNotFound] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);

  const isConnected = serverData.status === "CONNECTED";
  const isStarting = serverData.status === "STARTING" || serverData.status === "QRCODE";
  const canStartSession = !loading && ["DISCONNECTED", "ERROR"].includes(serverData.status);
  const savedRecipients = serverData.recipients;

  const selectedRecipient = useMemo(
    () => savedRecipients.find((r) => r.phone === selectedPhone),
    [savedRecipients, selectedPhone]
  );

  // ── Polling de status ──
  const fetchStatus = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/admin/whatsapp/status", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao buscar status.");
      setServerData(json);
      setConnectionError("");
      if (!recipientsInitialized.current) {
        setLocalRecipients(json.recipients ?? []);
        recipientsInitialized.current = true;
        if (json.recipients?.length) {
          setSelectedPhone((prev) => prev || json.recipients[0].phone);
        }
      }
    } catch (error: any) {
      const message = error.message || "Erro ao carregar WhatsApp.";
      setServerData((prev) => ({ ...emptyStatus, recipients: prev.recipients }));
      setMessages([]);
      setConnectionError(message);
      if (showLoading) toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Iniciar sessão ──
  async function startSession() {
    if (!canStartSession) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/whatsapp/start", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao iniciar WhatsApp.");
      setServerData(json);
      setConnectionError("");
      toast.success("Sessão iniciada. Aguarde o QR Code aparecer.");
    } catch (error: any) {
      toast.error(error.message || "Erro ao iniciar WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  // ── Parar sessão ──
  async function confirmStopSession() {
    setShowDisconnectModal(false);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/whatsapp/stop", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao desconectar.");
      setServerData(json);
      setMessages([]);
      setConnectionError("");
      toast.success("WhatsApp desconectado com sucesso.");
    } catch (error: any) {
      toast.error(error.message || "Erro ao desconectar.");
    } finally {
      setLoading(false);
    }
  }

  // ── Salvar destinatários ──
  async function saveRecipients() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/whatsapp/recipients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients: localRecipients })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao salvar destinatários.");
      setServerData((prev) => ({ ...prev, recipients: json.recipients }));
      setLocalRecipients(json.recipients);
      toast.success("Destinatários salvos com sucesso.");
      setShowRecipientsModal(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  // ── Teste ──
  async function sendTest(phone: string) {
    if (!isConnected) { toast.error("Conecte o WhatsApp antes de enviar teste."); return; }
    const normalized = formatPhone(phone);
    if (normalized.length < 10) { toast.error("Informe um número válido antes de enviar teste."); return; }
    try {
      const res = await fetch("/api/admin/whatsapp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao enviar teste.");
      toast.success("Mensagem de teste enviada!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar teste.");
    }
  }

  // ── Chat ──
  async function fetchChat(phone = selectedPhone) {
    if (!phone) return;
    try {
      const res = await fetch(
        `/api/admin/whatsapp/chat/${encodeURIComponent(formatPhone(phone))}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao carregar chat.");
      setMessages(json.messages || []);
      // chatNotFound = true significa que o número existe no WhatsApp mas
      // nunca teve conversa aberta nesta sessão — é comportamento esperado.
      setChatNotFound(json.chatNotFound === true);
    } catch (error: any) {
      // Não exibe toast para erros silenciosos de chat (pode estar desconectado)
      console.warn("[Chat] Erro ao carregar:", error.message);
      setMessages([]);
      setChatNotFound(false);
    }
  }

  async function sendChatMessage() {
    if (!selectedPhone || !chatInput.trim() || !isConnected) return;
    const message = chatInput.trim();
    setChatInput("");
    try {
      const res = await fetch(
        `/api/admin/whatsapp/chat/${encodeURIComponent(formatPhone(selectedPhone))}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao enviar mensagem.");
      setMessages(json.messages || []);
      // Após enviar, o chat passa a existir na sessão — recarrega para pegar histórico
      setChatNotFound(false);
      setTimeout(() => fetchChat(selectedPhone), 1000);
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar mensagem.");
    }
  }

  // ── CRUD local recipients ──
  function updateRecipient(id: string, patch: Partial<Recipient>) {
    setLocalRecipients((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRecipient() {
    setLocalRecipients((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, name: "", phone: "", active: true }
    ]);
  }
  function removeRecipient(id: string) {
    setLocalRecipients((prev) => prev.filter((r) => r.id !== id));
  }

  // Quando abre o modal, sincroniza local com o que está salvo
  function openRecipientsModal() {
    setLocalRecipients(savedRecipients.map((r) => ({ ...r })));
    setShowRecipientsModal(true);
  }

  useEffect(() => {
    fetchStatus(true);
    const timer = setInterval(() => fetchStatus(false), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedPhone && isConnected) {
      setChatNotFound(false);
      fetchChat(selectedPhone);
    } else if (!isConnected) {
      setMessages([]);
      setChatNotFound(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPhone, serverData.status]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  return (
    <>
      {showDisconnectModal && (
        <DisconnectConfirmModal
          onConfirm={confirmStopSession}
          onCancel={() => setShowDisconnectModal(false)}
        />
      )}

      {showRecipientsModal && (
        <RecipientsModal
          recipients={localRecipients}
          isConnected={isConnected}
          saving={saving}
          onUpdate={updateRecipient}
          onAdd={addRecipient}
          onRemove={removeRecipient}
          onSave={saveRecipients}
          onSendTest={sendTest}
          onClose={() => setShowRecipientsModal(false)}
        />
      )}

      <div className="space-y-6">
        {/* ── Linha 1: Conexão + Destinatários ── */}
        <section className="grid gap-6 lg:grid-cols-[380px_1fr]">

          {/* Card de Conexão */}
          <div className="flex flex-col rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Conexão</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">WhatsApp Admin</h2>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase ${STATUS_COLORS[serverData.status]}`}>
                {serverData.status === "CONNECTED" && <Wifi size={10} />}
                {serverData.status === "DISCONNECTED" && <WifiOff size={10} />}
                {(serverData.status === "STARTING" || serverData.status === "QRCODE") && <Loader2 size={10} className="animate-spin" />}
                {serverData.status === "ERROR" && <AlertTriangle size={10} />}
                {STATUS_LABELS[serverData.status]}
              </span>
            </div>

            {/* QR Code / Status visual */}
            <div className="mt-5 flex-1 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
              {serverData.qrCode ? (
                <img
                  src={serverData.qrCode}
                  alt="QR Code WhatsApp"
                  className="mx-auto h-64 w-64 rounded-2xl bg-white object-contain p-2 shadow-sm"
                />
              ) : (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400">
                  {serverData.status === "CONNECTED" ? (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                        <CheckCircle2 size={36} className="text-emerald-500" />
                      </div>
                      <p className="text-sm font-bold text-emerald-700">WhatsApp conectado</p>
                      <p className="text-xs text-slate-400">Sessão ativa e funcionando</p>
                    </>
                  ) : serverData.status === "STARTING" || serverData.status === "QRCODE" ? (
                    <>
                      <Loader2 size={40} className="animate-spin text-amber-500" />
                      <p className="text-xs font-bold text-amber-600">
                        {serverData.status === "QRCODE" ? "Gerando QR Code..." : "Iniciando sessão..."}
                      </p>
                    </>
                  ) : serverData.status === "ERROR" ? (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
                        <XCircle size={36} className="text-rose-500" />
                      </div>
                      <p className="text-xs font-bold text-rose-600">Erro na sessão</p>
                    </>
                  ) : (
                    <>
                      <QrCode size={40} className="text-slate-300" />
                      <p className="text-xs font-bold">QR Code aparecerá aqui</p>
                      <p className="text-[11px] text-slate-400">Clique em Conectar para iniciar</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {(serverData.error || connectionError) && (
              <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-xs font-bold text-rose-700">
                {serverData.error || connectionError}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-2">
              {!isConnected && (
                <button
                  type="button"
                  onClick={startSession}
                  disabled={!canStartSession || loading}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {isStarting ? <Loader2 size={15} className="animate-spin" /> : <QrCode size={15} />}
                  {isStarting ? "Aguardando conexão..." : "Conectar / Gerar QR Code"}
                </button>
              )}
              {isConnected && (
                <button
                  type="button"
                  onClick={() => setShowDisconnectModal(true)}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-black uppercase tracking-wider text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                >
                  <WifiOff size={14} />
                  Desconectar WhatsApp
                </button>
              )}
            </div>
          </div>

          {/* Card de Destinatários (visualização compacta) */}
          <div className="flex flex-col rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Destinatários</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">Números que recebem pedidos</h2>
                <p className="mt-1 text-xs text-slate-400">
                  {savedRecipients.length === 0
                    ? "Nenhum número cadastrado ainda"
                    : `${savedRecipients.filter((r) => r.active).length} ativo(s) de ${savedRecipients.length} cadastrado(s)`}
                </p>
              </div>
              <button
                type="button"
                onClick={openRecipientsModal}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
              >
                <Pencil size={13} />
                Gerenciar
              </button>
            </div>

            <div className="mt-5 flex-1">
              {savedRecipients.length === 0 ? (
                <button
                  type="button"
                  onClick={openRecipientsModal}
                  className="w-full rounded-2xl border border-dashed border-slate-200 p-10 text-center transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <Phone size={28} className="mx-auto text-slate-300" />
                  <p className="mt-3 text-sm font-bold text-slate-400">Nenhum número cadastrado</p>
                  <p className="mt-1 text-xs text-slate-400">Clique aqui ou em Gerenciar para adicionar</p>
                </button>
              ) : (
                <div className="grid gap-2">
                  {savedRecipients.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-2 w-2 shrink-0 rounded-full ${r.active ? "bg-emerald-400" : "bg-slate-300"}`} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800">{r.name || "Sem nome"}</p>
                          <p className="text-xs text-slate-400">{r.phone || "—"}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-black uppercase ${r.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                        {r.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={openRecipientsModal}
                    className="mt-1 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 py-3 text-xs font-bold text-slate-400 transition hover:border-slate-400 hover:text-slate-600"
                  >
                    <Plus size={13} /> Adicionar ou editar números
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Linha 2: Chat ── */}
        <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Chat monitorado</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">Conversas dos números cadastrados</h2>
            </div>
            <button
              type="button"
              onClick={() => fetchChat()}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200"
            >
              <RefreshCw size={14} /> Atualizar
            </button>
          </div>

          {savedRecipients.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <MessageCircle size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-400">Nenhum número salvo ainda</p>
              <p className="mt-1 text-xs text-slate-400">
                Cadastre e salve os destinatários acima para ver as conversas aqui
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] items-start">
              {/* Lista */}
              <div className="grid gap-2 content-start">
                {savedRecipients.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedPhone(r.phone)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedPhone === r.phone
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-sm font-black">{r.name || "Sem nome"}</p>
                    <p className="mt-0.5 text-xs opacity-60">{r.phone}</p>
                    {!r.active && (
                      <span className="mt-1.5 inline-block rounded-md bg-slate-200 px-2 py-0.5 text-[9px] font-black uppercase text-slate-500">
                        Inativo
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Painel de chat */}
              <div className="flex h-[600px] flex-col overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 min-w-0">
                <div className="border-b border-slate-100 bg-white px-5 py-4 shrink-0">
                  <p className="truncate text-sm font-black text-slate-900">
                    {selectedRecipient
                      ? `${selectedRecipient.name || "Sem nome"} • ${selectedRecipient.phone}`
                      : "Selecione um número à esquerda"}
                  </p>
                  {selectedRecipient && !isConnected && (
                    <p className="mt-0.5 text-xs font-bold text-amber-600">
                      WhatsApp desconectado — conecte para ver mensagens
                    </p>
                  )}
                </div>

                <div ref={chatContainerRef} className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden p-4 min-h-0">
                  {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm font-bold text-slate-400">
                      <MessageCircle size={24} className="text-slate-300" />
                      {!isConnected ? (
                        "Conecte o WhatsApp para ver mensagens"
                      ) : !selectedPhone ? (
                        "Selecione um número para ver o chat"
                      ) : chatNotFound ? (
                        <>
                          <span>Nenhuma conversa iniciada ainda</span>
                          <span className="text-[11px] font-medium text-slate-400">
                            O histórico aparecerá após a primeira mensagem ser enviada
                            para este número pela sessão atual do WhatsApp.
                          </span>
                        </>
                      ) : (
                        "Nenhuma mensagem ainda"
                      )}
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm break-words overflow-hidden ${
                          msg.fromMe
                            ? "bg-emerald-600 text-white font-medium"
                            : "border border-slate-200 bg-white text-slate-800"
                        }`}>
                          {msg.fromMe ? (
                            <p className="mb-1 text-[10px] font-bold text-emerald-200 text-right uppercase tracking-wider">Você</p>
                          ) : (
                            <p className="mb-1 text-[10px] font-bold text-slate-400 text-left uppercase tracking-wider">
                              {msg.sender || selectedRecipient?.name || "Contato"}
                            </p>
                          )}

                          {/* Renderização de Imagem / Sticker */}
                          {msg.mediaData && (msg.type === "image" || msg.type === "sticker") && (
                            <div className="mb-2 overflow-hidden rounded-xl bg-slate-100/10">
                              <img
                                src={msg.mediaData}
                                alt={msg.filename || "Imagem"}
                                className="max-h-60 max-w-full rounded-lg object-contain cursor-pointer transition hover:opacity-90"
                                onClick={() => {
                                  const newWindow = window.open();
                                  if (newWindow) {
                                    newWindow.document.write(`<img src="${msg.mediaData}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                                  }
                                }}
                              />
                            </div>
                          )}

                          {/* Renderização de Vídeo */}
                          {msg.mediaData && msg.type === "video" && (
                            <div className="mb-2 overflow-hidden rounded-xl bg-black">
                              <video
                                src={msg.mediaData}
                                controls
                                className="max-h-60 w-full rounded-lg"
                              />
                            </div>
                          )}

                          {/* Renderização de Áudio / PTT */}
                          {msg.mediaData && (msg.type === "audio" || msg.type === "ptt") && (
                            <div className="mb-2 max-w-full">
                              <audio
                                src={msg.mediaData}
                                controls
                                className="w-full h-10 accent-slate-900 text-emerald-950 min-w-[200px]"
                              />
                            </div>
                          )}

                          {/* Renderização de Documento */}
                          {msg.mediaData && msg.type === "document" && (
                            <div className="mb-2">
                              <a
                                href={msg.mediaData}
                                download={msg.filename || "documento"}
                                className={`flex items-center gap-2 rounded-xl p-3 text-xs font-bold transition ${
                                  msg.fromMe
                                    ? "bg-white/10 text-white hover:bg-white/20"
                                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                                }`}
                              >
                                <FileText size={16} className="shrink-0" />
                                <span className="truncate flex-1">{msg.filename || "Documento"}</span>
                                <Download size={14} className="shrink-0 opacity-70" />
                              </a>
                            </div>
                          )}

                          {/* Mídia em processamento ou com erro de download */}
                          {!msg.mediaData && msg.type !== "chat" && (
                            <div className={`mb-2 flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold ${
                              msg.fromMe ? "bg-white/10 text-emerald-100" : "bg-slate-100 text-slate-500"
                            }`}>
                              <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                              <span>[Mídia não carregada ou expirada]</span>
                            </div>
                          )}

                          {/* Corpo da mensagem */}
                          {msg.type === "chat" ? (
                            <p className="whitespace-pre-wrap break-words">{msg.body || "Mensagem sem texto"}</p>
                          ) : (
                            msg.body && msg.body !== msg.filename && (
                              <p className="whitespace-pre-wrap break-words mt-1">{msg.body}</p>
                            )
                          )}

                          <p className={`mt-1 text-[10px] ${msg.fromMe ? "text-emerald-200/70 text-right" : "text-slate-400"}`}>
                            {new Date(msg.timestamp * 1000).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2 border-t border-slate-100 bg-white p-3">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) sendChatMessage(); }}
                    disabled={!selectedPhone || !isConnected}
                    placeholder={
                      isConnected
                        ? selectedPhone ? "Responder por aqui..." : "Selecione um número"
                        : "Conecte o WhatsApp para responder"
                    }
                    className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={sendChatMessage}
                    disabled={!selectedPhone || !chatInput.trim() || !isConnected}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:opacity-40"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
