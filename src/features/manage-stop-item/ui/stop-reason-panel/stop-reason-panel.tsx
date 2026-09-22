"use client";

import { AnimatePresence } from "framer-motion";

import type { MenuItem, MenuItemsFilter } from "@/entities/menu-item";

import {
  selectCloseStopPanel,
  selectIsStopPanelOpen,
  selectStopPanelMode,
  useStopPanelStore,
} from "../../model/stop-panel-store";
import { StopReasonModal } from "../stop-reason-modal";

interface StopReasonPanelProps {
  filters: MenuItemsFilter;
  menuItem: MenuItem | null;
}

export function StopReasonPanel({ filters, menuItem }: StopReasonPanelProps) {
  const closeStopPanel = useStopPanelStore(selectCloseStopPanel);
  const isOpen = useStopPanelStore(selectIsStopPanelOpen);
  const mode = useStopPanelStore(selectStopPanelMode);

  return (
    <AnimatePresence>
      {isOpen && menuItem ? (
        <StopReasonModal
          key={menuItem.id}
          filters={filters}
          menuItem={menuItem}
          mode={mode}
          onClose={closeStopPanel}
        />
      ) : null}
    </AnimatePresence>
  );
}
