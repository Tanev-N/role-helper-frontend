import { makeAutoObservable } from "mobx";
import { apiImage } from "./api";
type ItemType = "Оружие" | "Броня";
export class ImageStore {
  constructor() {
    makeAutoObservable(this);
  }

  async generateCharacterImage(
    characterRace: string,
    characterClass: string,
    characterName: string,
    characterBackground: string,
    characterFeatures: string
  ) {
    const prompt = `Создай фентези персонажа. Расса: ${characterRace} Класс: ${characterClass}. Имя персонажа: ${characterName}. Прошлое персонажа: ${characterBackground}. Особенности персонажа: ${characterFeatures}`;
    const response = await apiImage.generateImage(prompt);
    if (response.status === 200) {
      return response.data.img_path;
    } else {
      return null;
    }
  }

  async generateWorldImage(worldName: string, worldDescription: string) {
    const prompt = `Создай пейзайж местности. Она называется ${worldName}. Описание местности: ${worldDescription}. NO HUMAN`;
    const response = await apiImage.generateImage(prompt);
    if (response.status === 200) {
      return response.data.img_path;
    } else {
      return null;
    }
  }

  async generateItemImage(itemName: string, itemType: ItemType) {
    const prompt = `Создай средневековый предмет '${itemType}'. Название предмета '${itemType}': ${itemName}. Данный предмет из фентези мира, с красивым свечением и без фона. На изображении должно быть только предмет '${itemType}'. NO HUMAN`;
    const response = await apiImage.generateImage(prompt);
    if (response.status === 200) {
      return response.data.img_path;
    } else {
      return null;
    }
  }
}
