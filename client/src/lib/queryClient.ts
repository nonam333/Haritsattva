import { QueryClient, QueryFunction } from "@tanstack/react-query";

// -----------------------------------------------------------------
// 1. SETUP THE SERVER URL
// CHANGE THIS to your specific Render URL.
// Do not leave a trailing slash (e.g., use "https://myapp.onrender.com")
// -----------------------------------------------------------------
const BASE_URL = "https://haritsattvava-api.onrender.com"; 

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

  const res = await fetch(finalUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
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

    const res = await fetch(finalUrl, {
      credentials: "include",
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