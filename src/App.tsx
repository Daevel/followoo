import { useMemo, useState } from "react";
import { FooterSignature } from "./components/ui/FooterSignature";
import { Button } from "./components/ui/Button";
import { Link, useNavigate } from "react-router-dom";

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
  const both = following.filter((u) => setA.has(u)); // mutuals (restricted to people you follow)

  onlyA.sort();
  onlyB.sort();
  both.sort();

  return {
    followersCount: followers.length,
    followingCount: following.length,
    onlyA,
    onlyB,
    both,
  };
}

export default function App() {
  const navigate = useNavigate();

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

  const list = result
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
    <section className="min-h-svh bg-(--color-bg)">
      <div className="mx-auto flex min-h-svh w-full max-w-100 flex-col items-center px-5 pt-20 gap-10 pb-6 text-center">
        <h1 className="text-4xl font-semibold leading-headers text-white">
          Followoo
        </h1>

        <p className="max-w-70 text-sm text-white/90">
          Welcome to follow/unfollow instagram compare app
        </p>

        <Link to="/instructions-to-start" className="text-base underline">
          Don't know how to start?
        </Link>

        <Button color="primary" onClick={() => navigate("/get-started")}>
          Get started →
        </Button>

        <img
          src="/images/illustration-body-female-concerned-home.svg"
          alt="illustration-hero-section"
          className="w-[min(220px,70%)]"
        />
        <FooterSignature />
      </div>
    </section>
  );
}
