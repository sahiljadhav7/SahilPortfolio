import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cleanTitle,
  toContributions,
  topRepositories,
  type Contribution,
} from "./openSource.ts";

test("cleanTitle strips a conventional-commit prefix and capitalises", () => {
  assert.equal(
    cleanTitle("fix(harvest): throw AuthMissingError when access token is missing"),
    "Throw AuthMissingError when access token is missing",
  );
});

test("cleanTitle keeps a leading word that is not a commit type", () => {
  assert.equal(
    cleanTitle("Spotify: remove example webhook"),
    "Spotify: remove example webhook",
  );
});

test("cleanTitle strips a leading issue reference", () => {
  assert.equal(
    cleanTitle("Fixes #34622: Honor auto-classification sample budget beyond 50 rows"),
    "Honor auto-classification sample budget beyond 50 rows",
  );
});

test("cleanTitle strips an issue reference and a commit type together", () => {
  assert.equal(cleanTitle("Fixes #12: fix(parser): handle empty input"), "Handle empty input");
});

test("cleanTitle strips a trailing issue reference", () => {
  assert.equal(
    cleanTitle("fix: align movable solfege in widgets and getSolfege (Related to #2050)"),
    "Align movable solfege in widgets and getSolfege",
  );
  assert.equal(
    cleanTitle("feat(slack): clickable questions on human decisions (#193)"),
    "Clickable questions on human decisions",
  );
});

function searchItem(
  repo: string,
  number: number,
  title: string,
  state: "open" | "closed",
  mergedAt: string | null,
  createdAt: string,
) {
  return {
    number,
    title,
    html_url: `https://github.com/${repo}/pull/${number}`,
    state,
    created_at: createdAt,
    repository_url: `https://api.github.com/repos/${repo}`,
    pull_request: { merged_at: mergedAt },
  };
}

test("toContributions keeps merged and open PRs and drops closed-unmerged ones", () => {
  const contributions = toContributions([
    searchItem("corsairdev/corsair", 1821, "fix(spotify): remove generator example webhook", "closed", "2026-10-05T10:00:00Z", "2026-10-04T09:00:00Z"),
    searchItem("corsairdev/corsair", 1817, "fix(spotify): remove generator example webhook", "closed", null, "2026-10-03T09:00:00Z"),
    searchItem("supabase/supabase", 50547, "fix(docs): document local_smtp config and deprecate inbucket", "open", null, "2026-10-02T09:00:00Z"),
  ]);

  assert.deepEqual(contributions, [
    {
      repo: "corsairdev/corsair",
      number: 1821,
      title: "Remove generator example webhook",
      url: "https://github.com/corsairdev/corsair/pull/1821",
      status: "merged",
      createdAt: "2026-10-04T09:00:00Z",
    },
    {
      repo: "supabase/supabase",
      number: 50547,
      title: "Document local_smtp config and deprecate inbucket",
      url: "https://github.com/supabase/supabase/pull/50547",
      status: "open",
      createdAt: "2026-10-02T09:00:00Z",
    },
  ]);
});

test("toContributions orders newest first", () => {
  const contributions = toContributions([
    searchItem("sugarlabs/musicblocks", 8799, "fix: play temperament octave once during playback", "closed", "2026-09-01T00:00:00Z", "2026-08-20T00:00:00Z"),
    searchItem("corsairdev/corsair", 1848, "fix(reddit): return null post in getComments when the post is missing", "open", null, "2026-10-05T00:00:00Z"),
    searchItem("sugarlabs/musicblocks", 9019, "fix: align movable solfege", "closed", "2026-09-27T00:00:00Z", "2026-09-25T00:00:00Z"),
  ]);

  assert.deepEqual(
    contributions.map((c) => c.number),
    [1848, 9019, 8799],
  );
});

function contribution(repo: string, number: number, createdAt: string): Contribution {
  return {
    repo,
    number,
    title: `PR ${number}`,
    url: `https://github.com/${repo}/pull/${number}`,
    status: "merged",
    createdAt,
  };
}

test("topRepositories ranks by count, breaks ties by most recent, and keeps the top 3", () => {
  const top = topRepositories(
    [
      contribution("corsairdev/corsair", 1848, "2026-10-05T00:00:00Z"),
      contribution("supabase/supabase", 50547, "2026-10-04T00:00:00Z"),
      contribution("corsairdev/corsair", 1821, "2026-10-03T00:00:00Z"),
      contribution("mvschwarz/openrig", 195, "2026-10-01T00:00:00Z"),
      contribution("sugarlabs/musicblocks", 9019, "2026-09-25T00:00:00Z"),
      contribution("corsairdev/corsair", 1816, "2026-09-20T00:00:00Z"),
      contribution("mvschwarz/openrig", 155, "2026-09-10T00:00:00Z"),
      contribution("sugarlabs/musicblocks", 8799, "2026-08-20T00:00:00Z"),
    ],
    "sahiljadhav7",
  );

  assert.deepEqual(top, [
    {
      repo: "corsairdev/corsair",
      count: 3,
      url: "https://github.com/corsairdev/corsair/pulls?q=is%3Apr+author%3Asahiljadhav7",
    },
    {
      repo: "mvschwarz/openrig",
      count: 2,
      url: "https://github.com/mvschwarz/openrig/pulls?q=is%3Apr+author%3Asahiljadhav7",
    },
    {
      repo: "sugarlabs/musicblocks",
      count: 2,
      url: "https://github.com/sugarlabs/musicblocks/pulls?q=is%3Apr+author%3Asahiljadhav7",
    },
  ]);
});
