import { useEffect, useMemo, useState } from "react";
import {
  emptyWeeks,
  monthLabels,
  toCalendar,
  toWeeks,
  type ContributionsResponse,
  type HeatmapCalendar,
} from "@/lib/githubHeatmap";

const LEVELS = [0.07, 0.25, 0.45, 0.7, 1] as const;

function cacheKey(login: string) {
  return `github-heatmap:${login}`;
}

function readCache(login: string): HeatmapCalendar | null {
  try {
    const raw = window.localStorage.getItem(cacheKey(login));
    const parsed = raw ? (JSON.parse(raw) as HeatmapCalendar) : null;
    return parsed && Array.isArray(parsed.days) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(login: string, calendar: HeatmapCalendar) {
  try {
    window.localStorage.setItem(cacheKey(login), JSON.stringify(calendar));
  } catch {
    // Storage can be full or blocked; the live data is still shown.
  }
}

export function useGithubHeatmap(login: string) {
  const [calendar, setCalendar] = useState<HeatmapCalendar | null>(() =>
    readCache(login),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Public mirror of the contribution calendar on the GitHub profile;
        // needs no token, so nothing secret ships in the bundle.
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(login)}?y=last`,
        );

        if (!response.ok) {
          throw new Error(`Contributions request failed: ${response.status}`);
        }

        const next = toCalendar((await response.json()) as ContributionsResponse);
        if (!next) {
          throw new Error("Contribution data missing");
        }

        if (!cancelled) {
          setCalendar(next);
          writeCache(login, next);
        }
      } catch {
        // Keep showing the cached calendar; with none, the section links to
        // the GitHub profile instead.
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

  return useMemo(() => {
    const weeks = calendar ? toWeeks(calendar.days) : emptyWeeks();
    return {
      loading,
      unavailable: !loading && !calendar,
      total: calendar?.total ?? null,
      opacitySteps: LEVELS,
      weeks,
      monthLabels: monthLabels(weeks),
    };
  }, [calendar, loading]);
}
