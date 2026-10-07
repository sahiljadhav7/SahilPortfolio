import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyWeeks,
  monthLabels,
  toCalendar,
  toWeeks,
  type HeatmapDay,
} from "./githubHeatmap.ts";

function day(date: string, count = 0): HeatmapDay {
  return { date, count, level: 0 };
}

test("toCalendar keeps the reported total and the API's levels", () => {
  const calendar = toCalendar({
    total: { lastYear: 7 },
    contributions: [
      { date: "2026-10-05", count: 1, level: 1 },
      { date: "2026-10-04", count: 6, level: 3 },
    ],
  });
  assert.deepEqual(calendar, {
    total: 7,
    days: [
      { date: "2026-10-04", count: 6, level: 3 },
      { date: "2026-10-05", count: 1, level: 1 },
    ],
  });
});

test("toCalendar sums counts when the total is missing", () => {
  const calendar = toCalendar({
    contributions: [
      { date: "2026-10-04", count: 2, level: 1 },
      { date: "2026-10-05", count: 3, level: 2 },
    ],
  });
  assert.equal(calendar?.total, 5);
});

test("toCalendar rejects a response without contributions", () => {
  assert.equal(toCalendar({}), null);
  assert.equal(toCalendar({ contributions: [] }), null);
});

test("toWeeks starts each column on Sunday", () => {
  // 2026-10-07 is a Wednesday.
  const weeks = toWeeks([
    day("2026-10-07"),
    day("2026-10-08"),
    day("2026-10-09"),
    day("2026-10-10"),
    day("2026-10-11"),
  ]);
  assert.equal(weeks.length, 2);
  assert.deepEqual(weeks[0].slice(0, 3), [null, null, null]);
  assert.equal(weeks[0][3]?.date, "2026-10-07");
  assert.equal(weeks[1][0]?.date, "2026-10-11");
});

function week(date: string): Array<HeatmapDay | null> {
  return [day(date)];
}

test("monthLabels labels both ends of a year that wraps the same month", () => {
  const labels = monthLabels([
    week("2025-10-05"),
    week("2025-10-12"),
    week("2025-10-19"),
    week("2025-11-02"),
    week("2025-11-09"),
    week("2025-11-16"),
    week("2026-10-04"),
    week("2026-10-11"),
    week("2026-10-18"),
  ]);
  assert.deepEqual(labels, [
    { weekIndex: 0, label: "Oct" },
    { weekIndex: 3, label: "Nov" },
    { weekIndex: 6, label: "Oct" },
  ]);
});

test("monthLabels skips a label with no room before the next one", () => {
  const labels = monthLabels([
    week("2026-08-30"),
    week("2026-09-06"),
    week("2026-09-13"),
    week("2026-09-20"),
    week("2026-10-04"),
  ]);
  // August has one column before September; October has one before the end.
  assert.deepEqual(labels, [{ weekIndex: 1, label: "Sep" }]);
});

test("monthLabels uses the first real day of a padded week", () => {
  // 2026-08-03 is a Monday; the padded first column belongs to August.
  const labels = monthLabels([
    [null, day("2026-08-03")],
    week("2026-08-09"),
    week("2026-08-16"),
  ]);
  assert.deepEqual(labels, [{ weekIndex: 0, label: "Aug" }]);
});

test("emptyWeeks covers a year ending today with no activity", () => {
  const weeks = emptyWeeks(new Date(2026, 9, 7));
  const days = weeks.flat().filter((cell) => cell !== null);
  assert.equal(days.length, 365);
  assert.equal(days.at(-1)?.date, "2026-10-07");
  assert.ok(days.every((cell) => cell.count === 0));
});
