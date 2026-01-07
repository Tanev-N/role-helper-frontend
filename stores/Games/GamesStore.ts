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
  private sessionPlayers: GamePlayer[] = [];
  private previousSessions: Session[] = [];
  private sessionRole: "master" | "player" | null = null;
  private playerCharacterId: string | null = null;
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

  public get getSessionPlayers(): GamePlayer[] {
    return this.sessionPlayers;
  }

  public get getPreviousSessions(): Session[] {
    return this.previousSessions;
  }

  public get getSessionRole(): "master" | "player" | null {
    return this.sessionRole;
  }

  public get getPlayerCharacterId(): string | null {
    return this.playerCharacterId;
  }

  public get IsLoading(): boolean {
    return this.isLoading;
  }

  public get getError(): string | null {
    return this.error;
  }

  // === Сеттеры ===
  private setGames(games: Game[] | null | undefined) {
    this.games = games ?? [];
  }

  private setCurrentGame(game: Game | null) {
    this.currentGame = game;
  }

  private setCurrentSession(session: Session | null) {
    this.currentSession = session;
  }

  private setSessionPlayers(players: GamePlayer[]) {
    this.sessionPlayers = players;
  }

  private setPreviousSessions(sessions: Session[]) {
    this.previousSessions = sessions;
  }

  private setSessionRole(role: "master" | "player" | null) {
    this.sessionRole = role;
  }

  private setPlayerCharacterId(characterId: string | null) {
    this.playerCharacterId = characterId;
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

  public async createGame(name: string, description: string, photoUrl: string) {
    this.setError(null);
    this.setIsLoading(true);
    try {
      const response = await apiGames.createGame(name, description, photoUrl);
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
        this.setError(e.response?.data?.error || "Ошибка при создании игры");
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
      this.setSessionPlayers([]);
      this.setCurrentSession(null);
      this.setPreviousSessions([]);
    }
  }

  public async createSession(gameId: string) {
    this.setError(null);
    this.setIsLoading(true);
    try {
      const response = await apiGames.createSession(gameId.toString());
      if (response.status === 201) {
        const data = response.data as CreateSessionResponse;
        runInAction(() => {
          this.setCurrentSession(data.session as Session);
          this.setSessionRole("master");
          this.setPlayerCharacterId(null);
          if (data.previous_sessions) {
            this.setPreviousSessions(data.previous_sessions);
          }
        });
        return data.session;
      }
    } catch (e: any) {
      console.warn("GamesStore: createSession error", e);
      runInAction(() => {
        this.setError(e.response?.data?.error || "Ошибка при создании сессии");
      });
      throw e;
    } finally {
      runInAction(() => {
        this.setIsLoading(false);
      });
    }
  }

  // Стрелочная функция, чтобы не терять контекст this при деструктурировании
  public enterSession = async (sessionKey: string, characterId: string) => {
    this.setError(null);
    this.setIsLoading(true);
    try {
      const response = await apiGames.enterSession(sessionKey, characterId);
      if (response.status === 200) {
        const session = response.data as Session;
        runInAction(() => {
          this.setCurrentSession(session);
          this.setSessionRole("player");
          this.setPlayerCharacterId(characterId);
          if (session.game_id) {
            // Обновляем текущую игру, если она найдена в списке
            const game = (this.games ?? []).find((g) => g.id?.toString() === session.game_id);
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
  };

  public async finishSession(sessionId: string, summary?: string) {
    this.setError(null);
    this.setIsLoading(true);
    try {
      const response = await apiGames.finishSession(sessionId.toString(), summary);
      if (response.status === 200) {
        runInAction(() => {
          // Обновляем текущую сессию, если она была завершена
          if (this.currentSession?.id?.toString() === sessionId.toString()) {
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

  public async fetchPreviousSessions(gameId: string) {
    if (this.isLoading) return;
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiGames.getPreviousSessions(gameId);
      if (response.status === 200) {
        runInAction(() => {
          this.setPreviousSessions(response.data || []);
        });
      }
    } catch (e: any) {
      console.warn("GamesStore: fetchPreviousSessions error", e);
      runInAction(() => {
        this.setError(
          e.response?.data?.error || "Ошибка при загрузке предыдущих сессий"
        );
      });
    } finally {
      runInAction(() => {
        this.setIsLoading(false);
      });
    }
  }

  public async fetchSessionPlayers(sessionId: string) {
    if (this.isLoading) return;
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiGames.getSessionPlayers(sessionId.toString());
      if (response.status === 200) {
        runInAction(() => {
          this.setSessionPlayers(response.data as GamePlayer[]);
        });
      }
    } catch (e: any) {
      console.warn("GamesStore: fetchSessionPlayers error", e);
      runInAction(() => {
        this.setError(
          e.response?.data?.error || "Ошибка при загрузке игроков сессии"
        );
      });
    } finally {
      runInAction(() => {
        this.setIsLoading(false);
      });
    }
  }

  public async fetchPreviousSessionPlayers(sessionId: string) {
    if (this.isLoading) return;
    this.setIsLoading(true);
    this.setError(null);
    try {
      const response = await apiGames.getPreviousSessionPlayers(sessionId.toString());
      if (response.status === 200) {
        runInAction(() => {
          this.setSessionPlayers(response.data as GamePlayer[]);
        });
      }
    } catch (e: any) {
      console.warn("GamesStore: fetchPreviousSessionPlayers error", e);
      runInAction(() => {
        this.setError(
          e.response?.data?.error || "Ошибка при загрузке игроков завершенной сессии"
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

  public async leaveSession(sessionId: string) {
    this.setError(null);
    this.setIsLoading(true);
    try {
      const response = await apiGames.leaveSession(sessionId);
      if (response.status === 200) {
        runInAction(() => {
          // Очищаем состояние после успешного выхода
          if (this.currentSession?.id === sessionId) {
            this.setCurrentSession(null);
          }
          this.setSessionRole(null);
          this.setPlayerCharacterId(null);
          this.setSessionPlayers([]);
        });
      }
    } catch (e: any) {
      console.warn("GamesStore: leaveSession error", e);
      runInAction(() => {
        this.setError(
          e.response?.data?.error || "Ошибка при выходе из сессии"
        );
      });
      throw e;
    } finally {
      runInAction(() => {
        this.setIsLoading(false);
      });
    }
  }

  public exitSession() {
    this.setCurrentSession(null);
    this.setSessionRole(null);
    this.setPlayerCharacterId(null);
    this.setSessionPlayers([]);
  }

  public reset() {
    this.setGames([]);
    this.setCurrentGame(null);
    this.setCurrentSession(null);
    this.setSessionPlayers([]);
    this.setPreviousSessions([]);
    this.setSessionRole(null);
    this.setPlayerCharacterId(null);
    this.setError(null);
  }
}
