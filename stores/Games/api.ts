import createEndpoint from "@/api/api";
import axios from "axios";

export interface Game {
  id: number;
  name: string;
  master_id: number;
}

export interface Session {
  id: number;
  game_id: number;
  session_key: string;
  summary: string | null;
  created_at: string | null;
  finished_at: string | null;
}

export interface CreateGameRequest {
  name: string;
  description: string;
}

export interface CreateSessionResponse {
  session: Session;
  previous_sessions: Session[] | null;
}

export interface EnterSessionRequest {
  session_key: string;
  character_id: string;
}

export interface FinishSessionRequest {
  summary?: string;
}

export interface GamePlayer {
  id: number;
  game_id: number;
  user_id: number;
  character_id: string;
}

const apiGamesUrl = {
  games: createEndpoint("/games"),
  gameById: (gameId: number) => createEndpoint(`/games/${gameId}`),
  gameSessions: (gameId: number) => createEndpoint(`/games/${gameId}/sessions`),
  enterSession: createEndpoint("/games/sessions/enter"),
  finishSession: (sessionId: number) =>
    createEndpoint(`/games/sessions/${sessionId}/finish`),
  gamePlayers: (gameId: number) =>
    createEndpoint(`/games/${gameId}/players`),
};

export const apiGames = {
  async getGames() {
    return await axios.get(apiGamesUrl.games);
  },

  async createGame(name: string, description: string) {
    return await axios.post(apiGamesUrl.games, {
      name,
      description,
    } as CreateGameRequest);
  },

  async createSession(gameId: number) {
    return await axios.post(apiGamesUrl.gameSessions(gameId));
  },

  async enterSession(sessionKey: string, characterId: string) {
    return await axios.post(apiGamesUrl.enterSession, {
      session_key: sessionKey,
      character_id: characterId,
    } as EnterSessionRequest);
  },

  async finishSession(sessionId: number, summary?: string) {
    const body: FinishSessionRequest = summary ? { summary } : {};
    return await axios.post(apiGamesUrl.finishSession(sessionId), body);
  },

  async getGamePlayers(gameId: number) {
    return await axios.get(apiGamesUrl.gamePlayers(gameId));
  },
};
