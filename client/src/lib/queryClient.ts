import { QueryClient, QueryFunction } from "@tanstack/react-query";

// -----------------------------------------------------------------
// 1. SETUP THE SERVER URL
// In production, use the same origin as the frontend (single deployment)
// In development, use localhost:5000 (or the PORT from env)
// -----------------------------------------------------------------
const BASE_URL = typeof window !== 'undefined'
  ? window.location.origin
  : "https://haritsattvava-api.onrender.com";

// Helper: Combines the Base URL with the API path
function getFullUrl(path: string) {
  if (path.startsWith("http")) return path; // Already has domain

  // Ensure there is exactly one slash between Base URL and path
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {

  // FIX 1: Use full URL
  const finalUrl = getFullUrl(url);

  console.log(`[API Request] ${method} ${finalUrl}`, data);

  // Get session token from localStorage (for mobile auth)
  const sessionToken = localStorage.getItem('sessionToken');
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};

  // Add Authorization header if we have a token
  if (sessionToken) {
    headers['Authorization'] = `Bearer ${sessionToken}`;
    console.log(`[API Request] Using token auth`);
  }

  try {
    const res = await fetch(finalUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include", // Keep for backwards compatibility
    });

    console.log(`[API Response] ${method} ${finalUrl} - Status: ${res.status}`);

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`[API Error] ${method} ${finalUrl}`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {

    // FIX 2: specific fix for React Query fetches
    const path = queryKey.join("/");
    const finalUrl = getFullUrl(path);

    // Get session token from localStorage (for mobile auth)
    const sessionToken = localStorage.getItem('sessionToken');
    const headers: Record<string, string> = {};

    // Add Authorization header if we have a token
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }

    const res = await fetch(finalUrl, {
      credentials: "include", // Keep for backwards compatibility
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});