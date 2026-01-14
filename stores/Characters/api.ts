import createEndpoint from "@/api/api";
import axios from "axios";

// Типы согласно api.yml
export interface CharacterSkill {
  name: string;
  modifier: number;
  proficient: boolean;
  ability: string;
}

export interface Equipment {
  name: string;
  description: string;
}

export interface Spell {
  name: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  alignment?: string;
  background?: string;
  player_name?: string;
  experience?: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  strength_mod: number;
  dexterity_mod: number;
  constitution_mod: number;
  intelligence_mod: number;
  wisdom_mod: number;
  charisma_mod: number;
  proficiency_bonus: number;
  initiative: number;
  armor_class?: number;
  speed?: number;
  hit_points?: number;
  max_hit_points?: number;
  temp_hit_points?: number;
  hit_dice?: string;
  strength_save?: boolean;
  dexterity_save?: boolean;
  constitution_save?: boolean;
  intelligence_save?: boolean;
  wisdom_save?: boolean;
  charisma_save?: boolean;
  skills?: CharacterSkill[];
  personality_traits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  proficiencies?: string;
  languages?: string;
  senses?: string;
  equipment?: Equipment[];
  spells?: Spell[];
  features?: string;
  photo?: string;
}

export interface CharacterShort {
  id: string;
  name: string;
  photo?: string;
}

export interface CharacterCreate {
  name: string;
  race: string;
  class: string;
  level: number;
  alignment?: string;
  background?: string;
  player_name?: string;
  experience?: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiency_bonus?: number;
  initiative?: number;
  armor_class?: number;
  speed?: number;
  hit_points?: number;
  max_hit_points?: number;
  temp_hit_points?: number;
  hit_dice?: string;
  strength_save?: boolean;
  dexterity_save?: boolean;
  constitution_save?: boolean;
  intelligence_save?: boolean;
  wisdom_save?: boolean;
  charisma_save?: boolean;
  skills?: CharacterSkill[];
  personality_traits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  proficiencies?: string;
  languages?: string;
  senses?: string;
  equipment?: Equipment[];
  spells?: Spell[];
  features?: string;
  photo?: string;
}

export interface CharacterUpdate {
  name?: string;
  race?: string;
  class?: string;
  level?: number;
  alignment?: string;
  background?: string;
  player_name?: string;
  experience?: number;
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  proficiency_bonus?: number;
  initiative?: number;
  armor_class?: number;
  speed?: number;
  hit_points?: number;
  max_hit_points?: number;
  temp_hit_points?: number;
  hit_dice?: string;
  strength_save?: boolean;
  dexterity_save?: boolean;
  constitution_save?: boolean;
  intelligence_save?: boolean;
  wisdom_save?: boolean;
  charisma_save?: boolean;
  skills?: CharacterSkill[];
  personality_traits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  proficiencies?: string;
  languages?: string;
  senses?: string;
  equipment?: Equipment[];
  spells?: Spell[];
  features?: string;
  photo?: string;
}

const apiCharactersUrl = {
  characters: createEndpoint("/characters"),
  characterById: (id: string) => createEndpoint(`/characters/${id}`),
  uploadPhoto: (id: string) => createEndpoint(`/characters/${id}/photo`),
};

export const apiCharacters = {
  async getCharacters(): Promise<{ status: number; data: CharacterShort[] }> {
    const response = await axios.get(apiCharactersUrl.characters);
    return {
      status: response.status,
      data: response.data,
    };
  },
  async getCharacterById(id: string): Promise<{ status: number; data: Character }> {
    const response = await axios.get(apiCharactersUrl.characterById(id));
    return {
      status: response.status,
      data: response.data,
    };
  },
  async createCharacter(character: CharacterCreate): Promise<{ status: number; data: Character }> {
    const response = await axios.post(apiCharactersUrl.characters, character);
    return {
      status: response.status,
      data: response.data,
    };
  },
  async deleteCharacter(id: string): Promise<{ status: number }> {
    const response = await axios.delete(apiCharactersUrl.characterById(id));
    return {
      status: response.status,
    };
  },
  async updateCharacter(id: string, character: CharacterUpdate): Promise<{ status: number; data: Character }> {
    const response = await axios.put(apiCharactersUrl.characterById(id), character);
    return {
      status: response.status,
      data: response.data,
    };
  },
  async uploadPhoto(id: string, photoUri: string, fileName?: string) {
    let file: File | Blob | any;
    
    // Проверяем, это blob URI (веб) или file/content URI (мобильный)
    if (photoUri.indexOf('blob:') === 0) {
      // Для веба: преобразуем blob URI в File
      try {
        const response = await fetch(photoUri);
        const blob = await response.blob();
        const isPng = blob.type.indexOf('png') !== -1;
        const fileExtension = isPng ? 'png' : 'jpg';
        const mimeType = blob.type || (fileExtension === 'png' ? 'image/png' : 'image/jpeg');
        const name = fileName || `photo.${fileExtension}`;
        file = new File([blob], name, { type: mimeType });
      } catch (error) {
        console.error("Error converting blob to File:", error);
        throw error;
      }
    } else {
      // Для мобильных платформ: используем объект с uri, type и name
      const fileExtension = photoUri.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
      const name = fileName || `photo.${fileExtension}`;
      
      file = {
        uri: photoUri,
        type: mimeType,
        name: name,
      };
    }
    
    const formData = new FormData();
    formData.append("photo", file);
    
    // Для мобильных устройств не устанавливаем Content-Type явно,
    // чтобы axios автоматически установил правильный boundary
    const headers: any = {};
    
    // Для веба устанавливаем Content-Type явно
    if (photoUri.indexOf('blob:') === 0) {
      headers["Content-Type"] = "multipart/form-data";
    }
    
    return await axios.post(apiCharactersUrl.uploadPhoto(id), formData, {
      headers,
    });
  },
};
