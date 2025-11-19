import { Route, Redirect } from "wouter";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      component={(props: any) =>
        isAdmin ? <Component {...props} /> : <Redirect to="/not-found" />
      }
    />
  );
}
