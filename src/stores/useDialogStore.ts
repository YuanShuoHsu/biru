import { create } from "zustand";

interface DialogOptions {
  cancelText: string;
  confirmDisabled?: boolean;
  confirmText: string;
  content?: React.ReactNode;
  contentText?: string;
  onCancel?: () => Promise<void>;
  onConfirm?: () => Promise<void>;
  open: boolean;
  title: string;
}

const initialState: DialogOptions = {
  cancelText: "",
  confirmDisabled: false,
  confirmText: "",
  content: null,
  contentText: "",
  onCancel: undefined,
  onConfirm: undefined,
  open: false,
  title: "",
};

interface DialogState extends DialogOptions {
  resetDialog: () => void;
  setDialog: (options: DialogOptions) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  ...initialState,
  resetDialog: () => set(() => ({ ...initialState })),
  setDialog: (options) =>
    set((state) => ({
      ...state,
      ...options,
    })),
}));
