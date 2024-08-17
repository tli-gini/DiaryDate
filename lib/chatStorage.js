import { create } from "zustand";

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  setChatId: (id) => set({ chatId: id }),
  setUser: (user) => set({ user }),
}));
