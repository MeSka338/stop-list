export const getMutationErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => (error instanceof Error ? error.message : fallbackMessage);
