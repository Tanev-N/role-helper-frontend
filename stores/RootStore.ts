import { makeAutoObservable } from "mobx";
import { AuthStore } from "./Auth/AuthStore";
import { CharactersStore } from "./Characters/CharactersStore";

export class RootStore {
  readonly authStore: AuthStore;
  readonly charactersStore?: CharactersStore;
  constructor() {
    makeAutoObservable(this);
    this.authStore = new AuthStore();
    this.charactersStore = new CharactersStore();
  }
}
