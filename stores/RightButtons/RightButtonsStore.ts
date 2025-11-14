import { makeAutoObservable, runInAction } from "mobx";

export interface RightButton {
  id: string;
  icon: any;
  onPress: () => void;
  path?: string; // для навигационных кнопок (старый функционал)
}

export class RightButtonsStore {
  private buttons: RightButton[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public get getButtons(): RightButton[] {
    return this.buttons;
  }

  public addButton(button: RightButton) {
    console.log("[RightButtonsStore] addButton вызван:", button.id);
    runInAction(() => {
      // Проверяем, нет ли уже кнопки с таким id
      const existingButton = this.buttons.find((b) => b.id === button.id);
      if (!existingButton) {
        this.buttons.push(button);
        console.log("[RightButtonsStore] Кнопка добавлена. Всего кнопок:", this.buttons.length);
      } else {
        console.log("[RightButtonsStore] Кнопка с таким id уже существует, обновляем");
        // Обновляем существующую кнопку
        const index = this.buttons.findIndex((b) => b.id === button.id);
        this.buttons[index] = button;
      }
    });
  }

  public removeButton(buttonId: string) {
    console.log("[RightButtonsStore] removeButton вызван:", buttonId);
    runInAction(() => {
      const beforeCount = this.buttons.length;
      this.buttons = this.buttons.filter((b) => b.id !== buttonId);
      const afterCount = this.buttons.length;
      console.log("[RightButtonsStore] Кнопка удалена. Было:", beforeCount, "Стало:", afterCount);
    });
  }

  public clearButtons() {
    runInAction(() => {
      this.buttons = [];
    });
  }

  public setButtons(buttons: RightButton[]) {
    runInAction(() => {
      this.buttons = buttons;
    });
  }
}

