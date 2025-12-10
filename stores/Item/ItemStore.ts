import { makeAutoObservable, runInAction } from "mobx";
import {
    apiArmor,
    apiWeapons,
    Armor,
    ArmorCreate,
    ArmorUpdate,
    Weapon,
    WeaponCreate,
    WeaponUpdate,
} from "./api";

export class ItemStore {
  private weapons: Weapon[] = [];
  private armors: Armor[] = [];
  private isLoading = false;
  private error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // === Геттеры ===
  public get getWeapons(): Weapon[] {
    return this.weapons;
  }

  public get getArmors(): Armor[] {
    return this.armors;
  }

  public get IsLoading(): boolean {
    return this.isLoading;
  }

  public get getError(): string | null {
    return this.error;
  }

  // === Внутренние сеттеры ===
  private setWeapons(list: Weapon[]) {
    this.weapons = list ?? [];
  }

  private setArmors(list: Armor[]) {
    this.armors = list ?? [];
  }

  private setIsLoading(val: boolean) {
    this.isLoading = val;
  }

  private setError(message: string | null) {
    this.error = message;
  }

  // === Оружие ===
  public async fetchWeapons() {
    if (this.isLoading) return;
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiWeapons.getWeapons();
      if (response.status === 200) {
        runInAction(() => this.setWeapons(response.data));
      }
    } catch (e: any) {
      runInAction(() => {
        this.setError(e?.response?.data?.error || "Не удалось загрузить оружие");
      });
    } finally {
      runInAction(() => this.setIsLoading(false));
    }
  }

  public async createWeapon(payload: WeaponCreate) {
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiWeapons.createWeapon(payload);
      if (response.status === 201) {
        runInAction(() => this.setWeapons([...this.weapons, response.data]));
      }
      return response.data;
    } catch (e: any) {
      runInAction(() => {
        this.setError(e?.response?.data?.error || "Не удалось создать оружие");
      });
      throw e;
    } finally {
      runInAction(() => this.setIsLoading(false));
    }
  }

  public async updateWeapon(id: number, payload: WeaponUpdate) {
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiWeapons.updateWeapon(id, payload);
      if (response.status === 200) {
        runInAction(() =>
          this.setWeapons(
            this.weapons.map((w) => (w.id === id ? response.data : w))
          )
        );
      }
      return response.data;
    } catch (e: any) {
      runInAction(() => {
        this.setError(e?.response?.data?.error || "Не удалось обновить оружие");
      });
      throw e;
    } finally {
      runInAction(() => this.setIsLoading(false));
    }
  }

  public async deleteWeapon(id: number) {
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiWeapons.deleteWeapon(id);
      if (response.status === 204) {
        runInAction(() =>
          this.setWeapons(this.weapons.filter((w) => w.id !== id))
        );
      }
    } catch (e: any) {
      runInAction(() => {
        this.setError(e?.response?.data?.error || "Не удалось удалить оружие");
      });
      throw e;
    } finally {
      runInAction(() => this.setIsLoading(false));
    }
  }

  // === Броня ===
  public async fetchArmors() {
    if (this.isLoading) return;
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiArmor.getArmor();
      if (response.status === 200) {
        runInAction(() => this.setArmors(response.data));
      }
    } catch (e: any) {
      runInAction(() => {
        this.setError(e?.response?.data?.error || "Не удалось загрузить броню");
      });
    } finally {
      runInAction(() => this.setIsLoading(false));
    }
  }

  public async createArmor(payload: ArmorCreate) {
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiArmor.createArmor(payload);
      if (response.status === 201) {
        runInAction(() => this.setArmors([...this.armors, response.data]));
      }
      return response.data;
    } catch (e: any) {
      runInAction(() => {
        this.setError(e?.response?.data?.error || "Не удалось создать броню");
      });
      throw e;
    } finally {
      runInAction(() => this.setIsLoading(false));
    }
  }

  public async updateArmor(id: number, payload: ArmorUpdate) {
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiArmor.updateArmor(id, payload);
      if (response.status === 200) {
        runInAction(() =>
          this.setArmors(
            this.armors.map((a) => (a.id === id ? response.data : a))
          )
        );
      }
      return response.data;
    } catch (e: any) {
      runInAction(() => {
        this.setError(e?.response?.data?.error || "Не удалось обновить броню");
      });
      throw e;
    } finally {
      runInAction(() => this.setIsLoading(false));
    }
  }

  public async deleteArmor(id: number) {
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiArmor.deleteArmor(id);
      if (response.status === 204) {
        runInAction(() =>
          this.setArmors(this.armors.filter((a) => a.id !== id))
        );
      }
    } catch (e: any) {
      runInAction(() => {
        this.setError(e?.response?.data?.error || "Не удалось удалить броню");
      });
      throw e;
    } finally {
      runInAction(() => this.setIsLoading(false));
    }
  }
}
