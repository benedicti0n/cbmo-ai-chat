import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SidebarState = {
    isOpen: boolean;
    toggleSidebar: () => void;
    setOpen: (isOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            isOpen: false,
            toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
            setOpen: (isOpen) => set({ isOpen }),
        }),
        {
            name: "sidebar-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Close sidebar on medium screens
if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');

    const handleResize = (e: MediaQueryListEvent) => {
        if (e.matches) {
            useSidebarStore.getState().setOpen(false);
        }
    };

    // Initial check
    if (mediaQuery.matches) {
        useSidebarStore.getState().setOpen(false);
    }

    // Listen for changes
    mediaQuery.addEventListener('change', handleResize);

    // Cleanup
    window.addEventListener('beforeunload', () => {
        mediaQuery.removeEventListener('change', handleResize);
    });
}