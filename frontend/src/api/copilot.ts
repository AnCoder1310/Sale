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

export interface LoanCalcRequest {
  carPrice: number;
  downPaymentPct?: number;
  annualInterestRatePct?: number;
  loanYears?: number;
}

export interface TCOCalcRequest {
  vehicleModel: string;
  competitorModel: string;
  monthlyKm?: number;
  periodYears?: number;
  batteryOption?: string;
}

export const copilotApi = {
  query: (req: CopilotQueryRequest) =>
    apiClient<CopilotQueryResponse>("/copilot/query", {
      method: "POST",
      body: JSON.stringify(req),
    }),
  getSource: (id: string) =>
    apiClient<CopilotCitation>(`/copilot/sources/${id}`),
  calculateLoan: (data: LoanCalcRequest) =>
    apiClient<any>("/calculator/loan", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  calculateTCO: (data: TCOCalcRequest) =>
    apiClient<any>("/calculator/tco", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
