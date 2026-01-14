import { makeAutoObservable } from "mobx";
import DEBUG_MODE from "../../config/debug";
import { apiAuth } from "./api";

interface User {
  login: string;
  avatar_url: string;
}

export class AuthStore {
  private isAuthentication: boolean = false;
  private user: User | null = null;
  public error: string | null = null;
  private readonly localStorageKey = "auth.user";

  constructor() {
    makeAutoObservable(this);

    if (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    ) {
      this.restoreUserFromLocalStorage();
    }

    // === DEBUG MODE ===
    if (DEBUG_MODE && !this.user) {
      this.user = { login: "Dev Tester", avatar_url: "" };
      this.isAuthentication = true;
      console.log("DEBUG MODE: авторизация пропущена");
    }
  }

  private restoreUserFromLocalStorage() {
    try {
      const rawUser =
        typeof localStorage !== "undefined"
          ? localStorage.getItem(this.localStorageKey)
          : null;
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser) as User;
        if (parsedUser && parsedUser.login) {
          this.user = parsedUser;
          this.isAuthentication = true;
        }
      }
    } catch (e) {
      console.warn("AuthStore: Не могу распарсить юзера", e);
    }
  }

  private persistUser(user: User | null) {
    try {
      if (typeof localStorage === "undefined") return;
      if (user) {
        localStorage.setItem(this.localStorageKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.localStorageKey);
      }
    } catch (e) {
      console.warn("AuthStore: не могу записать юзера в localStorage", e);
    }
  }

  private setUser(user: User | null) {
    this.isAuthentication = user ? true : false;
    this.user = user;
    this.persistUser(user);
  }

  public async login(login: string, password: string) {
    this.error = null;
    try {
      const response = await apiAuth.login(login, password);
      if (response.status === 200) {
        this.setUser({
          login: response.data.data.username,
          avatar_url: response.data.data.avatar_url,
        });
      }
    } catch (e: any) {
      console.warn("AuthStore: ошибка логина", e);
      if (e.response?.status === 401) {
        this.error = "InvalidCredentials";
      } else {
        this.error = "NetworkError";
      }
    }
  }

  public async logout() {
    try {
      await apiAuth.logout();
    } catch (e) {
      console.warn("AuthStore: ошибка логаута", e);
    }
    this.setUser(null);
  }

  public async register(login: string, password: string, repassword: string) {
    this.error = null;
    try {
      const response = await apiAuth.register(login, password, repassword);
      if (response.status === 201) {
        this.setUser({
          login: response.data.data.username,
          avatar_url: response.data.data.avatar_url,
        });
      }
    } catch (e: any) {
      console.warn("AuthStore: регистрация ошибка", e);
      if (e.response?.status === 409) {
        this.error = "UserAlreadyExists";
      } else {
        this.error = "NetworkError";
      }
    }
  }

  // === ЗАГРУЗКА АВАТАРА ===
  public async uploadAvatar(avatarUri: string): Promise<boolean> {
    this.error = null;
    try {
      const response = await apiAuth.uploadAvatar(avatarUri);

      if (response.status === 200 && response.data?.data?.avatar_url) {
        if (this.user) {
          this.setUser({
            ...this.user,
            avatar_url: response.data.data.avatar_url,
          });
        }
        return true;
      }

      this.error = "ServerError";
      return false;
    } catch (e: any) {
      console.warn("AuthStore: ошибка загрузки аватара", e);
      
      if (e.response?.status === 400) {
        this.error = "ServerError";
      } else {
        this.error = "NetworkError";
      }
      return false;
    }
  }

  // === Геттеры ===
  get getUser(): User | null {
    return this.user;
  }

  get isAuth(): boolean {
    return this.isAuthentication;
  }
}
