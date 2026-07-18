import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ANALYTICS_EVENTS, analyticsService } from "@/analytics";
import { animateLoadingOut } from "@/animations/loading/useAnimateLoadingOut";
import { vercelBlobStructure } from "@/data/vercelBlobStructure";
import { handleAppError } from "@/errors";
import { compareFollowerSnapshots } from "@/features/relationship/services/followerSnapshotDiffService";
import { analyzeInstagramExport } from "@/features/relationship/services/instagramAnalysisService";
import { parseInstagramExport } from "../services/instagramExportService";

export type FileValidationState = "idle" | "checking" | "valid" | "invalid";

export function useInstagramExportAnalysis({ isDemo }: { isDemo: boolean }) {
  const navigate = useNavigate();

  const [selectedZipFile, setSelectedZipFile] = useState<File | null>(null);
  const [previousZipFile, setPreviousZipFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [previousUploadError, setPreviousUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] =
    useState(false);
  const [fileValidationState, setFileValidationState] =
    useState<FileValidationState>("idle");
  const [fileValidationMessage, setFileValidationMessage] = useState("");
  const [previousFileValidationState, setPreviousFileValidationState] =
    useState<FileValidationState>("idle");
  const [previousFileValidationMessage, setPreviousFileValidationMessage] =
    useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const loadingRef = useRef<HTMLDivElement | null>(null);
  const isTermsAccepted = isDemo || termsAndConditionsAccepted;
  const hasValidFile =
    isDemo || (Boolean(selectedZipFile) && fileValidationState === "valid");
  const hasValidPreviousFile =
    Boolean(previousZipFile) && previousFileValidationState === "valid";

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

  const validatePreviousFile = useCallback(async (file: File) => {
    setPreviousUploadError("");
    setPreviousFileValidationState("checking");
    setPreviousFileValidationMessage("");

    try {
      await parseInstagramExport(file);
      setPreviousFileValidationState("valid");
      setPreviousFileValidationMessage("Previous export detected.");
    } catch {
      setPreviousFileValidationState("invalid");
      setPreviousFileValidationMessage(
        "Invalid previous export. Please upload a valid Instagram export ZIP."
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

  useEffect(() => {
    let abortController: AbortController | null = null;

    const runEffect = async () => {
      if (!previousZipFile) {
        setPreviousFileValidationState("idle");
        setPreviousFileValidationMessage("");
        return;
      }

      abortController = new AbortController();
      await validatePreviousFile(previousZipFile);
    };

    void runEffect();

    return () => {
      abortController?.abort();
    };
  }, [previousZipFile, validatePreviousFile]);

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

      if (previousZipFile && hasValidPreviousFile) {
        const previousExportData = await parseInstagramExport(previousZipFile);
        analysis.followerSnapshotDiff = compareFollowerSnapshots(
          previousExportData,
          exportData
        );
      }

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
    previousZipFile,
    setPreviousZipFile,
    uploadError,
    setUploadError,
    previousUploadError,
    setPreviousUploadError,
    loading,
    loadingRef,
    termsAndConditionsAccepted,
    setTermsAndConditionsAccepted,
    fileValidationState,
    setFileValidationState,
    fileValidationMessage,
    setFileValidationMessage,
    previousFileValidationState,
    setPreviousFileValidationState,
    previousFileValidationMessage,
    setPreviousFileValidationMessage,
    isTermsAccepted,
    hasValidFile,
    onElaborateFile,
  };
}
