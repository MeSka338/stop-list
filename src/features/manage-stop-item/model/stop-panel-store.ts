"use client";

import { create } from "zustand";

import type { MenuItem } from "@/entities/menu-item";

export type StopPanelMode = "create" | "edit";

interface StopPanelState {
  isOpen: boolean;
  mode: StopPanelMode | null;
  selectedItemId: string | null;
  openStopPanel: (menuItem: Pick<MenuItem, "id" | "status">) => void;
  closeStopPanel: () => void;
}

const CLOSED_PANEL_STATE = {
  isOpen: false,
  mode: null,
  selectedItemId: null,
} as const;

export const useStopPanelStore = create<StopPanelState>((set) => ({
  ...CLOSED_PANEL_STATE,
  openStopPanel: (menuItem) => {
    set({
      isOpen: true,
      mode: menuItem.status.kind === "stopped" ? "edit" : "create",
      selectedItemId: menuItem.id,
    });
  },
  closeStopPanel: () => {
    set(CLOSED_PANEL_STATE);
  },
}));

export const selectIsStopPanelOpen = (state: StopPanelState) => state.isOpen;
export const selectStopPanelMode = (state: StopPanelState) => state.mode;
export const selectSelectedMenuItemId = (state: StopPanelState) =>
  state.selectedItemId;
export const selectOpenStopPanel = (state: StopPanelState) =>
  state.openStopPanel;
export const selectCloseStopPanel = (state: StopPanelState) =>
  state.closeStopPanel;
