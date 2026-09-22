const padDateTimePart = (value: number) => String(value).padStart(2, "0");

export const toLocalDateTime = (date: Date) =>
  `${date.getFullYear()}-${padDateTimePart(date.getMonth() + 1)}-${padDateTimePart(
    date.getDate(),
  )}T${padDateTimePart(date.getHours())}:${padDateTimePart(date.getMinutes())}`;

export const isoToLocalDateTime = (value: string | null) =>
  value ? toLocalDateTime(new Date(value)) : "";

export const localDateTimeToIso = (value: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const getNextDateTimeStep = (stepMs: number, now = Date.now()) => {
  const timestamp = Math.ceil((now + stepMs) / stepMs);

  return new Date(timestamp * stepMs);
};
