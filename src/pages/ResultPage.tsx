import { Navigate, useLocation } from "react-router";
import { ResultsExperience } from "@/features/results/components/ResultsExperience";
import type { InstagramAnalysisResult } from "@/types/instagram.types";

export function ResultPage() {
  const location = useLocation();
  const analysis = location.state as InstagramAnalysisResult | undefined;

  if (!analysis) {
    return <Navigate to="/get-started" replace />;
  }

  return <ResultsExperience analysis={analysis} />;
}
