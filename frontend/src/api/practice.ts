import { apiClient } from "./client";
import { RoleplayMessage, PracticeSessionResult } from "@/types";

export interface CreateSessionRequest {
  scenarioId: string;
  advisorId?: string;
  advisorName?: string;
}

export interface CreateSessionResponse {
  session_id: string;
  sessionId?: string;
  scenario?: any;
  initial_message?: any;
  trust_level?: number;
  interest_level?: number;
}

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  advisor_message?: any;
  customer_message?: any;
  trust_level?: number;
  interest_level?: number;
  turn_count?: number;
  revealed_facts?: string[];
  message?: any;
}

export const practiceApi = {
  createSession: (req: CreateSessionRequest) =>
    apiClient<CreateSessionResponse>("/practice/sessions", {
      method: "POST",
      body: JSON.stringify(req),
    }),
  sendMessage: (sessionId: string, req: SendMessageRequest) =>
    apiClient<SendMessageResponse>(`/practice/${sessionId}/message`, {
      method: "POST",
      body: JSON.stringify(req),
    }),
  finishSession: (sessionId: string) =>
    apiClient<PracticeSessionResult>(`/practice/${sessionId}/finish`, {
      method: "POST",
    }),
};
