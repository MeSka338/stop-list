export class MenuItemNotFoundError extends Error {
  constructor(id: string) {
    super(`Позиция меню «${id}» не найдена`);
    this.name = "MenuItemNotFoundError";
  }
}

export class MenuItemCannotResumeError extends Error {
  constructor() {
    super("Позицию с нулевым остатком нельзя вернуть в продажу");
    this.name = "MenuItemCannotResumeError";
  }
}
