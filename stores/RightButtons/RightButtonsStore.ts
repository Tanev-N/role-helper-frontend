import { makeAutoObservable } from "mobx";

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
    // Проверяем, нет ли уже кнопки с таким id
    if (!this.buttons.find((b) => b.id === button.id)) {
      this.buttons.push(button);
    }
  }

  public removeButton(buttonId: string) {
    this.buttons = this.buttons.filter((b) => b.id !== buttonId);
  }

  public clearButtons() {
    this.buttons = [];
  }

  public setButtons(buttons: RightButton[]) {
    this.buttons = buttons;
  }
}

