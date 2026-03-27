export type UpdateChangeGroup = {
  label: string;
  tone: "accent" | "primary";
  items: string[];
};

export type PublicUpdateListItem = {
  id: string;
  slug: string;
  productName: string;
  version: string;
  releaseDate: string;
  description: string;
  badgeBackgroundColor?: string;
  groups: UpdateChangeGroup[];
  publishedAt: string | null;
};
