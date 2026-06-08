import toast from "react-hot-toast";

export const confirmAction = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const toastId = toast.custom((t) => (
      <div className={`${t.visible ? 'animate-in fade-in zoom-in' : 'animate-out fade-out zoom-out'} max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex flex-col ring-1 ring-black ring-opacity-5 p-5 duration-200`}>
        <div className="mb-4">
          <p className="text-sm font-bold text-slate-900">{message}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.remove(t.id);
              resolve(false);
            }}
            className="flex-1 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 bg-brand-50 hover:bg-brand-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              toast.remove(t.id);
              resolve(true);
            }}
            className="flex-1 rounded-xl px-3 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  });
};
