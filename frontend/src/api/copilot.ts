import { apiClient } from "./client";
import { CopilotCitation } from "@/types";

export interface CopilotQueryRequest {
  query: string;
  sessionId?: string;
  vehicleModel?: string;
  category?: string;
}

export interface CopilotQueryResponse {
  answer: string;
  citations: CopilotCitation[];
  recommendedTalkingPoints: string[];
  followUpQuestions: string[];
}

export const copilotApi = {
  query: (req: CopilotQueryRequest) =>
    apiClient<CopilotQueryResponse>("/copilot/query", {
      method: "POST",
      body: JSON.stringify(req),
    }),
  getSource: (id: string) =>
    apiClient<CopilotCitation>(`/copilot/sources/${id}`),
};
