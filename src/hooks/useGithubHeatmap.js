import { useEffect, useMemo, useState } from "react";
const LEVELS = [0.07, 0.25, 0.45, 0.7, 1];
function getLevel(count) {
    if (count <= 0)
        return 0;
    if (count <= 2)
        return 1;
    if (count <= 5)
        return 2;
    if (count <= 8)
        return 3;
    return 4;
}
function generateFallback(total) {
    const today = new Date();
    const cells = [];
    for (let i = 364; i >= 0; i -= 1) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const weekday = date.getDay();
        const base = weekday === 0 || weekday === 6 ? 1 : 3;
        const wave = Math.max(0, Math.round(Math.sin(i / 19) * 3 + base));
        const bonus = i % 11 === 0 ? 4 : 0;
        const count = Math.min(12, wave + bonus + (total > 400 ? 1 : 0));
        cells.push({
            date: date.toISOString().slice(0, 10),
            count,
            level: getLevel(count),
        });
    }
    return cells;
}
function chunkWeeks(cells) {
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
        weeks.push({
            weekIndex: weeks.length,
            days: cells.slice(i, i + 7),
        });
    }
    return weeks;
}
function getMonthLabels(cells) {
    const labels = [];
    const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });
    cells.forEach((cell, index) => {
        const date = new Date(cell.date);
        if (date.getDate() <= 7) {
            labels.push({
                index: Math.floor(index / 7),
                label: monthFmt.format(date),
            });
        }
    });
    return labels.filter((entry, index, array) => index === array.findIndex((candidate) => candidate.label === entry.label));
}
export function useGithubHeatmap(username, contributionsLastYear) {
    const [cells, setCells] = useState(() => generateFallback(contributionsLastYear));
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        async function load() {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch("https://api.github.com/graphql", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        query: `
              query ($login: String!) {
                user(login: $login) {
                  contributionsCollection {
                    contributionCalendar {
                      weeks {
                        contributionDays {
                          date
                          contributionCount
                        }
                      }
                    }
                  }
                }
              }
            `,
                        variables: { login: username },
                    }),
                });
                if (!response.ok) {
                    throw new Error(`GitHub GraphQL request failed: ${response.status}`);
                }
                const json = await response.json();
                const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar
                    ?.weeks;
                if (!weeks) {
                    throw new Error("Contribution data missing");
                }
                const nextCells = weeks
                    .flatMap((week) => week.contributionDays)
                    .slice(-365)
                    .map((day) => ({
                    date: day.date,
                    count: day.contributionCount,
                    level: getLevel(day.contributionCount),
                }));
                if (!cancelled && nextCells.length > 0) {
                    setCells(nextCells);
                }
            }
            catch {
                if (!cancelled) {
                    setCells(generateFallback(contributionsLastYear));
                }
            }
            finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        void load();
        return () => {
            cancelled = true;
        };
    }, [contributionsLastYear, username]);
    return useMemo(() => ({
        loading,
        opacitySteps: LEVELS,
        weeks: chunkWeeks(cells),
        monthLabels: getMonthLabels(cells),
    }), [cells, loading]);
}
