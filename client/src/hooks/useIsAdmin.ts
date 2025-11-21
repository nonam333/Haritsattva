import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useIsAdmin() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/admin/check"],
    queryFn: async () => {
      // Use getQueryFn to include Authorization header with token
      const queryFn = getQueryFn<{ isAdmin: boolean }>({ on401: "returnNull" });
      const result = await queryFn({ queryKey: ["/api/admin/check"], meta: undefined, signal: new AbortController().signal });

      if (!result) {
        return { isAdmin: false };
      }

      return result;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    isAdmin: data?.isAdmin || false,
    isLoading,
    error,
  };
}
