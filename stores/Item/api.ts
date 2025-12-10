import createEndpoint from "@/api/api";
import axios from "axios";

// Общие структуры модификаторов предметов
export interface ItemModifier {
  value: string;
  stat: string;
}

// ---- Оружие (по openapi /api/weapon) ----
export interface Weapon {
  id: number;
  user_id?: number;
  name: string;
  type?: string;
  damage?: string;
  modifier?: string;
  cost?: string;
  rarity?: string;
  grip?: string;
  range_meters?: string;
  weight?: string;
  unique_stats?: string;
  charges?: string;
  modifiers?: string; // openapi: string
  photo?: string;
}

export type WeaponCreate = Omit<Weapon, "id" | "user_id"> & { name: string };
export type WeaponUpdate = Partial<Omit<Weapon, "id" | "user_id">>;

// ---- Броня (по openapi /api/armor) ----
export interface Armor {
  id: number;
  user_id?: number;
  name: string;
  type?: string;
  armor_class?: number;
  modifier?: string;
  cost?: string;
  rarity?: string;
  stealth_disadvantage?: string;
  strength_requirement?: string;
  weight?: string;
  unique_stats?: string;
  charges?: string;
  modifiers?: string; // openapi: string
  photo?: string;
}

export type ArmorCreate = Omit<Armor, "id" | "user_id"> & { name: string };
export type ArmorUpdate = Partial<Omit<Armor, "id" | "user_id">>;

const apiItemsUrl = {
  weapons: createEndpoint("/weapon"),
  weaponById: (id: number) => createEndpoint(`/weapon/${id}`),
  armor: createEndpoint("/armor"),
  armorById: (id: number) => createEndpoint(`/armor/${id}`),
};

export const apiWeapons = {
  async getWeapons(): Promise<{ status: number; data: Weapon[] }> {
    const response = await axios.get(apiItemsUrl.weapons);
    return { status: response.status, data: response.data };
  },

  async getWeaponById(id: number): Promise<{ status: number; data: Weapon }> {
    const response = await axios.get(apiItemsUrl.weaponById(id));
    return { status: response.status, data: response.data };
  },

  async createWeapon(weapon: WeaponCreate): Promise<{ status: number; data: Weapon }> {
    const response = await axios.post(apiItemsUrl.weapons, weapon);
    return { status: response.status, data: response.data };
  },

  async updateWeapon(id: number, weapon: WeaponUpdate): Promise<{ status: number; data: Weapon }> {
    const response = await axios.put(apiItemsUrl.weaponById(id), weapon);
    return { status: response.status, data: response.data };
  },

  async deleteWeapon(id: number): Promise<{ status: number }> {
    const response = await axios.delete(apiItemsUrl.weaponById(id));
    return { status: response.status };
  },
};

export const apiArmor = {
  async getArmor(): Promise<{ status: number; data: Armor[] }> {
    const response = await axios.get(apiItemsUrl.armor);
    return { status: response.status, data: response.data };
  },

  async getArmorById(id: number): Promise<{ status: number; data: Armor }> {
    const response = await axios.get(apiItemsUrl.armorById(id));
    return { status: response.status, data: response.data };
  },

  async createArmor(armor: ArmorCreate): Promise<{ status: number; data: Armor }> {
    const response = await axios.post(apiItemsUrl.armor, armor);
    return { status: response.status, data: response.data };
  },

  async updateArmor(id: number, armor: ArmorUpdate): Promise<{ status: number; data: Armor }> {
    const response = await axios.put(apiItemsUrl.armorById(id), armor);
    return { status: response.status, data: response.data };
  },

  async deleteArmor(id: number): Promise<{ status: number }> {
    const response = await axios.delete(apiItemsUrl.armorById(id));
    return { status: response.status };
  },
};

