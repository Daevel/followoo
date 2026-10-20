import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import { HistorySavePrompt } from "./HistorySavePrompt";

const useSyncKeyMock = vi.fn();
const saveSnapshotMock = vi.fn();
const toastSuccessMock = vi.fn();

vi.mock("@/providers/SyncKeyProvider", () => ({
  useSyncKey: () => useSyncKeyMock(),
}));

vi.mock("../hooks/useAutoSaveSnapshot", () => ({
  useAutoSaveSnapshot: () => ({ saveSnapshot: saveSnapshotMock }),
}));

vi.mock("@/services/toastService", () => ({
  toastService: { success: (...args: unknown[]) => toastSuccessMock(...args) },
}));

vi.mock("@/features/sync/components/SyncUnlockWizard", () => ({
  SyncUnlockWizard: () => <div role="dialog" aria-label="Unlock" />,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const analysis = {
  mutual: [],
  followersOnly: [],
  unfollowers: [],
  recentUnfollowers: [],
  blocked: [],
  restricted: [],
  closeFriends: [],
  hideStoriesFrom: [],
  pendingFollowRequests: [],
  recentFollowRequests: [],
  sourceCounts: { followers: 0, following: 0 },
} satisfies InstagramAnalysisResult;

describe("HistorySavePrompt", () => {
  it("offers to unlock and save while history is locked", async () => {
    useSyncKeyMock.mockReturnValue({ status: "locked" });
    render(<HistorySavePrompt analysis={analysis} />);

    expect(
      screen.getByText("This analysis isn't in your history yet")
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Unlock and save" }));
    expect(await screen.findByRole("dialog", { name: "Unlock" })).toBeTruthy();
  });

  it("goes away on Not now without saving", () => {
    useSyncKeyMock.mockReturnValue({ status: "locked" });
    render(<HistorySavePrompt analysis={analysis} />);

    fireEvent.click(screen.getByRole("button", { name: "Not now" }));

    expect(
      screen.queryByText("This analysis isn't in your history yet")
    ).toBeNull();
    expect(saveSnapshotMock).not.toHaveBeenCalled();
  });

  it("saves the analysis once history is unlocked", () => {
    useSyncKeyMock.mockReturnValue({ status: "locked" });
    saveSnapshotMock.mockReturnValue("saving");
    const { rerender } = render(<HistorySavePrompt analysis={analysis} />);

    useSyncKeyMock.mockReturnValue({ status: "unlocked" });
    rerender(<HistorySavePrompt analysis={analysis} />);

    expect(saveSnapshotMock).toHaveBeenCalledTimes(1);
    expect(saveSnapshotMock).toHaveBeenCalledWith(analysis);
    expect(toastSuccessMock).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByText("This analysis isn't in your history yet")
    ).toBeNull();
  });

  it("shows nothing when history isn't activated", () => {
    useSyncKeyMock.mockReturnValue({ status: "inactive" });
    const { container } = render(<HistorySavePrompt analysis={analysis} />);

    expect(container.innerHTML).toBe("");
  });
});
