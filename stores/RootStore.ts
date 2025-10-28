import { makeAutoObservable } from "mobx";
import { AuthStore } from "./Auth/AuthStore";
import { CharactersStore } from "./Characters/CharactersStore";
import { SessionStore } from "./Session/SessionStore";

export class RootStore {
  readonly authStore: AuthStore;
  readonly charactersStore: CharactersStore;
  readonly sessionStore: SessionStore;
  constructor() {
    makeAutoObservable(this);
    this.authStore = new AuthStore();
    this.charactersStore = new CharactersStore();
    this.sessionStore = new SessionStore();
  }
}
