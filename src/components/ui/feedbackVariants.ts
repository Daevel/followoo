import type { IconName } from "./Icon";

export type FeedbackVariant = "info" | "success" | "warning" | "danger";

// Shared by Callout and Toast: the variant lives in the icon (shape + color),
// surfaces stay neutral. The only tinted surface is the blocking-error Callout.
export const feedbackVariants: Record<
  FeedbackVariant,
  { icon: IconName; iconClass: string }
> = {
  info: { icon: "help", iconClass: "text-brand-fg" },
  success: { icon: "checkCircle", iconClass: "text-success" },
  warning: { icon: "warning", iconClass: "text-warning" },
  danger: { icon: "warning", iconClass: "text-danger" },
};
