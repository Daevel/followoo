import { describe, expect, it } from "vitest";
import { buildInstagramExportZipFile } from "../__fixtures__/buildInstagramExportZipFile";
import {
  FIXTURE_BLOCKED,
  FIXTURE_FOLLOWERS,
  FIXTURE_FOLLOWING,
  FIXTURE_RECENTLY_UNFOLLOWED,
  labelValuesExportFiles,
  legacyStringListExportFiles,
} from "../__fixtures__/instagramExportFixtures";
import { parseInstagramExport } from "./instagramExportService";

function usernamesOf(users: { username: string }[]): string[] {
  return users.map((user) => user.username).sort();
}

describe("parseInstagramExport", () => {
  it("normalizes the historical string_list_data export into the expected shape", async () => {
    const file = await buildInstagramExportZipFile(legacyStringListExportFiles);
    const result = await parseInstagramExport(file);

    expect(usernamesOf(result.followers)).toEqual(
      [...FIXTURE_FOLLOWERS].sort()
    );
    expect(usernamesOf(result.following)).toEqual(
      [...FIXTURE_FOLLOWING].sort()
    );
    expect(usernamesOf(result.recentlyUnfollowed)).toEqual([
      ...FIXTURE_RECENTLY_UNFOLLOWED,
    ]);
    expect(usernamesOf(result.blocked)).toEqual([...FIXTURE_BLOCKED]);
  });

  it("normalizes the newer label_values export into the expected shape", async () => {
    const file = await buildInstagramExportZipFile(labelValuesExportFiles);
    const result = await parseInstagramExport(file);

    expect(usernamesOf(result.followers)).toEqual(
      [...FIXTURE_FOLLOWERS].sort()
    );
    expect(usernamesOf(result.following)).toEqual(
      [...FIXTURE_FOLLOWING].sort()
    );
    expect(usernamesOf(result.recentlyUnfollowed)).toEqual([
      ...FIXTURE_RECENTLY_UNFOLLOWED,
    ]);
    expect(usernamesOf(result.blocked)).toEqual([...FIXTURE_BLOCKED]);
  });

  it("produces the same normalized output for both export formats", async () => {
    const legacyFile = await buildInstagramExportZipFile(
      legacyStringListExportFiles
    );
    const labelValuesFile = await buildInstagramExportZipFile(
      labelValuesExportFiles
    );

    const legacyResult = await parseInstagramExport(legacyFile);
    const labelValuesResult = await parseInstagramExport(labelValuesFile);

    expect(usernamesOf(legacyResult.followers)).toEqual(
      usernamesOf(labelValuesResult.followers)
    );
    expect(usernamesOf(legacyResult.following)).toEqual(
      usernamesOf(labelValuesResult.following)
    );
    expect(usernamesOf(legacyResult.recentlyUnfollowed)).toEqual(
      usernamesOf(labelValuesResult.recentlyUnfollowed)
    );
    expect(usernamesOf(legacyResult.blocked)).toEqual(
      usernamesOf(labelValuesResult.blocked)
    );
    expect(Object.keys(legacyResult)).toEqual(Object.keys(labelValuesResult));
  });

  it("ignores unrelated JSON files and ignores non-JSON entries", async () => {
    const file = await buildInstagramExportZipFile({
      ...legacyStringListExportFiles,
      "connections/other/unrelated.json": { some: "data" },
      "readme.txt": "not json",
    });

    const result = await parseInstagramExport(file);

    expect(usernamesOf(result.followers)).toEqual(
      [...FIXTURE_FOLLOWERS].sort()
    );
  });

  it("throws an AppError when the ZIP contains no supported relationship data", async () => {
    const file = await buildInstagramExportZipFile({
      "connections/other/unrelated.json": { some: "data" },
    });

    await expect(parseInstagramExport(file)).rejects.toMatchObject({
      code: "INVALID_INSTAGRAM_EXPORT",
    });
  });

  it("throws an AppError when the file is not a valid ZIP", async () => {
    const invalidZipFile = new File(["not a zip"], "broken.zip", {
      type: "application/zip",
    });

    await expect(parseInstagramExport(invalidZipFile)).rejects.toMatchObject({
      code: "INVALID_ZIP_FILE",
    });
  });
});
