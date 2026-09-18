import type { Dept } from "@/lib/data";
import { pickText } from "./read";
import type { BilingualText } from "./schema";

// Shared by the departments list page and each department's own detail page
// so both resolve admin overrides (title/listing/mission/interests) the same
// way, by matching department index in DEPTS() to override index in the
// "departments" page_content list.
export type DeptOverride = {
  title?: BilingualText;
  listing?: BilingualText;
  mission?: BilingualText;
  interests?: BilingualText;
};

export function resolveDept(
  dept: Dept,
  index: number,
  overrides: DeptOverride[] | undefined,
  locale: "en" | "ar",
  t: (s: string) => string
): Dept & { interests: string[] } {
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
  };
}
