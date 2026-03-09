import type { ComponentProps, SVGProps } from "react";

import CheckCircle from "../../icons/check-circle.svg?react";
import CheckCircleOutline from "../../icons/check-circle-outline.svg?react";
import ChevronDoubleRight from "../../icons/keyboard-double-arrow-right.svg?react";
import ChevronDoubleLeft from "../../icons/keyboard-double-arrow-left.svg?react";
import Warning from "../../icons/warning.svg?react";
import Trash from "../../icons/delete.svg?react";
import Help from "../../icons/question-mark.svg?react";
import Upload from "../../icons/upload.svg?react";
import SendMail from "../../icons/send-mail.svg?react";
import ArrowRight from "../../icons/arrow-right.svg?react"
import ArrowLeft from "../../icons/arrow-left.svg?react";
import Check from "../../icons/check.svg?react";

const icons = {
  checkCircle: CheckCircle,
  checkCircleOutline: CheckCircleOutline,
  chevronDoubleRight: ChevronDoubleRight,
  chevronDoubleLeft: ChevronDoubleLeft,
  warning: Warning,
  trash: Trash,
  help: Help,
  upload: Upload,
  sendMail: SendMail,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  check: Check,
} as const;

export type IconName = keyof typeof icons;

export type IconColor = "primary" | "accent" | "bg" | "foreground";

const colorClasses: Record<IconColor, string> = {
  primary: "text-primary",
  accent: "text-accent",
  bg: "text-bg",
  foreground: "text-foreground",
};

type Props = {
  name: IconName;
  title?: string;
  color?: IconColor;
} & Omit<SVGProps<SVGSVGElement>, "children">;

export function Icon({
  name,
  title,
  color = "foreground",
  className,
  ...props
}: Props) {
  const Svg = icons[name];

  const a11yProps: ComponentProps<"svg"> = title
    ? { role: "img" }
    : { "aria-hidden": true };

  return (
    <Svg
      {...a11yProps}
      {...props}
      className={`${colorClasses[color]} ${className ?? ""}`}
    >
      {title ? <title>{title}</title> : null}
    </Svg>
  );
}