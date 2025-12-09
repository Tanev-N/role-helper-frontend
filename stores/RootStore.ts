import { makeAutoObservable } from "mobx";
import { AuthStore } from "./Auth/AuthStore";
import { CharactersStore } from "./Characters/CharactersStore";
import { GamesStore } from "./Games/GamesStore";
import { ImageStore } from "./Image/ImageStore";
import { SessionStore } from "./Session/SessionStore";

export class RootStore {
  readonly authStore: AuthStore;
  readonly charactersStore: CharactersStore;
  readonly sessionStore: SessionStore;
  readonly gamesStore: GamesStore;
  readonly imageStore: ImageStore;
  constructor() {
    makeAutoObservable(this);
    this.authStore = new AuthStore();
    this.charactersStore = new CharactersStore();
    this.sessionStore = new SessionStore();
    this.gamesStore = new GamesStore();
    this.imageStore = new ImageStore();
  }
}
