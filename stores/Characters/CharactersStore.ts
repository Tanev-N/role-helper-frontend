import { makeAutoObservable, runInAction } from "mobx";
import {
  apiCharacters,
  Character,
  CharacterCreate,
  CharacterShort,
  CharacterUpdate,
} from "./api";

export class CharactersStore {
  private characters: CharacterShort[] = [];
  private isLoading: boolean = false;
  private characterDetails: Map<string, Character> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  public get getCharacters() {
    return this.characters;
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

  public async fetchCharacterById(id: string) {
    try {
      const response = await apiCharacters.getCharacterById(id);
      if (response.status === 200) {
        runInAction(() => {
          this.characterDetails.set(id, response.data);
        });
        return response.data;
      }
    } catch (e) {
      console.warn("CharactersStore: fetchCharacterById error", e);
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

  public async createCharacter(character: CharacterCreate) {
    try {
      const response = await apiCharacters.createCharacter(character);
      if (response.status === 201) {
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
        });
      }
    } catch (e) {
      console.warn("CharactersStore: createCharacter error", e);
    }
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
}
