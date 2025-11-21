import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  // Debug: Log user data with full details
  console.log('[useAuth] User data:', JSON.stringify(user, null, 2));

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
