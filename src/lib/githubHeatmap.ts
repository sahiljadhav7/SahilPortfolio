export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

export type HeatmapDay = {
  date: string;
  count: number;
  level: HeatmapLevel;
};

export type HeatmapCalendar = {
  total: number;
  days: HeatmapDay[];
};

// A null cell pads the first week so every column starts on Sunday.
export type HeatmapWeek = Array<HeatmapDay | null>;

export type MonthLabel = {
  weekIndex: number;
  label: string;
};

export type ContributionsResponse = {
  total?: { lastYear?: number };
  contributions?: Array<{ date: string; count: number; level: number }>;
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Dates are calendar days ("YYYY-MM-DD"); read them in UTC so the visitor's
// timezone can't shift a day onto its neighbour.
function utcDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

function toLevel(level: number): HeatmapLevel {
  return Math.min(4, Math.max(0, Math.round(level))) as HeatmapLevel;
}

export function toCalendar(json: ContributionsResponse): HeatmapCalendar | null {
  const contributions = json.contributions;
  if (!Array.isArray(contributions) || contributions.length === 0) return null;

  const days = contributions
    .map((day) => ({
      date: day.date,
      count: day.count,
      level: toLevel(day.level),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    total:
      json.total?.lastYear ?? days.reduce((sum, day) => sum + day.count, 0),
    days,
  };
}

export function toWeeks(days: HeatmapDay[]): HeatmapWeek[] {
  if (days.length === 0) return [];

  const padded: Array<HeatmapDay | null> = [
    ...Array<null>(utcDate(days[0].date).getUTCDay()).fill(null),
    ...days,
  ];

  const weeks: HeatmapWeek[] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

// A label is roughly three columns wide; one with less room before the next
// label (or the end of the grid) would overlap it, so GitHub skips it.
const LABEL_WEEKS = 3;

export function monthLabels(weeks: HeatmapWeek[]): MonthLabel[] {
  const labels: MonthLabel[] = [];
  let previousMonth: number | null = null;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.find((day) => day !== null);
    if (!firstDay) return;
    const month = utcDate(firstDay.date).getUTCMonth();
    if (month !== previousMonth) {
      labels.push({ weekIndex, label: MONTHS[month] });
      previousMonth = month;
    }
  });

  return labels.filter((label, index) => {
    const nextWeekIndex = labels[index + 1]?.weekIndex ?? weeks.length;
    return nextWeekIndex - label.weekIndex >= LABEL_WEEKS;
  });
}

export function emptyWeeks(today = new Date()): HeatmapWeek[] {
  const end = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const days: HeatmapDay[] = [];
  for (let i = 364; i >= 0; i -= 1) {
    days.push({
      date: new Date(end - i * 86_400_000).toISOString().slice(0, 10),
      count: 0,
      level: 0,
    });
  }
  return toWeeks(days);
}
