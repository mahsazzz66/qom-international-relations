// Ported from `this.PAGES` / `this.NAVGROUP` in the source script — used to
// generate breadcrumb trails that always match the header's mega-menu groups.
export const PAGES: Record<string, { label: string; group?: string }> = {
  news: { label: "News" },
  about: { label: "About Us" },
  "about-qom": { label: "About Qom" },
  pcwg: { label: "Pilgrimage Cities Working Group" },
  cooperation: { label: "International Cooperation", group: "International Activities" },
  events: { label: "International Events & Participation", group: "International Activities" },
  meetings: { label: "International Meetings in Qom", group: "International Activities" },
  culture: { label: "Cultural Weeks & Festivals", group: "International Activities" },
  memberships: { label: "Memberships & Networks", group: "International Activities" },
  departments: { label: "Municipal Deputy Departments", group: "Municipality" },
  investment: { label: "Investment Opportunities", group: "Municipality" },
  feedback: { label: "Visitor Feedback", group: "Municipality" },
  media: { label: "Media & Publications" },
  contact: { label: "Contact" },
};
