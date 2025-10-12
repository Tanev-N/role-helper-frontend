import axios from "axios";
import { createEndpointML } from "@/api/api";

const apiSessionUrl = {
  voiseTranscribe: createEndpointML("/voice/transcribe"),
  llmAsk: createEndpointML("/llm/ask"),
  history: (userId: string, sessionId: string): string =>
    createEndpointML(
      `/history/user_history?user_id=${userId}&session_id=${sessionId}`
    ),
};

export const apiSession = {
  async voiseTranscribe(audio: FormData) {
    return await axios.post(apiSessionUrl.voiseTranscribe, audio, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * llmAsk - sends either TEXT or VOICE request to backend.
   * Backend expects multipart/form-data with fields:
   *  - request: JSON string { user_id, session_id, ask_format, input_text }
   *  - file_to_process: file blob (for VOICE)
   */
  async llmAsk(
    userId: string,
    sessionId: string,
    askFormat: string,
    input: string | FormData | Blob | null
  ) {
    // For TEXT: send request JSON with input_text
    if (askFormat === "TEXT") {
      const form = new FormData();
      form.append(
        "request",
        JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          ask_format: askFormat,
          input_text: input as string,
        })
      );

      return await axios.post(apiSessionUrl.llmAsk, form);
    }

    // For VOICE: include file_to_process
    if (askFormat === "VOICE") {
      const form = new FormData();
      form.append(
        "request",
        JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          ask_format: askFormat,
          input_text: "",
        })
      );

      // If the caller passed a FormData, try to extract a file from it
      if (input instanceof FormData) {
        try {
          for (const entry of (input as any).entries()) {
            const [, value] = entry as [string, any];
            if (
              value instanceof Blob ||
              (typeof File !== "undefined" && value instanceof File)
            ) {
              form.append(
                "file_to_process",
                value,
                (value as any).name || "file"
              );
              break;
            }
          }
        } catch (e) {
          console.warn(
            "apiSession.llmAsk: error extracting file from FormData",
            e
          );
        }
      } else if (input) {
        // input might be a Blob or File
        form.append("file_to_process", input as any);
      }

      return await axios.post(apiSessionUrl.llmAsk, form);
    }

    // Fallback: send JSON body
    return await axios.post(apiSessionUrl.llmAsk, {
      user_id: userId,
      session_id: sessionId,
      ask_format: askFormat,
      input: input,
    });
  },

  async getHistory(userId: string, sessionId: string) {
    return await axios.get(apiSessionUrl.history(userId, sessionId));
  },
};
