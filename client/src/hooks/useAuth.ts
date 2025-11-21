import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  // Extract user from response (API returns { user: {...} })
  const user = data?.user || null;

  // Debug: Log user data with full details
  console.log('[useAuth] Raw data:', JSON.stringify(data, null, 2));
  console.log('[useAuth] Extracted user:', JSON.stringify(user, null, 2));

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
