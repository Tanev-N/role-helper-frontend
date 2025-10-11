import { makeAutoObservable } from "mobx";
import { apiAuth } from "./api";

interface User {
    login: string;
    avatar_url: string;
}

export class AuthStore {
    private isAuthentication: boolean = false;
    private user: User | null = null;
    private readonly localStorageKey = "auth.user";

    constructor() {
        makeAutoObservable(this);
        this.restoreUserFromLocalStorage();
    }

    private restoreUserFromLocalStorage() {
        try {
            const rawUser = localStorage.getItem(this.localStorageKey);
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
            if (user) {
                localStorage.setItem(this.localStorageKey, JSON.stringify(user));
            } else {
                localStorage.removeItem(this.localStorageKey);
            }
        } catch (e) {
            console.warn("AuthStore: не могу засетить юзера в локальную хранилку", e);
        }
    }

    private setUser(user: User | null) {
        this.isAuthentication = user ? true : false;
        this.user = user;
        this.persistUser(user);
    }

    public async login(login: string, password: string) {
        if (this.isAuthentication) {
            return;
        }
        try {
            const response = await apiAuth.login(login, password);
            if (response.status === 200) {
                this.setUser({
                    login: response.data.data.username,
                    avatar_url: response.data.data.avatar_url,
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    public async logout() {
        if (!this.isAuthentication) {
            return;
        }
        try {
            await apiAuth.logout();
        } catch (e) {
            console.warn("AuthStore: логоут ошибка", e);
        }
        this.setUser(null);
    }

    public async register(login: string, password: string, repassword: string) {
        if (this.isAuthentication) {
            return;
        }
        try {
            const response = await apiAuth.register(login, password, repassword);
            if (response.status === 201) {
                this.setUser({
                    login: response.data.data.username,
                    avatar_url: response.data.data.avatar_url,
                });
            }
        } catch (e) {
            console.warn("AuthStore: регистрация ошибка", e);
        }
    }

    get getUser(): User | null {
        return this.user;
    }

    get isAuth(): boolean {
        return this.isAuthentication;
    }
}