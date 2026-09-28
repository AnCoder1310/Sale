function getBaseUrl(): string {
  // If explicitly provided via environment variable (e.g. deployed backend URL)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // On local development machine
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      const port = window.location.port === "3001" ? "8001" : "8000";
      return `http://${hostname}:${port}/api/v1`;
    }
  }

  // Fallback to local API endpoint
  return "http://localhost:8000/api/v1";
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const primaryUrl = `${baseUrl}${endpoint}`;
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
    // If running locally on port 8000 failed, attempt port 8001 fallback
    if (primaryUrl.includes("localhost:8000/") && typeof window !== "undefined") {
      const fallbackUrl = primaryUrl.replace("localhost:8000/", "localhost:8001/");
      try {
        const fbRes = await fetch(fallbackUrl, { ...options, headers });
        if (fbRes.ok) {
          return (await fbRes.json()) as T;
        }
      } catch (fbErr) {
        // Fallback failed
      }
    }

    console.warn(`Fetch to ${primaryUrl} failed, using local mock data:`, error?.message || error);
    throw error;
  }
}
