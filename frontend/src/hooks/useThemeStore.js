// import { create } from 'zustand'

// export const useThemeStore = create((set) => ({
//   theme: 'mytheme',

//   setTheme: (theme) => set((theme))
// }))

import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamophone-theme") || "mytheme",
  setTheme: (theme) => {
    localStorage.setItem("streamophone-theme", theme);
    set({ theme });
  },
}));