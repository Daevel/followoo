import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "../src/server/db/neon.js";

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  try {
    const rows = await sql`
      SELECT
        id,
        slug,
        version,
        is_published,
        published_at
      FROM updates
      ORDER BY published_at DESC NULLS LAST
    `;

    const publishedRows = await sql`
      SELECT
        id,
        slug,
        version,
        is_published,
        published_at
      FROM updates
      WHERE is_published = true
      ORDER BY published_at DESC NULLS LAST
    `;

    const dbName = await sql`
      SELECT current_database() AS database_name
    `;

    return res.status(200).json({
      debug: {
        hasDatabaseUrl: Boolean(process.env.FOLLOWOO_DATABASE_URL),
        databaseName: dbName,
        totalRows: rows.length,
        publishedRows: publishedRows.length,
      },
      allRows: rows,
      data: publishedRows,
    });
  } catch (error) {
    console.error("Failed to inspect updates", error);

    return res.status(500).json({
      error: "Failed to inspect updates",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
