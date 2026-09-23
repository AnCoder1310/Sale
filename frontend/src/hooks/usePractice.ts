import { useState, useCallback } from "react";
import { practiceApi } from "@/api/practice";
import { RoleplayScenario, RoleplayMessage, PracticeSessionResult } from "@/types";
import { trackEvent } from "@/telemetry";

export function usePractice(scenario: RoleplayScenario) {
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<RoleplayMessage[]>([]);
  const [trustLevel, setTrustLevel] = useState<number>(scenario.customerPersona.trustInitial);
  const [interestLevel, setInterestLevel] = useState<number>(scenario.customerPersona.interestInitial);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initSession = useCallback(async () => {
    try {
      const res = await practiceApi.createSession({
        scenarioId: scenario.id,
        advisorId: "adv-001",
      });
      if (res && res.sessionId) {
        setSessionId(res.sessionId);
        trackEvent("session_started", { sessionId: res.sessionId, scenarioId: scenario.id });
      }
    } catch (err) {
      // Fallback local session ID
      const fallbackId = "sess-" + Math.random().toString(36).substring(2, 9);
      setSessionId(fallbackId);
      trackEvent("session_started", { sessionId: fallbackId, scenarioId: scenario.id });
    }
  }, [scenario.id]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;
      setError(null);

      const advisorMsg: RoleplayMessage = {
        id: "tr-" + Date.now(),
        sender: "advisor",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        intentDetected: "Phản hồi tư vấn & Xử lý thắc mắc",
      };

      setMessages((prev) => [...prev, advisorMsg]);
      setIsTyping(true);

      trackEvent("message_sent", {
        sessionId,
        length: text.length,
        scenarioId: scenario.id,
      });

      try {
        const res = await practiceApi.sendMessage(sessionId, { message: text });
        if (res && (res as any).customer_message) {
          const cust = (res as any).customer_message;
          setMessages((prev) => [
            ...prev,
            {
              id: cust.id || "msg-" + Date.now(),
              sender: "customer",
              text: cust.text,
              timestamp: cust.timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              objectionResolved: true,
            },
          ]);
          setTrustLevel((prev) => Math.min(100, prev + 12));
          setInterestLevel((prev) => Math.min(100, prev + 10));
          setIsTyping(false);
          return;
        }
      } catch (err) {
        // Fallback simulation
        setTimeout(() => {
          let customerReply = "Nghe cũng có lý. Nhưng mà lỡ sau 3-4 năm pin nó bị chai thì chính sách đổi mới thế nào em?";
          if (messages.length >= 4) {
            customerReply = "À, chai pin dưới 70% là được đổi pin mới miễn phí à? Em cho anh xem hợp đồng và các điều khoản cụ thể nhé!";
          }
          setMessages((prev) => [
            ...prev,
            {
              id: "tr-cust-" + Date.now(),
              sender: "customer",
              text: customerReply,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              objectionResolved: true,
            },
          ]);
          setTrustLevel((prev) => Math.min(100, prev + 12));
          setInterestLevel((prev) => Math.min(100, prev + 8));
          setIsTyping(false);
        }, 1000);
      }
    },
    [isTyping, messages.length, scenario.id, sessionId]
  );

  const finishSession = useCallback(async (): Promise<PracticeSessionResult | null> => {
    trackEvent("session_finished", {
      sessionId,
      turnCount: messages.length,
      scenarioId: scenario.id,
    });

    try {
      const res = await practiceApi.finishSession(sessionId);
      if (res && res.rubricBreakdown) {
        return res;
      }
    } catch (err) {
      // Fallback
    }
    return null;
  }, [messages.length, scenario.id, sessionId]);

  return {
    sessionId,
    messages,
    trustLevel,
    interestLevel,
    isTyping,
    error,
    initSession,
    sendMessage,
    finishSession,
  };
}
