import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable, runInAction } from "mobx";
import { apiAuth } from "./api";

// Тип пользователя
interface User {
  login: string;
  avatar_url: string;
}

// Возможные ошибки
type AuthErrorType =
  | "UserAlreadyExists"
  | "InvalidCredentials"
  | "NetworkError"
  | "ServerError"
  | null;

export class AuthStore {
  private isAuthentication = false;
  private user: User | null = null;
  public error: AuthErrorType = null;
  private readonly storageKey = "auth.user";

  constructor() {
    makeAutoObservable(this);
    void this.restoreUserFromStorage();
  }

  // === Восстановление из AsyncStorage ===
  private async restoreUserFromStorage() {
    try {
      const rawUser = await AsyncStorage.getItem(this.storageKey);
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser) as User;
        if (parsedUser && parsedUser.login) {
          runInAction(() => {
            this.user = parsedUser;
            this.isAuthentication = true;
          });
        }
      }
    } catch (e) {
      console.warn("AuthStore: не удалось восстановить пользователя", e);
    }
  }

  // === Сохранение пользователя ===
  private async persistUser(user: User | null) {
    try {
      if (user) {
        await AsyncStorage.setItem(this.storageKey, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(this.storageKey);
      }
    } catch (e) {
      console.warn("AuthStore: ошибка при сохранении пользователя", e);
    }
  }

  private async setUser(user: User | null) {
    runInAction(() => {
      this.isAuthentication = !!user;
      this.user = user;
      this.error = null;
    });
    await this.persistUser(user);
  }

  // === ЛОГИН ===
  public async login(login: string, password: string): Promise<boolean> {
    this.error = null;
    try {
      const response = await apiAuth.login(login, password);

      if (response.status === 200 && response.data?.data) {
        await this.setUser({
          login: response.data.data.username,
          avatar_url: response.data.data.avatar_url,
        });
        return true;
      }

      if (response.status === 401 || response.status === 400) {
        runInAction(() => (this.error = "InvalidCredentials"));
      } else {
        runInAction(() => (this.error = "ServerError"));
      }

      return false;
    } catch (e) {
      console.warn("AuthStore: ошибка логина", e);
      runInAction(() => (this.error = "NetworkError"));
      return false;
    }
  }

  // === ЛОГАУТ ===
  public async logout() {
    try {
      await apiAuth.logout();
    } catch (e) {
      console.warn("AuthStore: ошибка при логауте", e);
    }
    await this.setUser(null);
  }

  // === РЕГИСТРАЦИЯ ===
  public async register(
    email: string,
    password: string,
    repassword: string
  ): Promise<boolean> {
    this.error = null;

    try {
      const response = await apiAuth.register(email, password, repassword);

      // успешная регистрация
      if (response.status === 201 && response.data?.data) {
        await this.setUser({
          login: response.data.data.username,
          avatar_url: response.data.data.avatar_url,
        });
        return true;
      }

      // пользователь уже существует
      if (
        response.status === 409 ||
        response.data?.error === "UserAlreadyExists"
      ) {
        runInAction(() => (this.error = "UserAlreadyExists"));
        await this.setUser(null);
        return false;
      }

      // другая ошибка
      runInAction(() => (this.error = "ServerError"));
      await this.setUser(null);
      return false;
    } catch (e) {
      console.warn("AuthStore: ошибка регистрации", e);
      runInAction(() => (this.error = "NetworkError"));
      await this.setUser(null);
      return false;
    }
  }

  // === ГЕТТЕРЫ ===
  get getUser(): User | null {
    return this.user;
  }

  get isAuth(): boolean {
    return this.isAuthentication;
  }
}

export const authStore = new AuthStore();
