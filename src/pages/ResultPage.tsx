import { Navigate, useLocation } from "react-router";
import { ResultsExperience } from "@/features/results/components/ResultsExperience";
import type { ResultsLocationState } from "@/features/results/types/results.types";

export function ResultPage() {
  const location = useLocation();
  const state = location.state as ResultsLocationState | undefined;

  if (!state?.analysis) {
    return <Navigate to="/get-started" replace />;
  }

  return (
    <ResultsExperience
      analysis={state.analysis}
      isHistorySavePending={state.isHistorySavePending}
    />
  );
}
