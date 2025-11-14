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
  code: string = "";
  constructor() {
    makeAutoObservable(this);
  }

  public async initSession(session_id: string) {
    this.session_id = session_id;
    try {
      const response = await apiSession.getHistory(this.user_id, session_id);
      if (response.status === 200) {
        // normalize history items from backend into { query, answer, timestamp }
        const data = response.data as any[];
        this.history = (data || []).map((item: any) => {
          const query =
            item.query ??
            item.input_text ??
            item.request_text ??
            item.text ??
            "";
          const answer =
            item.answer ??
            item.response ??
            item.text ??
            item.llm_response ??
            "";
          const timestamp =
            item.timestamp ?? item.created_at ?? new Date().toISOString();
          return { query, answer, timestamp } as HistoryItem;
        });
      }
    } catch (e) {
      console.warn("SessionStore: initSession error", e);
    }
  }

  public async sendMessage(
    askFormat: string,
    input: string | File | Blob | null = null
  ) {
    try {
      const response = await apiSession.llmAsk(
        this.user_id,
        this.session_id,
        askFormat,
        input
      );
      if (response.status === 200) {
        // Backend may return different shapes. Try to extract query and answer.
        const d = response.data as any;
        const answer = d.answer ?? d.text ?? d.response ?? d.llm_response ?? "";
        const query =
          d.query ?? (askFormat === "TEXT" ? (input as string) : "");
        this.history.push({
          query,
          answer,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn("SessionStore: sendMessage error", e);
    }
  }

  public async transcribeAudio(audio: Blob | File) {
    try {
      const response = await apiSession.voiseTranscribe(audio);
      if (response.status === 200) {
        const d = response.data as any;
        // backend may return { transcription } or { text }
        return (d.transcription ?? d.text ?? d.transcribed_text ?? null) as
          | string
          | null;
      }
    } catch (e) {
      console.warn("SessionStore: transcribeAudio error", e);
    }
    return null;
  }

  public get getUserId() {
    return this.user_id;
  }

  public get getCode() {
    return this.code;
  }
  public get getSessionId() {
    return this.session_id;
  }
  public get getHistory() {
    return this.history;
  }
}
