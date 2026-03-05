import type { ComponentProps, SVGProps } from "react";

import CheckCircle from "../icons/check-circle.svg?react";
import CheckCircleOutline from "../icons/check-circle-outline.svg?react";
import ChevronDoubleRight from "../icons/keyboard-double-arrow-right.svg?react";
import ChevronDoubleLeft from "../icons/keyboard-double-arrow-left.svg?react";
import Warning from "../icons/warning.svg?react";
import Trash from "../icons/delete.svg?react";
import Help from "../icons/question-mark.svg?react";

const icons = {
  checkCircle: CheckCircle,
  checkCircleOutline: CheckCircleOutline,
  chevronDoubleRight: ChevronDoubleRight,
  chevronDoubleLeft: ChevronDoubleLeft,
  warning: Warning,
  trash: Trash,
  help: Help,
} as const;

export type IconName = keyof typeof icons;

type Props = {
  name: IconName;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, "children">;

export function Icon({ name, title, className, ...props }: Props) {
  const Svg = icons[name];

  const a11yProps: ComponentProps<"svg"> = title
    ? { role: "img" }
    : { "aria-hidden": true };

  return (
    <Svg {...a11yProps} {...props} className={className}>
      {title ? <title>{title}</title> : null}
    </Svg>
  );
}