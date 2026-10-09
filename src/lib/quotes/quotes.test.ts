import { describe, expect, it } from "vitest";
import { dayInTimeZone, pickDailyId } from "./daily";
import { segmentText } from "./highlight";
import { sourceLabel } from "./labels";

describe("segmentText", () => {
  const text = "By all means, move at a glacial pace.";

  it("resalta los rangos y conserva el resto del texto", () => {
    const segments = segmentText(text, [
      { id: "b", start: 19, end: 36 },
      { id: "a", start: 0, end: 12 },
    ]);
    expect(segments.map((s) => s.text).join("")).toBe(text);
    expect(segments.filter((s) => s.id).map((s) => s.text)).toEqual([
      "By all means",
      "at a glacial pace",
    ]);
  });

  it("ignora rangos inválidos, fuera de límites o solapados", () => {
    const segments = segmentText(text, [
      { id: "ok", start: 0, end: 2 },
      { id: "overlap", start: 1, end: 5 },
      { id: "out", start: 30, end: 999 },
      { id: "neg", start: -1, end: 3 },
      { id: "empty", start: 5, end: 5 },
    ]);
    expect(segments.filter((s) => s.id).map((s) => s.id)).toEqual(["ok"]);
    expect(segments.map((s) => s.text).join("")).toBe(text);
  });
});

describe("dayInTimeZone", () => {
  it("cambia de día a medianoche de Madrid, no en UTC", () => {
    // 22:30 UTC del 8 de octubre = 00:30 del 9 en Madrid (CEST, UTC+2).
    expect(dayInTimeZone(new Date("2026-10-08T22:30:00Z"))).toBe("2026-10-09");
    expect(dayInTimeZone(new Date("2026-10-08T21:30:00Z"))).toBe("2026-10-08");
  });
});

describe("pickDailyId", () => {
  const ids = ["a", "b", "c"];

  it("es determinista para el mismo día", () => {
    expect(pickDailyId(ids, "2026-10-08")).toBe(pickDailyId(ids, "2026-10-08"));
  });

  it("rota día a día por toda la lista", () => {
    const week = ["2026-10-08", "2026-10-09", "2026-10-10"].map((d) => pickDailyId(ids, d));
    expect(new Set(week).size).toBe(3);
  });

  it("devuelve null sin citas o con una fecha no válida", () => {
    expect(pickDailyId([], "2026-10-08")).toBeNull();
    expect(pickDailyId(ids, "no-es-fecha")).toBeNull();
  });
});

describe("sourceLabel", () => {
  const work = { title: "The Wire", type: "series" as const, year: 2002 };
  it("formatea temporada y episodio", () => {
    expect(sourceLabel({ work, season: 1, episode: 8 })).toBe("The Wire (2002) · T1 E8");
    expect(sourceLabel({ work, season: 3, episode: null })).toBe("The Wire (2002) · Temporada 3");
    expect(sourceLabel({ work, season: null, episode: null })).toBe("The Wire (2002)");
  });
});
