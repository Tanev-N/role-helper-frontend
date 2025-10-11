import axios from "axios";
import createEndpoint from "@/api/api";

export type Level =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

const apiCharactersUrl = {
  characters: createEndpoint("/characters"),
  characterById: (id: number) => createEndpoint(`/characters/${id}`),
};

export const apiCharacters = {
  async getCharacters() {
    return await axios.get(apiCharactersUrl.characters);
  },
  async getCharacterById(id: number) {
    return await axios.get(apiCharactersUrl.characterById(id));
  },
  async createCharacter(
    name: string,
    race: string,
    className: string,
    level: Level,
    strength: Level,
    dexterity: Level,
    constitution: Level,
    intelligence: Level,
    wisdom: Level,
    charisma: Level
  ) {
    return await axios.post(apiCharactersUrl.characters, {
      name,
      race,
      class: className,
      level,
      strength,
      dexterity,
      constitution,
      intelligence,
      wisdom,
      charisma,
    });
  },
  async deleteCharacter(id: number) {
    return await axios.delete(apiCharactersUrl.characterById(id));
  },
  async updateCharacter(
    id: number,
    name: string,
    race: string,
    className: string,
    level: Level,
    strength: Level,
    dexterity: Level,
    constitution: Level,
    intelligence: Level,
    wisdom: Level,
    charisma: Level
  ) {
    return await axios.put(apiCharactersUrl.characterById(id), {
      name,
      race,
      class: className,
      level,
      strength,
      dexterity,
      constitution,
      intelligence,
      wisdom,
      charisma,
    });
  },
};
