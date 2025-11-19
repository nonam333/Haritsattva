import { useQuery } from "@tanstack/react-query";

export function useIsAdmin() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/admin/check"],
    queryFn: async () => {
      const response = await fetch("/api/admin/check", {
        credentials: "include",
      });

      if (response.status === 403 || response.status === 401) {
        return { isAdmin: false };
      }

      if (!response.ok) {
        throw new Error("Failed to check admin status");
      }

      return response.json();
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
