import { useLocation } from "react-router-dom";
import { AppErrorBoundary } from "./AppErrorBoundary";

type RouteAwareErrorBoundaryProps = {
  children: React.ReactNode;
};

export function RouteAwareErrorBoundary({
  children,
}: RouteAwareErrorBoundaryProps) {
  const location = useLocation();

  return (
    <AppErrorBoundary resetKey={location.pathname}>
      {children}
    </AppErrorBoundary>
  );
}