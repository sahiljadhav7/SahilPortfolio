const CONVENTIONAL_PREFIX =
  /^(fix|feat|docs|chore|refactor|perf|test|build|ci|style|revert)(\([^)]*\))?!?:\s*/i;
const LEADING_ISSUE_REF = /^(fix(es|ed)?|close[sd]?|resolve[sd]?)\s+#\d+:\s*/i;
const TRAILING_ISSUE_REF = /\s*\((related to\s+)?#\d+\)$/i;

export function cleanTitle(title: string): string {
  const cleaned = title
    .trim()
    .replace(CONVENTIONAL_PREFIX, "")
    .replace(LEADING_ISSUE_REF, "")
    .replace(TRAILING_ISSUE_REF, "");
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export type ContributionStatus = "merged" | "open";

export type Contribution = {
  repo: string;
  number: number;
  title: string;
  url: string;
  status: ContributionStatus;
  createdAt: string;
};

export type SearchItem = {
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  repository_url: string;
  pull_request?: { merged_at: string | null };
};

export function toContributions(items: SearchItem[]): Contribution[] {
  const contributions = items.flatMap((item): Contribution[] => {
    const merged = Boolean(item.pull_request?.merged_at);
    if (!merged && item.state !== "open") return [];
    return [
      {
        repo: item.repository_url.replace("https://api.github.com/repos/", ""),
        number: item.number,
        title: cleanTitle(item.title),
        url: item.html_url,
        status: merged ? "merged" : "open",
        createdAt: item.created_at,
      },
    ];
  });
  return contributions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export type TopRepository = {
  repo: string;
  count: number;
  url: string;
};

export function topRepositories(
  contributions: Contribution[],
  login: string,
  limit = 3,
): TopRepository[] {
  const byRepo = new Map<string, { count: number; latest: string }>();
  for (const { repo, createdAt } of contributions) {
    const entry = byRepo.get(repo) ?? { count: 0, latest: createdAt };
    entry.count += 1;
    if (createdAt > entry.latest) entry.latest = createdAt;
    byRepo.set(repo, entry);
  }

  const query = new URLSearchParams({ q: `is:pr author:${login}` });
  return [...byRepo.entries()]
    .sort(
      ([, a], [, b]) => b.count - a.count || b.latest.localeCompare(a.latest),
    )
    .slice(0, limit)
    .map(([repo, { count }]) => ({
      repo,
      count,
      url: `https://github.com/${repo}/pulls?${query}`,
    }));
}
