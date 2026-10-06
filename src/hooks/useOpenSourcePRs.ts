import { useEffect, useMemo, useState } from "react";
import {
  toContributions,
  topRepositories,
  type Contribution,
  type SearchItem,
} from "@/lib/openSource";

function cacheKey(login: string) {
  return `open-source-prs:${login}`;
}

function readCache(login: string): Contribution[] {
  try {
    const raw = window.localStorage.getItem(cacheKey(login));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Contribution[]) : [];
  } catch {
    return [];
  }
}

function writeCache(login: string, contributions: Contribution[]) {
  try {
    window.localStorage.setItem(cacheKey(login), JSON.stringify(contributions));
  } catch {
    // Storage can be full or blocked; the live data is still shown.
  }
}

export function useOpenSourcePRs(login: string) {
  const [contributions, setContributions] = useState<Contribution[]>(() =>
    readCache(login),
  );
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const query = `is:pr author:${login} -user:${login}`;

    async function load() {
      try {
        const params = new URLSearchParams({
          q: query,
          sort: "created",
          order: "desc",
          per_page: "100",
        });
        const response = await fetch(
          `https://api.github.com/search/issues?${params}`,
          { headers: { Accept: "application/vnd.github+json" } },
        );

        if (!response.ok) {
          throw new Error(`GitHub search request failed: ${response.status}`);
        }

        const json = await response.json();
        const items = json?.items as SearchItem[] | undefined;
        if (!items) {
          throw new Error("Search results missing");
        }

        const next = toContributions(items);
        if (!cancelled) {
          setContributions(next);
          setFailed(false);
          writeCache(login, next);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [login]);

  return useMemo(
    () => ({
      contributions,
      topRepositories: topRepositories(contributions, login),
      loading,
      failed,
      allPRsUrl: `https://github.com/search?${new URLSearchParams({
        q: `is:pr author:${login} -user:${login}`,
        type: "pullrequests",
      })}`,
    }),
    [contributions, failed, loading, login],
  );
}
