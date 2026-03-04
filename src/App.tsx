import React, { useMemo, useState } from "react";

function safeJsonParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: e?.message || "Invalid JSON" };
  }
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(new Error("Failed reading file"));
    r.readAsText(file);
  });
}

function usernameFromHref(href) {
  if (!href || typeof href !== "string") return null;
  const m = href.match(/instagram\.com\/(?:_u\/)?([^/?#]+)/i);
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

function normalizeUsername(u) {
  if (!u || typeof u !== "string") return null;
  return u.trim().replace(/^@/, "").toLowerCase();
}

function extractFollowers(json) {
  // supports: raw array OR { relationships_followers: [...] }
  const arr = Array.isArray(json) ? json : json?.relationships_followers;
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item) => {
      const v = item?.string_list_data?.[0]?.value;
      const h = item?.string_list_data?.[0]?.href;
      return normalizeUsername(v || usernameFromHref(h));
    })
    .filter(Boolean);
}

function extractFollowing(json) {
  // supports: { relationships_following: [...] }
  const arr = json?.relationships_following;
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item) => {
      const t = item?.title;
      const h = item?.string_list_data?.[0]?.href;
      return normalizeUsername(t || usernameFromHref(h));
    })
    .filter(Boolean);
}

function unique(arr) {
  return [...new Set(arr)];
}

function compareLists(followersJson, followingJson) {
  const followers = unique(extractFollowers(followersJson));
  const following = unique(extractFollowing(followingJson));

  const setA = new Set(followers);
  const setB = new Set(following);

  const onlyA = followers.filter((u) => !setB.has(u)); // follows you, you don't follow
  const onlyB = following.filter((u) => !setA.has(u)); // you follow, they don't follow back
  const both = following.filter((u) => setA.has(u));   // mutuals (restricted to people you follow)

  onlyA.sort();
  onlyB.sort();
  both.sort();

  return { followersCount: followers.length, followingCount: following.length, onlyA, onlyB, both };
}

export default function App() {
  const [followersFile, setFollowersFile] = useState(null);
  const [followingFile, setFollowingFile] = useState(null);

  const [followersJson, setFollowersJson] = useState(null);
  const [followingJson, setFollowingJson] = useState(null);

  const [activeTab, setActiveTab] = useState("onlyB"); // onlyA | onlyB | both
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const result = useMemo(() => {
    if (!followersJson || !followingJson) return null;
    return compareLists(followersJson, followingJson);
  }, [followersJson, followingJson]);

  async function handleCompare() {
    setErr("");
    if (!followersFile || !followingFile) {
      setErr("Please select both files.");
      return;
    }

    setLoading(true);
    try {
      const [textA, textB] = await Promise.all([
        readFileAsText(followersFile),
        readFileAsText(followingFile),
      ]);

      const pa = safeJsonParse(textA);
      const pb = safeJsonParse(textB);

      if (!pa.ok) throw new Error(`Followers JSON error: ${pa.error}`);
      if (!pb.ok) throw new Error(`Following JSON error: ${pb.error}`);

      setFollowersJson(pa.value);
      setFollowingJson(pb.value);
    } catch (e) {
      setFollowersJson(null);
      setFollowingJson(null);
      setErr(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const list =
    result
      ? activeTab === "onlyA"
        ? result.onlyA
        : activeTab === "both"
          ? result.both
          : result.onlyB
      : [];

  function copyList() {
    navigator.clipboard?.writeText(list.join("\n"));
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 16, display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Instagram compare (upload files)</h2>
      <div style={{ opacity: 0.8 }}>
        Upload <b>followers.json</b> as List A and <b>following.json</b> as List B. Then check{" "}
        <b>Only in list B</b>.
      </div>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
        <label style={{ display: "grid", gap: 6 }}>
          <b>List A (Followers)</b>
          <input
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              setFollowersFile(e.target.files?.[0] ?? null);
              setFollowersJson(null);
            }}
          />
          {followersFile && <span style={{ opacity: 0.7, fontSize: 12 }}>{followersFile.name}</span>}
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <b>List B (Following)</b>
          <input
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              setFollowingFile(e.target.files?.[0] ?? null);
              setFollowingJson(null);
            }}
          />
          {followingFile && <span style={{ opacity: 0.7, fontSize: 12 }}>{followingFile.name}</span>}
        </label>
      </div>

      <button onClick={handleCompare} disabled={loading || !followersFile || !followingFile}>
        {loading ? "Comparing..." : "Compare"}
      </button>

      {err && <div style={{ color: "crimson" }}>{err}</div>}

      {result && (
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ opacity: 0.85 }}>
            Parsed followers: <b>{result.followersCount}</b> · Parsed following:{" "}
            <b>{result.followingCount}</b>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveTab("onlyA")}
              style={{ fontWeight: activeTab === "onlyA" ? 700 : 400 }}
            >
              Only in list A ({result.onlyA.length})
            </button>
            <button
              onClick={() => setActiveTab("both")}
              style={{ fontWeight: activeTab === "both" ? 700 : 400 }}
            >
              In both ({result.both.length})
            </button>
            <button
              onClick={() => setActiveTab("onlyB")}
              style={{ fontWeight: activeTab === "onlyB" ? 700 : 400 }}
            >
              Only in list B ({result.onlyB.length})
            </button>

            <button onClick={copyList} disabled={!list.length} style={{ marginLeft: "auto" }}>
              Copy
            </button>
          </div>

          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            {list.slice(0, 300).map((u) => (
              <li key={u}>
                <a href={`https://www.instagram.com/${u}/`} target="_blank" rel="noreferrer">
                  {u}
                </a>
              </li>
            ))}
          </ul>

          {list.length > 300 && <div style={{ opacity: 0.7 }}>Showing first 300 results…</div>}
        </div>
      )}
    </div>
  );
}