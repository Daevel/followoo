import { useAuth } from "@clerk/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ANALYTICS_EVENTS, analyticsService } from "@/analytics";
import { animateLoadingOut } from "@/animations/loading/useAnimateLoadingOut";
import { vercelBlobStructure } from "@/data/vercelBlobStructure";
import { handleAppError } from "@/errors";
import { analyzeInstagramExport } from "@/features/relationship/services/instagramAnalysisService";
import { logUsageEvent } from "@/features/users/services/usersService";
import { parseInstagramExport } from "../services/instagramExportService";
import { useFreeAnalysisGate } from "./useFreeAnalysisGate";

export type FileValidationState = "idle" | "checking" | "valid" | "invalid";

async function reportAnalysisUsage(
  getToken: () => Promise<string | null>
): Promise<void> {
  try {
    const token = await getToken();

    if (!token) return;

    await logUsageEvent(token, "analysis_run");
  } catch (error) {
    // Fire-and-forget: a failure here must never affect the analysis flow
    // the user already completed.
    handleAppError(error, {
      showToast: false,
      fallbackTitle: "Failed to log usage event",
    });
  }
}

export function useInstagramExportAnalysis({ isDemo }: { isDemo: boolean }) {
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  const { needsAccountPrompt, requestAnalysis, markAnalysisCompleted } =
    useFreeAnalysisGate();

  const [selectedZipFile, setSelectedZipFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] =
    useState(false);
  const [fileValidationState, setFileValidationState] =
    useState<FileValidationState>("idle");
  const [fileValidationMessage, setFileValidationMessage] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const loadingRef = useRef<HTMLDivElement | null>(null);
  const isTermsAccepted = isDemo || termsAndConditionsAccepted;
  const hasValidFile =
    isDemo || (Boolean(selectedZipFile) && fileValidationState === "valid");

  const validateFile = useCallback(async (file: File) => {
    setUploadError("");
    setFileValidationState("checking");
    setFileValidationMessage("");

    try {
      await parseInstagramExport(file);
      setFileValidationState("valid");
      setFileValidationMessage("Valid Instagram export detected.");
    } catch {
      setFileValidationState("invalid");
      setFileValidationMessage(
        "Invalid file format. Please upload a valid Instagram export ZIP downloaded from the Meta Accounts Center."
      );
    }
  }, []);

  useEffect(() => {
    let abortController: AbortController | null = null;

    const runEffect = async () => {
      if (isDemo) {
        setFileValidationState("valid");
        setFileValidationMessage("Valid Instagram export detected.");
        return;
      }

      if (!selectedZipFile) {
        setFileValidationState("idle");
        setFileValidationMessage("");
        return;
      }

      abortController = new AbortController();
      await validateFile(selectedZipFile);
    };

    void runEffect();

    return () => {
      abortController?.abort();
    };
  }, [selectedZipFile, isDemo, validateFile]);

  async function loadDemoZipFile() {
    const response = await fetch(vercelBlobStructure.demoFile);

    if (!response.ok) {
      handleAppError("error", {
        fallbackTitle: "Invalid file",
      });
      return;
    }

    const blob = await response.blob();

    return new File([blob], "demo-followoo-export.zip", {
      type: "application/zip",
    });
  }

  async function onElaborateFile() {
    if (isTransitioning) return;
    if (!hasValidFile) return;

    // The anonymous->account gate never applies to the demo flow, and
    // never calls the backend itself - it only reads a local flag plus
    // Clerk's already-loaded signed-in state.
    if (!isDemo && !requestAnalysis()) return;

    analyticsService.track(ANALYTICS_EVENTS.ANALYSIS_STARTED, {
      has_file: Boolean(selectedZipFile),
      terms_accepted: termsAndConditionsAccepted,
    });

    setUploadError("");
    setLoading(true);

    const minLoadingTime = 2500;
    const start = Date.now();

    try {
      const zipFile = isDemo ? await loadDemoZipFile() : selectedZipFile;

      if (!zipFile) {
        setUploadError("Failed to load the ZIP file. Please try again.");
        setLoading(false);
        return;
      }

      const exportData = await parseInstagramExport(zipFile);
      const analysis = analyzeInstagramExport(exportData);

      analyticsService.track(ANALYTICS_EVENTS.ANALYSIS_COMPLETED, {
        followers_count: exportData.followers.length,
        following_count: exportData.following.length,
        mutual_count: analysis.mutual.length,
        unfollowers_count: analysis.unfollowers.length,
        recent_unfollowers_count: analysis.recentUnfollowers.length,
        blocked_count: analysis.blocked.length,
        restricted_count: analysis.restricted.length,
        close_friends_count: analysis.closeFriends.length,
        pending_follow_requests_count: analysis.pendingFollowRequests.length,
        recent_follow_requests_count: analysis.recentFollowRequests.length,
      });

      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minLoadingTime - elapsed);

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      if (!isDemo) {
        markAnalysisCompleted();

        if (isSignedIn) {
          void reportAnalysisUsage(getToken);
        }
      }

      setIsTransitioning(true);

      if (loadingRef.current) {
        await animateLoadingOut(loadingRef.current);
      }

      navigate("/results", {
        state: analysis,
      });
    } catch (error) {
      handleAppError(error, {
        fallbackTitle: "Invalid file",
      });

      setLoading(false);
      setIsTransitioning(false);
    }
  }

  return {
    selectedZipFile,
    setSelectedZipFile,
    uploadError,
    setUploadError,
    loading,
    loadingRef,
    termsAndConditionsAccepted,
    setTermsAndConditionsAccepted,
    fileValidationState,
    setFileValidationState,
    fileValidationMessage,
    setFileValidationMessage,
    isTermsAccepted,
    hasValidFile,
    onElaborateFile,
    needsAccountPrompt,
  };
}
