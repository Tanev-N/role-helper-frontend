import { makeAutoObservable } from "mobx";
import { apiSession } from "./api";

type HistoryItem = {
  query: string;
  answer: string;
  timestamp: string;
};

export class SessionStore {
  user_id: string = "1";
  session_id: string = "1";
  history: HistoryItem[] = [] as HistoryItem[];
  constructor() {
    makeAutoObservable(this);
  }

  public async initSession(session_id: string) {
    this.session_id = session_id;
    try {
      const response = await apiSession.getHistory(this.user_id, session_id);
      if (response.status === 200) {
        this.history = response.data;
      }
    } catch (e) {
      console.warn("SessionStore: initSession error", e);
    }
  }

  public async sendMessage(askFormat: string, input: string | FormData) {
    try {
      const response = await apiSession.llmAsk(
        this.user_id,
        this.session_id,
        askFormat,
        input
      );
      if (response.status === 200) {
        this.history.push({
          query: response.data.query,
          answer: response.data.answer,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn("SessionStore: sendMessage error", e);
    }
  }

  public async transcribeAudio(audio: FormData) {
    try {
      const response = await apiSession.voiseTranscribe(audio);
      if (response.status === 200) {
        return response.data.transcription as string;
      }
    } catch (e) {
      console.warn("SessionStore: transcribeAudio error", e);
    }
    return null;
  }

  public get getUserId() {
    return this.user_id;
  }
  public get getSessionId() {
    return this.session_id;
  }
  public get getHistory() {
    return this.history;
  }
}
