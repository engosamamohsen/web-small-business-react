import { create } from "zustand";

interface DialogStoreType {
  isOpen: boolean;
  toggleShow: () => void;
  onClose: () => void;
  onOpen: () => void;
}

export const useDialogStore = create<DialogStoreType>((set) => ({
  isOpen: true,

  toggleShow: () => set((state) => ({ isOpen: !state.isOpen })),

  onClose: () => set({ isOpen: false }),

  onOpen: () => set({ isOpen: true }),
}));
