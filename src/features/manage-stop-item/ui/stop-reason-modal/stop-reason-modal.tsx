"use client";

import { motion } from "framer-motion";
import { useCallback, useRef } from "react";
import { Controller } from "react-hook-form";

import {
  STOP_REASONS,
  STOP_REASON_LABELS,
  STOP_TIME_STEP_MINUTES,
} from "@/entities/menu-item";
import type { MenuItem, MenuItemsFilter } from "@/entities/menu-item";
import { useDialogFocusTrap } from "@/shared/lib/use-dialog-focus-trap";
import { Button, Select, Spinner, StopUntilField } from "@/shared/ui";

import type { StopPanelMode } from "../../model/stop-panel-store";
import { useStopReasonForm } from "../../model/use-stop-reason-form";

interface StopReasonModalProps {
  filters: MenuItemsFilter;
  menuItem: MenuItem;
  mode: StopPanelMode | null;
  onClose: () => void;
}

const STOP_REASON_OPTIONS = STOP_REASONS.map((reason) => ({
  label: STOP_REASON_LABELS[reason],
  value: reason,
}));

export function StopReasonModal({
  filters,
  menuItem,
  mode,
  onClose,
}: StopReasonModalProps) {
  const panelRef = useRef<HTMLElement>(null);
  const {
    control,
    dateTimeLimits,
    errors,
    isPending,
    setUntilMode,
    setUntilValue,
    submitError,
    submitForm,
    untilMode,
    untilValue,
  } = useStopReasonForm(menuItem, filters);
  const closeModal = useCallback(() => {
    if (!isPending) {
      onClose();
    }
  }, [isPending, onClose]);

  useDialogFocusTrap({ panelRef, onEscape: closeModal });

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex justify-end bg-neutral-950/45"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <motion.aside
        ref={panelRef}
        animate={{ x: 0 }}
        aria-describedby="stop-panel-description"
        aria-labelledby="stop-panel-title"
        aria-modal="true"
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        exit={{ x: "100%" }}
        initial={{ x: "100%" }}
        role="dialog"
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold tracking-wider text-red-600 uppercase">
              {mode === "edit" ? "Редактирование" : "Новый стоп"}
            </p>
            <h2
              className="mt-1 text-xl font-semibold text-neutral-950"
              id="stop-panel-title"
            >
              {menuItem.title}
            </h2>
            <p
              className="mt-1 text-sm text-neutral-500"
              id="stop-panel-description"
            >
              Укажите причину и срок остановки позиции.
            </p>
          </div>
          <Button
            aria-label="Закрыть панель"
            className="size-10 shrink-0 px-0 text-xl"
            disabled={isPending}
            variant="ghost"
            onClick={closeModal}
          >
            ×
          </Button>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          noValidate
          onSubmit={(event) => void submitForm(event)}
        >
          <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
            <div>
              <label
                className="text-sm font-semibold text-neutral-800"
                htmlFor="stop-reason"
              >
                Причина остановки
              </label>
              <Controller
                control={control}
                name="reason"
                render={({ field }) => (
                  <Select
                    ariaDescribedBy={
                      errors.reason ? "stop-reason-error" : undefined
                    }
                    ariaInvalid={Boolean(errors.reason)}
                    buttonClassName="h-11"
                    className="mt-2"
                    disabled={isPending}
                    id="stop-reason"
                    options={STOP_REASON_OPTIONS}
                    placeholder="Выберите причину"
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    onValueChange={field.onChange}
                  />
                )}
              />
              {errors.reason ? (
                <p
                  className="mt-1.5 text-sm text-red-600"
                  id="stop-reason-error"
                >
                  {errors.reason.message}
                </p>
              ) : null}
            </div>

            <StopUntilField
              dateTimeValue={untilValue}
              disabled={isPending}
              errorMessage={errors.until?.message}
              max={dateTimeLimits.max}
              min={dateTimeLimits.min}
              mode={untilMode}
              stepMinutes={STOP_TIME_STEP_MINUTES}
              onDateTimeChange={setUntilValue}
              onModeChange={setUntilMode}
            />

            {submitError ? (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {submitError}
              </p>
            ) : null}
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
            <Button disabled={isPending} onClick={closeModal}>
              Отмена
            </Button>
            <Button disabled={isPending} type="submit" variant="primary">
              {isPending ? (
                <>
                  <Spinner />
                  Сохраняем
                </>
              ) : mode === "edit" ? (
                "Сохранить"
              ) : (
                "Добавить в стоп-лист"
              )}
            </Button>
          </div>
        </form>
      </motion.aside>
    </motion.div>
  );
}
