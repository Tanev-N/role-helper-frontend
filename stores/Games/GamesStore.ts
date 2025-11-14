import { makeAutoObservable, runInAction } from "mobx";
import {
  apiGames,
  CreateSessionResponse,
  Game,
  GamePlayer,
  Session,
} from "./api";

export class GamesStore {
  private games: Game[] = [];
  private currentGame: Game | null = null;
  private currentSession: Session | null = null;
  private gamePlayers: GamePlayer[] = [];
  private previousSessions: Session[] = [];
  private isLoading: boolean = false;
  private error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // === Геттеры ===
  public get getGames(): Game[] {
    return this.games;
  }

  public get getCurrentGame(): Game | null {
    return this.currentGame;
  }

  public get getCurrentSession(): Session | null {
    return this.currentSession;
  }

  public get getGamePlayers(): GamePlayer[] {
    return this.gamePlayers;
  }

  public get getPreviousSessions(): Session[] {
    return this.previousSessions;
  }

  public get IsLoading(): boolean {
    return this.isLoading;
  }

  public get getError(): string | null {
    return this.error;
  }

  // === Сеттеры ===
  private setGames(games: Game[]) {
    this.games = games;
  }

  private setCurrentGame(game: Game | null) {
    this.currentGame = game;
  }

  private setCurrentSession(session: Session | null) {
    this.currentSession = session;
  }

  private setGamePlayers(players: GamePlayer[]) {
    this.gamePlayers = players;
  }

  private setPreviousSessions(sessions: Session[]) {
    this.previousSessions = sessions;
  }

  private setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  private setError(error: string | null) {
    this.error = error;
  }

  // === Методы ===
  public async fetchGames() {
    if (this.isLoading) return;
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiGames.getGames();
      if (response.status === 200) {
        runInAction(() => {
          this.setGames(response.data);
        });
      }
    } catch (e: any) {
      console.warn("GamesStore: fetchGames error", e);
      runInAction(() => {
        this.setError(
          e.response?.data?.error || "Ошибка при загрузке списка игр"
        );
      });
    } finally {
      runInAction(() => {
        this.setIsLoading(false);
      });
    }
  }

  public async createGame(name: string, description: string) {
    this.setError(null);
    this.setIsLoading(true);
    try {
      const response = await apiGames.createGame(name, description);
      if (response.status === 201) {
        const newGame = response.data as Game;
        runInAction(() => {
          this.setGames([...this.games, newGame]);
          this.setCurrentGame(newGame);
        });
        return newGame;
      }
    } catch (e: any) {
      console.warn("GamesStore: createGame error", e);
      runInAction(() => {
        this.setError(
          e.response?.data?.error || "Ошибка при создании игры"
        );
      });
      throw e;
    } finally {
      runInAction(() => {
        this.setIsLoading(false);
      });
    }
  }

  public setSelectedGame(game: Game | null) {
    this.setCurrentGame(game);
    if (!game) {
      this.setGamePlayers([]);
      this.setCurrentSession(null);
      this.setPreviousSessions([]);
    }
  }

  public async createSession(gameId: number) {
    this.setError(null);
    this.setIsLoading(true);
    try {
      const response = await apiGames.createSession(gameId);
      if (response.status === 201) {
        const data = response.data as CreateSessionResponse;
        runInAction(() => {
          this.setCurrentSession(data.session);
          if (data.previous_sessions) {
            this.setPreviousSessions(data.previous_sessions);
          }
        });
        return data.session;
      }
    } catch (e: any) {
      console.warn("GamesStore: createSession error", e);
      runInAction(() => {
        this.setError(
          e.response?.data?.error || "Ошибка при создании сессии"
        );
      });
      throw e;
    } finally {
      runInAction(() => {
        this.setIsLoading(false);
      });
    }
  }

  public async enterSession(sessionKey: string, characterId: string) {
    this.setError(null);
    this.setIsLoading(true);
    try {
      const response = await apiGames.enterSession(sessionKey, characterId);
      if (response.status === 200) {
        const session = response.data as Session;
        runInAction(() => {
          this.setCurrentSession(session);
          if (session.game_id) {
            // Обновляем текущую игру, если она найдена в списке
            const game = this.games.find((g) => g.id === session.game_id);
            if (game) {
              this.setCurrentGame(game);
            }
          }
        });
        return session;
      }
    } catch (e: any) {
      console.warn("GamesStore: enterSession error", e);
      runInAction(() => {
        this.setError(
          e.response?.data?.error || "Ошибка при присоединении к сессии"
        );
      });
      throw e;
    } finally {
      runInAction(() => {
        this.setIsLoading(false);
      });
    }
  }

  public async finishSession(sessionId: number, summary?: string) {
    this.setError(null);
    this.setIsLoading(true);
    try {
      const response = await apiGames.finishSession(sessionId, summary);
      if (response.status === 200) {
        runInAction(() => {
          // Обновляем текущую сессию, если она была завершена
          if (this.currentSession?.id === sessionId) {
            this.setCurrentSession(null);
          }
        });
        return response.data;
      }
    } catch (e: any) {
      console.warn("GamesStore: finishSession error", e);
      runInAction(() => {
        this.setError(
          e.response?.data?.error || "Ошибка при завершении сессии"
        );
      });
      throw e;
    } finally {
      runInAction(() => {
        this.setIsLoading(false);
      });
    }
  }

  public async fetchGamePlayers(gameId: number) {
    if (this.isLoading) return;
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiGames.getGamePlayers(gameId);
      if (response.status === 200) {
        runInAction(() => {
          this.setGamePlayers(response.data);
        });
      }
    } catch (e: any) {
      console.warn("GamesStore: fetchGamePlayers error", e);
      runInAction(() => {
        this.setError(
          e.response?.data?.error || "Ошибка при загрузке игроков"
        );
      });
    } finally {
      runInAction(() => {
        this.setIsLoading(false);
      });
    }
  }

  public clearError() {
    this.setError(null);
  }

  public reset() {
    this.setGames([]);
    this.setCurrentGame(null);
    this.setCurrentSession(null);
    this.setGamePlayers([]);
    this.setPreviousSessions([]);
    this.setError(null);
  }
}
