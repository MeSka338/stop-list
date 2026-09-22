export const MOCK_API_DELAY_MS = 600;
export const MOCK_API_ERROR_RATE = 0.2;

export class MockApiUnavailableError extends Error {
  constructor() {
    super("Сервер временно недоступен. Попробуйте ещё раз");
    this.name = "MockApiUnavailableError";
  }
}

const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

export const simulateMockApiRequest = async () => {
  await delay(MOCK_API_DELAY_MS);

  if (Math.random() < MOCK_API_ERROR_RATE) {
    throw new MockApiUnavailableError();
  }
};
