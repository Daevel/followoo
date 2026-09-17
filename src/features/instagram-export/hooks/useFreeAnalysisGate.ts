import { useAuth } from "@clerk/react";
import { useCallback, useEffect, useState } from "react";

export const FREE_ANALYSIS_FLAG_KEY = "followoo_free_analysis_used";

export function hasUsedFreeAnalysis(): boolean {
  try {
    return localStorage.getItem(FREE_ANALYSIS_FLAG_KEY) === "true";
  } catch {
    return false;
  }
}

export function markFreeAnalysisUsed(): void {
  try {
    localStorage.setItem(FREE_ANALYSIS_FLAG_KEY, "true");
  } catch {
    // Storage unavailable (private browsing, disabled site data, ...): the
    // gate just won't remember across sessions. Acceptable - this signal
    // is deliberately soft (see project-context), never a security
    // boundary; the hard boundary is the backend JWT check on every
    // authenticated endpoint.
  }
}

/**
 * Gates any analysis past the first anonymous one behind a Clerk session.
 * The flag lives only in the browser and is trivially bypassable - that's
 * fine, the anonymous analysis costs the backend nothing, so a bypass is a
 * lost funnel opportunity, not a security issue.
 */
export function useFreeAnalysisGate() {
  const { isSignedIn } = useAuth();
  const [needsAccountPrompt, setNeedsAccountPrompt] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      setNeedsAccountPrompt(false);
    }
  }, [isSignedIn]);

  const requestAnalysis = useCallback(() => {
    if (!isSignedIn && hasUsedFreeAnalysis()) {
      setNeedsAccountPrompt(true);
      return false;
    }

    return true;
  }, [isSignedIn]);

  const markAnalysisCompleted = useCallback(() => {
    if (!isSignedIn) {
      markFreeAnalysisUsed();
    }
  }, [isSignedIn]);

  return { needsAccountPrompt, requestAnalysis, markAnalysisCompleted };
}
