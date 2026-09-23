export type TelemetryEvent =
  | "session_started"
  | "session_finished"
  | "message_sent"
  | "copilot_query"
  | "source_clicked"
  | "practice_abandoned"
  | "retry_triggered"
  | "manager_score_edited"
  | "manager_review_approved";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function trackEvent(eventName: TelemetryEvent, payload: Record<string, any> = {}, userId = "adv-001") {
  // Fire and forget, never block user interactions
  try {
    const data = JSON.stringify({
      eventName,
      payload,
      userId,
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon(`${API_BASE}/telemetry`, blob);
    } else {
      fetch(`${API_BASE}/telemetry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
        keepalive: true,
      }).catch(() => {
        // Silently catch offline errors
      });
    }
  } catch (err) {
    console.debug(`[Telemetry] ${eventName}`, payload);
  }
}
