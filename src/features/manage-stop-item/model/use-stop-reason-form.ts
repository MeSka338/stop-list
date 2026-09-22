"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { STOP_TIME_STEP_MS, stopItemPayloadSchema } from "@/entities/menu-item";
import type {
  MenuItem,
  MenuItemsFilter,
  StopItemPayload,
} from "@/entities/menu-item";
import { ApiClientError } from "@/shared/api";
import {
  getNextDateTimeStep,
  isoToLocalDateTime,
  localDateTimeToIso,
  toLocalDateTime,
} from "@/shared/lib/date-time";
import type { StopUntilMode } from "@/shared/ui";

import { selectCloseStopPanel, useStopPanelStore } from "./stop-panel-store";
import { getMutationErrorMessage } from "./mutation-error";
import { useStopItem } from "./use-stop-item";

const DAY_MS = 24 * 60 * 60 * 1_000;

const getPanelDefaults = (menuItem: MenuItem): Partial<StopItemPayload> =>
  menuItem.status.kind === "stopped"
    ? {
        reason: menuItem.status.reason,
        until: menuItem.status.until,
      }
    : { until: null };

export function useStopReasonForm(
  menuItem: MenuItem,
  filters: MenuItemsFilter,
) {
  const closeStopPanel = useStopPanelStore(selectCloseStopPanel);
  const stopMutation = useStopItem(filters);
  const defaults = getPanelDefaults(menuItem);
  const [untilMode, setUntilModeState] = useState<StopUntilMode>(() =>
    defaults.until ? "specific-time" : "end-of-shift",
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dateTimeLimits] = useState(() => {
    const min = getNextDateTimeStep(STOP_TIME_STEP_MS);
    const maxTimestamp = Math.floor((Date.now() + DAY_MS) / STOP_TIME_STEP_MS);

    return {
      min: toLocalDateTime(min),
      max: toLocalDateTime(new Date(maxTimestamp * STOP_TIME_STEP_MS)),
    };
  });
  const form = useForm<StopItemPayload>({
    resolver: zodResolver(stopItemPayloadSchema),
    mode: "onBlur",
    defaultValues: defaults,
  });
  const until = useWatch({ control: form.control, name: "until" });

  const setUntilMode = (mode: StopUntilMode) => {
    setUntilModeState(mode);

    if (mode === "end-of-shift") {
      form.setValue("until", null, { shouldDirty: true, shouldValidate: true });
      form.clearErrors("until");
      return;
    }

    form.setValue(
      "until",
      getNextDateTimeStep(STOP_TIME_STEP_MS).toISOString(),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const submitForm = form.handleSubmit(async (payload) => {
    setSubmitError(null);

    if (untilMode === "specific-time" && payload.until === null) {
      form.setError("until", {
        type: "manual",
        message: "Укажите срок остановки",
      });
      return;
    }

    try {
      await stopMutation.mutateAsync({ id: menuItem.id, payload });
      closeStopPanel();
    } catch (error) {
      if (error instanceof ApiClientError) {
        const reasonMessage = error.fieldErrors?.reason?.[0];
        const untilMessage = error.fieldErrors?.until?.[0];

        if (reasonMessage) {
          form.setError("reason", { type: "server", message: reasonMessage });
        }

        if (untilMessage) {
          form.setError("until", { type: "server", message: untilMessage });
        }
      }

      setSubmitError(getMutationErrorMessage(error, "Не удалось сохранить позицию"));
    }
  });

  return {
    dateTimeLimits,
    errors: form.formState.errors,
    isPending: stopMutation.isPending,
    submitError,
    submitForm,
    untilMode,
    untilValue: isoToLocalDateTime(until),
    control: form.control,
    setUntilMode,
    setUntilValue: (value: string) =>
      form.setValue("until", localDateTimeToIso(value), {
        shouldDirty: true,
        shouldValidate: true,
      }),
  };
}
