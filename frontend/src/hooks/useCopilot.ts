import { useState } from "react";
import { copilotApi } from "@/api/copilot";
import { CopilotMessage } from "@/types";
import { mockCopilotInitialMessages } from "@/data/mockCopilot";

export function useCopilot() {
  const [messages, setMessages] = useState<CopilotMessage[]>(mockCopilotInitialMessages);
  const [loading, setLoading] = useState(false);

  const ask = async (text: string) => {
    const userMsg: CopilotMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await copilotApi.query({ query: text });
      const aiMsg: CopilotMessage = {
        id: "ai-" + Date.now(),
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: res.answer,
        citations: res.citations,
        recommendedTalkingPoints: res.recommendedTalkingPoints,
        followUpQuestions: res.followUpQuestions,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Fallback is handled gracefully by mock state in UI
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, ask };
}
