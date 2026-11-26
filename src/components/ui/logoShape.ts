// The Followoo logo: a ghost with a round head and a tail that flicks to
// the right, drawn for Followoo (it replaced a free stock icon). Geometry in a
// 120 x 120 frame, shared by public/favicon.svg, the app icons and the
// analysis loading screen. The mascot will be this same shape with a face.

/** The logo's outline, without the face. */
export const LOGO_BODY =
  "M55 9C31 9 15 28 15 52V63C15 88 34 109 59 109H99C102.5 109 104.5 105 102.3 102C96 93.5 92.5 83.5 92.5 72.5V52C92.5 28 79 9 55 9Z";

/** Eyes and mouth: rounded rectangles, cut out of the body in the flat logo. */
export const LOGO_EYES = [
  { x: 36, y: 40, width: 10, height: 20, rx: 5 },
  { x: 64, y: 40, width: 10, height: 20, rx: 5 },
] as const;
export const LOGO_MOUTH = {
  x: 48,
  y: 67,
  width: 14,
  height: 6,
  rx: 3,
} as const;

/** The square that frames the logo with even margins (favicon viewBox). */
export const LOGO_VIEWBOX = "7 7 104 104";
/** Center of LOGO_VIEWBOX, to place the logo around a point. */
export const LOGO_CENTER = 59;
