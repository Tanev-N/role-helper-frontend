import { makeAutoObservable } from "mobx";
import { AuthStore } from "./Auth/AuthStore";

export class RootStore {
    readonly authStore: AuthStore;
    constructor() {
        makeAutoObservable(this)
        this.authStore = new AuthStore();
    }
}