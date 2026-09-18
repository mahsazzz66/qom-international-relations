import type { Dept } from "@/lib/data";
import { pickText } from "./read";
import type { BilingualText } from "./schema";

// Shared by the departments list page and each department's own detail page
// so both resolve admin overrides (title/listing/mission/interests/overview/
// projects/partners/meetings) the same way, by matching department index in
// DEPTS() to override index in the "departments" page_content list.
export type DeptOverride = {
  title?: BilingualText;
  listing?: BilingualText;
  mission?: BilingualText;
  interests?: BilingualText;
  overview?: BilingualText;
  projects?: BilingualText;
  partners?: BilingualText;
  meetings?: BilingualText;
};

// These were previously hardcoded, identical across every department, in
// DeptDetailView.tsx. They remain the fallback shown until an admin fills in
// department-specific text via the "departments" page in the admin panel.
export const OVERVIEW_DEFAULT = [
  "[Overview of the deputy department, its municipal mandate and the services it is responsible for.]",
  "[How the department works with counterparts abroad, coordinated through the International Relations Office.]",
];
export const PROJECTS_DEFAULT = [
  "[International project of the department — first]",
  "[International project of the department — second]",
  "[International project of the department — third]",
];
export const PARTNERS_DEFAULT = ["[Partner municipality]", "[International municipal network]", "[Technical cooperation programme]"];
export const MEETINGS_DEFAULT = [
  "[Meeting with a partner city delegation]",
  "[Working session with counterparts abroad]",
  "[Delegation hosted by the department in Qom]",
];

function resolveList(
  override: BilingualText | undefined,
  fallback: string[],
  locale: "en" | "ar",
  t: (s: string) => string
): string[] {
  const text = pickText(override, locale, "");
  return text
    ? text.split("\n").map((line) => line.trim()).filter(Boolean)
    : fallback.map((it) => t(it));
}

export function resolveDept(
  dept: Dept,
  index: number,
  overrides: DeptOverride[] | undefined,
  locale: "en" | "ar",
  t: (s: string) => string
): Dept & { interests: string[]; overview: string[]; projects: string[]; partners: string[]; meetings: string[] } {
  const o = overrides?.[index];
  const interestsText = pickText(o?.interests, locale, "");
  return {
    ...dept,
    title: pickText(o?.title, locale, t(dept.title)),
    listing: pickText(o?.listing, locale, t(dept.listing)),
    mission: pickText(o?.mission, locale, t(dept.mission)),
    interests: interestsText
      ? interestsText.split("\n").map((line) => line.trim()).filter(Boolean)
      : dept.interests.map((it) => t(it)),
    overview: resolveList(o?.overview, OVERVIEW_DEFAULT, locale, t),
    projects: resolveList(o?.projects, PROJECTS_DEFAULT, locale, t),
    partners: resolveList(o?.partners, PARTNERS_DEFAULT, locale, t),
    meetings: resolveList(o?.meetings, MEETINGS_DEFAULT, locale, t),
  };
}
