import { Route, Redirect } from "wouter";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  if (isAuthLoading || isAdminLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      component={(props: any) => {
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }
        return isAdmin ? <Component {...props} /> : <Redirect to="/not-found" />;
      }}
    />
  );
}
