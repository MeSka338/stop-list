"use client";

import { AnimatePresence, motion } from "framer-motion";

export type StopUntilMode = "end-of-shift" | "specific-time";

interface StopUntilFieldProps {
  dateTimeValue: string;
  disabled?: boolean;
  errorMessage?: string;
  max: string;
  min: string;
  mode: StopUntilMode;
  stepMinutes: number;
  onDateTimeChange: (value: string) => void;
  onModeChange: (mode: StopUntilMode) => void;
}

export function StopUntilField({
  dateTimeValue,
  disabled,
  errorMessage,
  max,
  min,
  mode,
  stepMinutes,
  onDateTimeChange,
  onModeChange,
}: StopUntilFieldProps) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-neutral-800">
        Срок остановки
      </legend>
      <div className="mt-3 grid gap-3">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 p-4 has-checked:border-neutral-950 has-checked:bg-neutral-50">
          <input
            checked={mode === "end-of-shift"}
            className="mt-0.5 size-4 accent-neutral-950"
            disabled={disabled}
            name="until-mode"
            type="radio"
            onChange={() => onModeChange("end-of-shift")}
          />
          <span>
            <span className="block text-sm font-medium text-neutral-900">
              До конца смены
            </span>
            <span className="mt-0.5 block text-xs text-neutral-500">
              Без конкретного времени возвращения
            </span>
          </span>
        </label>

        <label className="cursor-pointer rounded-lg border border-neutral-200 p-4 has-checked:border-neutral-950 has-checked:bg-neutral-50">
          <span className="flex items-start gap-3">
            <input
              checked={mode === "specific-time"}
              className="mt-0.5 size-4 accent-neutral-950"
              disabled={disabled}
              name="until-mode"
              type="radio"
              onChange={() => onModeChange("specific-time")}
            />
            <span>
              <span className="block text-sm font-medium text-neutral-900">
                Указать время
              </span>
              <span className="mt-0.5 block text-xs text-neutral-500">
                Не более 24 часов, шаг {stepMinutes} минут
              </span>
            </span>
          </span>

          <AnimatePresence initial={false}>
            {mode === "specific-time" ? (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                className="overflow-hidden"
                exit={{ height: 0, opacity: 0 }}
                initial={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <input
                  aria-describedby={
                    errorMessage ? "stop-until-error" : undefined
                  }
                  aria-invalid={Boolean(errorMessage)}
                  className="mt-4 h-11 w-full cursor-pointer rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 aria-invalid:border-red-500 aria-invalid:ring-red-100"
                  disabled={disabled}
                  id="stop-until"
                  max={max}
                  min={min}
                  step={stepMinutes * 60}
                  type="datetime-local"
                  value={dateTimeValue}
                  onClick={(event) => {
                    const { currentTarget } = event;

                    try {
                      currentTarget.showPicker();
                    } catch {
                      currentTarget.focus();
                    }
                  }}
                  onChange={(event) => onDateTimeChange(event.target.value)}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </label>
      </div>
      {errorMessage ? (
        <p className="mt-1.5 text-sm text-red-600" id="stop-until-error">
          {errorMessage}
        </p>
      ) : null}
    </fieldset>
  );
}
