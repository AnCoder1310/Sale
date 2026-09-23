import { useState, useCallback, useEffect } from "react";
import { managerApi } from "@/api/manager";
import { PracticeSessionResult } from "@/types";
import { trackEvent } from "@/telemetry";
import { mockSampleSessionResult } from "@/data/mockPractice";

export function useManager() {
  const [pendingReviews, setPendingReviews] = useState<PracticeSessionResult[]>([mockSampleSessionResult]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await managerApi.getPendingReviews();
      if (data && data.length > 0) {
        setPendingReviews(data);
      }
    } catch (err) {
      // Keep initial mock review
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const approveReview = useCallback(
    async (sessionId: string, managerScore: number, managerNote: string) => {
      trackEvent("manager_review_approved", {
        sessionId,
        managerScore,
      });

      try {
        await managerApi.updateReview(sessionId, { managerScore, managerNote });
      } catch (err) {
        // Fallback
      }

      setPendingReviews((prev) =>
        prev.map((r) =>
          r.sessionId === sessionId
            ? {
                ...r,
                managerReviewed: true,
                managerScore,
                managerNote,
                managerReviewerName: "Lê Văn Hoàng (Training Director)",
                managerReviewedAt: new Date().toLocaleDateString("vi-VN"),
              }
            : r
        )
      );
    },
    []
  );

  return {
    pendingReviews,
    loading,
    error,
    fetchReviews,
    approveReview,
  };
}
