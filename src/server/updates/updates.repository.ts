import type { PublicUpdateListItem } from "../../data/updates/updates.types";
import { sql } from "../db/neon";

export async function getPublishedUpdates(): Promise<PublicUpdateListItem[]> {
  const rows = await sql`
    SELECT
      id,
      slug,
      title,
      excerpt,
      content,
      version,
      is_published,
      published_at,
      created_at,
      updated_at
    FROM updates
    WHERE is_published = true
    ORDER BY published_at DESC NULLS LAST
  `;

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    version: row.version,
    publishedAt: row.published_at,
  }));
}
