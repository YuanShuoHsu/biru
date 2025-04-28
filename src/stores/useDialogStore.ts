import { create } from "zustand";

interface DialogOptions {
  open: boolean;
  buttonText?: string;
  title?: string;
  contentText?: string;
  content?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

interface DialogState extends DialogOptions {
  setDialog: (options: DialogOptions) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  open: false,
  buttonText: "",
  title: "",
  contentText: "",
  content: null,
  cancelText: "",
  confirmText: "",
  onCancel: undefined,
  onConfirm: undefined,
  setDialog: (options) =>
    set((state) => ({
      ...state,
      ...options,
    })),
}));
