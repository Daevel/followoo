import type { PublicUpdateListItem } from "../../data/updates/updates.types.js";
import { sql } from "../db/neon.js";

type UpdateGroup = {
  label: string;
  tone: "accent" | "primary";
  items: string[];
};

type UpdateRow = {
  id: string;
  slug: string;
  product_name: string;
  version: string;
  release_date: string;
  description: string;
  badge_background_color: string | null;
  groups: UpdateGroup[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getPublishedUpdates(): Promise<PublicUpdateListItem[]> {
  const rows = (await sql`
    SELECT
      id,
      slug,
      product_name,
      version,
      release_date,
      description,
      badge_background_color,
      groups,
      is_published,
      published_at,
      created_at,
      updated_at
    FROM updates
    WHERE is_published = true
    ORDER BY published_at DESC NULLS LAST
  `) as UpdateRow[];

  return rows.map((row) => ({
    id: row.id,
    productName: row.product_name,
    version: row.version,
    releaseDate: row.release_date,
    description: row.description,
    badgeBackgroundColor: row.badge_background_color ?? "accent",
    groups: row.groups ?? [],
    slug: row.slug,
    publishedAt: row.published_at,
  }));
}
