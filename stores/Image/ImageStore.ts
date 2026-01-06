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
    try {
      const prompt = `Создай фентези персонажа. Расса: ${characterRace} Класс: ${characterClass}. Имя персонажа: ${characterName}. Прошлое персонажа: ${characterBackground}. Особенности персонажа: ${characterFeatures}`;
      const response = await apiImage.generateImage(prompt);
      if (response.status === 200) {
        return response.data.img_path;
      } else {
        // При ошибке (включая 500) возвращаем null для использования дефолтного изображения
        return null;
      }
    } catch (error) {
      // На всякий случай обрабатываем любые неожиданные ошибки
      console.warn("ImageStore: generateCharacterImage error", error);
      return null;
    }
  }

  async generateWorldImage(worldName: string, worldDescription: string) {
    try {
      const prompt = `Создай пейзайж местности. Она называется ${worldName}. Описание местности: ${worldDescription}. NO HUMAN`;
      const response = await apiImage.generateImage(prompt);
      if (response.status === 200) {
        return response.data.img_path;
      } else {
        // При ошибке (включая 500) возвращаем null для использования дефолтного изображения
        return null;
      }
    } catch (error) {
      // На всякий случай обрабатываем любые неожиданные ошибки
      console.warn("ImageStore: generateWorldImage error", error);
      return null;
    }
  }

  async generateItemImage(itemName: string, itemType: ItemType) {
    try {
      const prompt = `Создай средневековый предмет '${itemType}'. Название предмета '${itemType}': ${itemName}. Данный предмет из фентези мира, с красивым свечением и без фона. На изображении должно быть только предмет '${itemType}'. NO HUMAN`;
      const response = await apiImage.generateImage(prompt);
      if (response.status === 200) {
        return response.data.img_path;
      } else {
        // При ошибке (включая 500) возвращаем null для использования дефолтного изображения
        return null;
      }
    } catch (error) {
      // На всякий случай обрабатываем любые неожиданные ошибки
      console.warn("ImageStore: generateItemImage error", error);
      return null;
    }
  }
}
