/**
 * Filter / quantity store.
 *
 * Shared between the tier picker (which decides team price) and the
 * product grid (which renders that price on every card). Using Zustand
 * keeps the wiring trivial — both subscribe to the same state without
 * prop drilling.
 */
"use client";

import { create } from "zustand";

export interface FiltersState {
  /** Currently selected quantity tier (e.g. "t2"). null until user picks one. */
  selectedTierKey: string | null;
  /** Selected color bucket key (e.g. "red"). null = no filter. */
  colorBucket: string | null;
  /** Selected brand slug (e.g. "cv"). null = no filter. */
  brandSlug: string | null;
  /** Selected price-group segment (e.g. "all" | "A" | "B" | "C" | "D"). */
  segment: string;

  setTier: (tierKey: string | null) => void;
  setColorBucket: (bucket: string | null) => void;
  setBrandSlug: (slug: string | null) => void;
  setSegment: (segment: string) => void;
  clearFilters: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  selectedTierKey: null,
  colorBucket: null,
  brandSlug: null,
  segment: "all",
  setTier: (tierKey) => set({ selectedTierKey: tierKey }),
  setColorBucket: (bucket) => set({ colorBucket: bucket }),
  setBrandSlug: (slug) => set({ brandSlug: slug }),
  setSegment: (segment) => set({ segment }),
  clearFilters: () =>
    set({ colorBucket: null, brandSlug: null, segment: "all" }),
}));
