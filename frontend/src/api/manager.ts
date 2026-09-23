import { apiClient } from "./client";
import { PracticeSessionResult } from "@/types";

export interface UpdateReviewRequest {
  managerScore: number;
  managerNote: string;
}

export const managerApi = {
  getPendingReviews: () =>
    apiClient<PracticeSessionResult[]>("/manager/reviews"),
  updateReview: (sessionId: string, req: UpdateReviewRequest) =>
    apiClient<PracticeSessionResult>(`/manager/reviews/${sessionId}`, {
      method: "PATCH",
      body: JSON.stringify(req),
    }),
};
