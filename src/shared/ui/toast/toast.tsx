"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { create } from "zustand";

interface ToastMessage {
  id: number;
  message: string;
}

interface ToastState {
  toast: ToastMessage | null;
  dismiss: (id: number) => void;
  show: (message: string) => void;
}

let nextToastId = 0;

const useToastStore = create<ToastState>((set) => ({
  toast: null,
  dismiss: (id) =>
    set((state) => (state.toast?.id === id ? { toast: null } : state)),
  show: (message) => {
    nextToastId += 1;
    set({ toast: { id: nextToastId, message } });
  },
}));

export const showErrorToast = (message: string) => {
  useToastStore.getState().show(message);
};

export function ToastViewport() {
  const toast = useToastStore((state) => state.toast);
  const dismiss = useToastStore((state) => state.dismiss);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => dismiss(toast.id), 5_000);

    return () => window.clearTimeout(timeout);
  }, [dismiss, toast]);

  return (
    <div
      aria-atomic="true"
      aria-live="assertive"
      className="pointer-events-none fixed top-5 right-5 z-[70] w-[min(24rem,calc(100vw-2.5rem))]"
    >
      <AnimatePresence mode="wait">
        {toast ? (
          <motion.div
            key={toast.id}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-800 shadow-xl"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: -8 }}
            role="alert"
          >
            <p>{toast.message}</p>
            <button
              aria-label="Закрыть уведомление"
              className="shrink-0 text-lg leading-none text-neutral-500 hover:text-neutral-950"
              type="button"
              onClick={() => dismiss(toast.id)}
            >
              ×
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
