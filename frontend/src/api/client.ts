const DEFAULT_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const primaryUrl = `${DEFAULT_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(primaryUrl, { ...options, headers });
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`API Error [${res.status}]: ${errorBody}`);
    }
    return (await res.json()) as T;
  } catch (error: any) {
    // If primary port 8000 failed and wasn't explicitly set to 8001, try port 8001
    if (primaryUrl.includes(":8000/") && typeof window !== "undefined") {
      const fallbackUrl = primaryUrl.replace(":8000/", ":8001/");
      try {
        const fbRes = await fetch(fallbackUrl, { ...options, headers });
        if (fbRes.ok) {
          return (await fbRes.json()) as T;
        }
      } catch (fbErr) {
        // Fallback failed as well
      }
    }

    console.warn(`Fetch to ${primaryUrl} failed, using local mock state:`, error);
    throw error;
  }
}
