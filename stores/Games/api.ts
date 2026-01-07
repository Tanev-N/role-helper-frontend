import createEndpoint from "@/api/api";
import axios from "axios";

export interface Game {
  id: number;
  name: string;
  master_id: number;
  description: string;
  photo: string;
}

export interface Session {
  id: string;
  game_id: string;
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
  character: any;
}

const apiGamesUrl = {
  games: createEndpoint("/games"),
  gameById: (gameId: string) => createEndpoint(`/games/${gameId}`),
  gameSessions: (gameId: string) => createEndpoint(`/games/${gameId}/sessions`),
  enterSession: createEndpoint("/games/sessions/enter"),
  finishSession: (sessionId: string) =>
    createEndpoint(`/games/sessions/${sessionId}/finish`),
  leaveSession: (sessionId: string) =>
    createEndpoint(`/games/sessions/${sessionId}/leave`),
  gamePlayers: (gameId: string) => createEndpoint(`/games/${gameId}/players`),
  gamePreviousSessions: (gameId: string) =>
    createEndpoint(`/games/${gameId}/previous_sessions`),
  sessionPlayers: (sessionId: string) =>
    createEndpoint(`/games/sessions/${sessionId}/players`),
  previousSessionPlayers: (sessionId: string) =>
    createEndpoint(`/games/previous_sessions/${sessionId}/players`),
};

export const apiGames = {
  async getGames() {
    return await axios.get(apiGamesUrl.games);
  },

  async createGame(name: string, description: string, photo: string) {
    return await axios.post(apiGamesUrl.games, {
      name,
      description,
      photo,
    } as CreateGameRequest);
  },

  async getPreviousSessions(gameId: string) {
    return await axios.get(apiGamesUrl.gamePreviousSessions(gameId));
  },

  async getSessionPlayers(sessionId: string) {
    return await axios.get(apiGamesUrl.sessionPlayers(sessionId));
  },

  async getPreviousSessionPlayers(sessionId: string) {
    return await axios.get(apiGamesUrl.previousSessionPlayers(sessionId));
  },

  async createSession(gameId: string) {
    return await axios.post(apiGamesUrl.gameSessions(gameId));
  },

  async enterSession(sessionKey: string, characterId: string) {
    return await axios.post(apiGamesUrl.enterSession, {
      session_key: sessionKey,
      character_id: characterId,
    } as EnterSessionRequest);
  },

  async finishSession(sessionId: string, summary?: string) {
    const body: FinishSessionRequest = summary ? { summary } : {};
    return await axios.post(apiGamesUrl.finishSession(sessionId), body);
  },

  async leaveSession(sessionId: string) {
    return await axios.post(apiGamesUrl.leaveSession(sessionId));
  },

  async getGamePlayers(gameId: string) {
    return await axios.get(apiGamesUrl.gamePlayers(gameId));
  },
};
