import { makeAutoObservable, runInAction } from "mobx";
import {
  apiCharacters,
  Character,
  CharacterCreate,
  CharacterShort,
  CharacterSkill,
  CharacterUpdate,
} from "./api";

// Черновик формы создания персонажа с текстовыми значениями,
// чтобы легко восстанавливать состояние полей ввода после навигации.
export type CharacterFormDraft = {
  name: string;
  race: string;
  level: string;
  className: string;
  alignment: string;
  strength: string;
  dexterity: string;
  constitution: string;
  intelligence: string;
  wisdom: string;
  charisma: string;
  photo: string;
  initiative: string;
  armorClass: string;
  speed: string;
  hitPoints: string;
  tempHitPoints: string;
  hitDice: string;
  background: string;
  features: string;
  skills: CharacterSkill[];
  selectedArmorId: string | null;
  selectedWeaponId: string | null;
};

export class CharactersStore {
  private characters: CharacterShort[] = [];
  private isLoading: boolean = false;
  private characterDetails: Map<string, Character> = new Map();
  private characterDraft: CharacterFormDraft | null = null;
  private characterFetchInFlight: Set<string> = new Set();

  constructor() {
    makeAutoObservable(this);
  }

  public get getCharacters() {
    return this.characters;
  }

  public get getCharacterDraft() {
    return this.characterDraft;
  }

  private setCharacters(characters: CharacterShort[]) {
    this.characters = characters;
  }

  public get IsLoading() {
    return this.isLoading;
  }

  private setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  public saveCharacterDraft(draft: CharacterFormDraft | null) {
    this.characterDraft = draft;
  }

  public clearCharacterDraft() {
    this.characterDraft = null;
  }

  public getCharacterById(id: string): Character | undefined {
    return this.characterDetails.get(id);
  }

  public async fetchCharacters() {
    if (this.isLoading) return;

    this.setIsLoading(true);
    try {
      const response = await apiCharacters.getCharacters();
      if (response.status === 200) {
        runInAction(() => {
          this.setCharacters(response.data);
        });
      }
    } catch (e) {
      console.warn("CharactersStore: fetchCharacters error", e);
    } finally {
      runInAction(() => {
        this.setIsLoading(false);
      });
    }
  }

  public async fetchCharacterById(id: string, isMaster: boolean = false) {
    // защита от шторма запросов: не дергаем один и тот же id параллельно/постоянно
    if (this.characterFetchInFlight.has(id)) return this.getCharacterById(id);
    this.characterFetchInFlight.add(id);

    this.setIsLoading(true);
    try {
      const response = await apiCharacters.getCharacterById(id);
      if (response.status === 200) {
        runInAction(() => {
          this.characterDetails.set(id, response.data);
          // Добавляем краткую версию, если ее еще нет в списке
          const exists = this.characters.some((char) => char.id === id);
          if (!exists) {
            this.setCharacters([
              ...this.characters,
              {
                id: response.data.id,
                name: response.data.name,
                photo: response.data.photo,
              },
            ]);
          }
        });
        return response.data;
      }
    } catch (e) {
      console.warn("CharactersStore: fetchCharacterById error", e);
    } finally {
      runInAction(() => {
        this.setIsLoading(false);
      });
      this.characterFetchInFlight.delete(id);
    }
    return undefined;
  }

  public async deleteCharacter(id: string) {
    try {
      const response = await apiCharacters.deleteCharacter(id);
      if (response.status === 204) {
        runInAction(() => {
          this.setCharacters(this.characters.filter((char) => char.id !== id));
          this.characterDetails.delete(id);
        });
      }
    } catch (e) {
      console.warn("CharactersStore: deleteCharacter error", e);
    }
  }

  public async createCharacter(character: CharacterCreate): Promise<Character | undefined> {
    try {
      const response = await apiCharacters.createCharacter(character);
      if (response.status === 201) {
        let createdCharacter: Character | undefined;
        runInAction(() => {
          // Добавляем краткую версию в список
          const characterShort: CharacterShort = {
            id: response.data.id,
            name: response.data.name,
            photo: response.data.photo,
          };
          this.setCharacters([...this.characters, characterShort]);
          // Сохраняем полную версию
          this.characterDetails.set(response.data.id, response.data);
          createdCharacter = response.data;
        });
        return createdCharacter;
      }
    } catch (e) {
      console.warn("CharactersStore: createCharacter error", e);
    }
    return undefined;
  }

  public async updateCharacter(id: string, character: CharacterUpdate) {
    try {
      const response = await apiCharacters.updateCharacter(id, character);
      if (response.status === 200) {
        runInAction(() => {
          // Обновляем краткую версию в списке
          this.setCharacters(
            this.characters.map((char) =>
              char.id === id
                ? {
                    id: response.data.id,
                    name: response.data.name,
                    photo: response.data.photo,
                  }
                : char
            )
          );
          // Обновляем полную версию
          this.characterDetails.set(id, response.data);
        });
      }
    } catch (e) {
      console.warn("CharactersStore: updateCharacter error", e);
    }
  }

  public async uploadPhoto(id: string, photoUri: string): Promise<string | null> {
    try {
      console.log("CharactersStore.uploadPhoto called with id:", id, "uri:", photoUri);
      const response = await apiCharacters.uploadPhoto(id, photoUri);
      console.log("uploadPhoto response:", response.status, response.data);
      console.log("uploadPhoto response.data structure:", JSON.stringify(response.data, null, 2));
      
      // Проверяем оба возможных пути: response.data.photo_url и response.data.data.photo_url
      const photoUrl = response.data?.photo_url || response.data?.data?.photo_url;
      
      if (response.status === 200 && photoUrl) {
        console.log("CharactersStore: extracted photoUrl:", photoUrl);
        runInAction(() => {
          // Обновляем фото в краткой версии - создаем новый массив для принудительного обновления
          const updatedCharacters = this.characters.map((char) =>
            char.id === id
              ? {
                  ...char,
                  photo: photoUrl,
                }
              : char
          );
          this.setCharacters([...updatedCharacters]);
          
          // Обновляем фото в полной версии
          const character = this.characterDetails.get(id);
          if (character) {
            character.photo = photoUrl;
            this.characterDetails.set(id, { ...character });
          }
        });
        console.log("CharactersStore: returning photoUrl:", photoUrl);
        return photoUrl;
      }
      console.warn("CharactersStore: uploadPhoto - no photo_url in response");
      return null;
    } catch (e) {
      console.warn("CharactersStore: uploadPhoto error", e);
      return null;
    }
  }

  /**
   * Обновление персонажа данными, полученными не из /characters/{id},
   * например, когда /players возвращает вложенный объект character.
   * Делает "мягкое" обновление и краткого списка, и details-кэша.
   */
  public updateCharacterFromAPI(character: Character) {
    runInAction(() => {
      const charId = String(character.id);
      const characterCopy: Character = { ...character, id: charId };

      this.characterDetails.set(charId, characterCopy);

      const short: CharacterShort = {
        id: charId,
        name: characterCopy.name,
        photo: characterCopy.photo,
      };

      const existingIndex = this.characters.findIndex((c) => c.id === charId);
      if (existingIndex !== -1) {
        const next = [...this.characters];
        next[existingIndex] = { ...next[existingIndex], ...short };
        this.setCharacters(next);
      } else {
        this.setCharacters([...this.characters, short]);
      }
    });
  }
}
