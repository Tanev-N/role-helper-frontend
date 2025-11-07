import { apiCharacters } from "./api";
import { makeAutoObservable, runInAction } from "mobx";
import { Level } from "./api";

interface Character {
  id: number;
  name: string;
  class: string;
  level: Level;
  race: string;
  strength: Level;
  dexterity: Level;
  constitution: Level;
  intelligence: Level;
  wisdom: Level;
  charisma: Level;
  photo: string;
}

export class CharactersStore {
  private characters: Character[] = [];
  private isLoading: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }
  public get getCharacters() {
    return this.characters;
  }
  private setCharacters(characters: Character[]) {
    this.characters = characters;
  }

  public get IsLoading() {
    return this.isLoading;
  }

  private setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  public async fetchCharacters() {
    if (this.isLoading) return;
    if (this.characters && this.characters.length > 0) return;

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

  public async deleteCharacter(id: number) {
    try {
      const response = await apiCharacters.deleteCharacter(id);
      if (response.status === 204) {
        runInAction(() => {
          this.setCharacters(this.characters.filter((char) => char.id !== id));
        });
      }
    } catch (e) {
      console.warn("CharactersStore: deleteCharacter error", e);
    }
  }

  public async createCharacter(character: Character) {
    try {
      const response = await apiCharacters.createCharacter(
        character.name,
        character.race,
        character.class,
        character.level,
        character.strength,
        character.dexterity,
        character.constitution,
        character.intelligence,
        character.wisdom,
        character.charisma
      );
      if (response.status === 201) {
        runInAction(() => {
          this.setCharacters([...this.characters, response.data]);
        });
      }
    } catch (e) {
      console.warn("CharactersStore: createCharacter error", e);
    }
  }
  public async updateCharacter(character: Character) {
    try {
      const response = await apiCharacters.updateCharacter(
        character.id,
        character.name,
        character.race,
        character.class,
        character.level,
        character.strength,
        character.dexterity,
        character.constitution,
        character.intelligence,
        character.wisdom,
        character.charisma
      );
      if (response.status === 200) {
        runInAction(() => {
          this.setCharacters(
            this.characters.map((char) =>
              char.id === character.id ? response.data : char
            )
          );
        });
      }
    } catch (e) {
      console.warn("CharactersStore: updateCharacter error", e);
    }
  }
}
