// stores/useSelectedRuasStore.ts
import { create } from "zustand";
import type { RuasJalanData } from "@/types/RuasJalan";

interface State {
    selectedRuas: RuasJalanData | null;
    setSelectedRuas: (ruas: RuasJalanData) => void;
}

export const useSelectedRuasStore = create<State>((set) => ({
    selectedRuas: null,
    setSelectedRuas: (ruas) => set({ selectedRuas: ruas }),
}));
