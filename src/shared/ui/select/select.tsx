"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: readonly SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  buttonClassName?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  placeholder: string;
  onBlur?: () => void;
}

export function Select({
  options,
  value,
  onValueChange,
  ariaDescribedBy,
  ariaInvalid,
  buttonClassName,
  className,
  disabled,
  id,
  placeholder,
  onBlur,
}: SelectProps) {
  const generatedId = useId();
  const listboxId = `${id ?? generatedId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex === -1 ? null : options[selectedIndex];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, onBlur]);

  const openMenu = () => {
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    onBlur?.();
  };

  const selectOption = (option: SelectOption) => {
    onValueChange(option.value);
    closeMenu();
  };

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      <button
        aria-activedescendant={
          isOpen ? `${listboxId}-option-${highlightedIndex}` : undefined
        }
        aria-controls={listboxId}
        aria-describedby={ariaDescribedBy}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={ariaInvalid}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-neutral-300 bg-white px-3 text-left text-sm text-neutral-900 transition outline-none hover:border-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-red-500 aria-invalid:ring-red-100",
          buttonClassName,
        )}
        disabled={disabled}
        id={id}
        role="combobox"
        type="button"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();

            if (!isOpen) {
              openMenu();
              return;
            }

            const direction = event.key === "ArrowDown" ? 1 : -1;
            setHighlightedIndex(
              (current) =>
                (current + direction + options.length) % options.length,
            );
          }

          if ((event.key === "Enter" || event.key === " ") && isOpen) {
            event.preventDefault();
            const option = options[highlightedIndex];

            if (option) {
              selectOption(option);
            }
          }

          if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            closeMenu();
          }

          if (event.key === "Tab" && isOpen) {
            closeMenu();
          }
        }}
      >
        <span className={cn(!selectedOption && "text-neutral-500")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-neutral-500 transition-transform",
            isOpen && "rotate-180",
          )}
          fill="none"
          viewBox="0 0 16 16"
        >
          <path
            d="m4 6 4 4 4-4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.ul
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-label={placeholder}
            className="absolute z-50 mt-2 max-h-64 w-full origin-top overflow-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl"
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            id={listboxId}
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            role="listbox"
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  aria-selected={isSelected}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-700 outline-none",
                    isHighlighted && "bg-neutral-100 text-neutral-950",
                    isSelected && "font-medium text-neutral-950",
                  )}
                  id={`${listboxId}-option-${index}`}
                  key={option.value}
                  role="option"
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span>{option.label}</span>
                  {isSelected ? (
                    <svg
                      aria-hidden="true"
                      className="size-4 shrink-0 text-red-600"
                      fill="none"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="m3.5 8 3 3 6-6"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.75"
                      />
                    </svg>
                  ) : null}
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
