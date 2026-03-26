import type { ComponentProps, SVGProps } from "react";

import ArrowLeft from "../../icons/arrow-left.svg?react";
import ArrowRight from "../../icons/arrow-right.svg?react";
import CheckCircleOutline from "../../icons/check-circle-outline.svg?react";
import CheckCircle from "../../icons/check-circle.svg?react";
import Check from "../../icons/check.svg?react";
import Close from "../../icons/close.svg?react";
import Code from "../../icons/code.svg?react";
import Trash from "../../icons/delete.svg?react";
import Download from "../../icons/download.svg?react";
import Eye from "../../icons/eye.svg?react";
import HappyFace from "../../icons/happy-face.svg?react";
import ChevronDoubleLeft from "../../icons/keyboard-double-arrow-left.svg?react";
import ChevronDoubleRight from "../../icons/keyboard-double-arrow-right.svg?react";
import Laptop from "../../icons/laptop.svg?react";
import LinkOff from "../../icons/link-off.svg?react";
import Locker from "../../icons/lock.svg?react";
import Menu from "../../icons/menu.svg?react";
import NeutralFace from "../../icons/neutral-face.svg?react";
import UserCheck from "../../icons/person-check.svg?react";
import Help from "../../icons/question-mark.svg?react";
import SadFace from "../../icons/sad-face.svg?react";
import SendMail from "../../icons/send-mail.svg?react";
import Shield from "../../icons/shield.svg?react";
import SingleArrowDown from "../../icons/single-arrow-down.svg?react";
import SingleArrowLeft from "../../icons/single-arrow-left.svg?react";
import SingleArrowRight from "../../icons/single-arrow-right.svg?react";
import SingleArrowUp from "../../icons/single-arrow-up.svg?react";
import Upload from "../../icons/upload.svg?react";
import Warning from "../../icons/warning.svg?react";

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
  singleArrowRight: SingleArrowRight,
  singleArrowLeft: SingleArrowLeft,
  singleArrowUp: SingleArrowUp,
  singleArrowDown: SingleArrowDown,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  check: Check,
  close: Close,
  shield: Shield,
  menu: Menu,
  download: Download,
  eye: Eye,
  lock: Locker,
  laptop: Laptop,
  userCheck: UserCheck,
  linkOff: LinkOff,
  code: Code,
  happyFace: HappyFace,
  neutralFace: NeutralFace,
  sadFace: SadFace,
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
