import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      setTheme: (theme: Theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Sync with system preference
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    const theme = e.matches ? 'dark' : 'light';
    document.documentElement.className = theme;
  };

  // Initial theme setup
  const storedTheme = localStorage.getItem('theme-storage');
  const initialTheme = storedTheme
    ? JSON.parse(storedTheme).state.theme
    : (mediaQuery.matches ? 'dark' : 'light');

  document.documentElement.className = initialTheme;

  // Listen for system theme changes
  mediaQuery.addEventListener('change', handleSystemThemeChange);
}
