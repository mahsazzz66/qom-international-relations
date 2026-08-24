// Ported 1:1 from the placeholder data-generation logic in the original
// prototype (design-export/Qom International Relations.dc.html, the
// `Component extends DCLogic` script block). These are deterministic,
// pure functions — no randomness — so the same lists render identically
// on the server and the client.

export type NewsItem = {
  id: string;
  kind: "news" | "msg";
  cat: string;
  title: string;
  excerpt: string;
  y: number;
  m: number;
  d: number;
  stamp: number;
};

export const ARCH_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function buildMonths(): [number, number][] {
  const months: [number, number][] = [];
  for (let y = 2026; y >= 2024; y--) {
    const top = y === 2026 ? 8 : 12;
    for (let m = top; m >= 1; m--) months.push([y, m]);
  }
  return months;
}

let _newsCache: NewsItem[] | null = null;
export function NEWS(): NewsItem[] {
  if (_newsCache) return _newsCache;
  const H: Record<string, string[]> = {
    "International Meetings": [
      "[Meeting with the mayor of a partner city at Qom Municipality]",
      "[Working session with an international municipal association]",
      "[Bilateral meeting on pilgrimage city management]",
      "[Meeting with a visiting ambassador at the International Office]",
    ],
    "International Delegations": [
      "[Delegation from a partner municipality visits Qom]",
      "[Technical delegation reviews urban services in Qom]",
      "[Delegation of mayors received by the International Office]",
      "[Qom delegation visits a partner city abroad]",
    ],
    "Agreements & Cooperation": [
      "[Memorandum of understanding signed with a partner city]",
      "[Cooperation agreement concluded on heritage conservation]",
      "[Twinning agreement renewed for a further term]",
      "[Joint programme agreed with an international municipal network]",
    ],
    "Pilgrimage Cities": [
      "[Working Group session convened in Qom]",
      "[Shared standards for pilgrimage city management reviewed]",
      "[New member city joins the Pilgrimage Cities Working Group]",
      "[Working Group report on visitor management published]",
    ],
    "Events & Conferences": [
      "[Qom participates in an international municipal conference]",
      "[International exhibition hosted by the municipality]",
      "[Cultural week programme opens in Qom]",
      "[Forum on urban services for pilgrim cities convened]",
    ],
    "Investment": [
      "[Investment opportunity presented to international partners]",
      "[Briefing for foreign investors on municipal projects]",
      "[Joint investment project announced with a partner city]",
      "[Investment file published by the municipal deputy department]",
    ],
    "Urban Diplomacy": [
      "[Urban diplomacy programme launched with partner cities]",
      "[Municipal cooperation roundtable held in Qom]",
      "[City-to-city dialogue on shared urban challenges]",
      "[Urban diplomacy training for municipal staff concluded]",
    ],
    "Announcements": [
      "[Announcement of an international programme of the municipality]",
      "[Call for participation in an international municipal initiative]",
      "[Procedure announced for international visit requests]",
      "[Notice on the international cooperation calendar]",
    ],
  };
  const E: Record<string, string> = {
    "International Meetings": "Short excerpt describing the meeting and its participants.",
    "International Delegations": "Short excerpt describing the delegation and the programme.",
    "Agreements & Cooperation": "Short excerpt describing the scope of the agreement.",
    "Pilgrimage Cities": "Short excerpt describing the session and participating cities.",
    "Events & Conferences": "Short excerpt describing the conference and the delegation representing Qom.",
    "Investment": "Short excerpt describing the opportunity and the terms offered to partners.",
    "Urban Diplomacy": "Short excerpt describing the programme and the cities taking part.",
    "Announcements": "Short excerpt of the announcement issued by the department.",
  };
  const cats = Object.keys(H);
  const out: NewsItem[] = [];
  const months = buildMonths();
  let n = 0;
  months.forEach((ym, mi) => {
    const per = mi % 3 === 0 ? 3 : 2;
    for (let k = 0; k < per; k++) {
      const cat = cats[(mi * 3 + k * 5) % cats.length];
      const titles = H[cat];
      const d = 26 - k * 8;
      out.push({
        id: "n" + n, kind: "news", cat,
        title: titles[(mi + k) % titles.length],
        excerpt: E[cat], y: ym[0], m: ym[1], d,
        stamp: ym[0] * 10000 + ym[1] * 100 + d,
      });
      n++;
    }
  });
  _newsCache = out;
  return out;
}

let _msgCache: NewsItem[] | null = null;
export function MSGS(): NewsItem[] {
  if (_msgCache) return _msgCache;
  const K: [string, string, string][] = [
    ["Official Message", "[Message of the Mayor of Qom to partner municipalities]", "Text of the official message, addressed to the mayors and councils of partner and pilgrimage cities, to be supplied by the Office of the Mayor."],
    ["Congratulations", "[Message of congratulation on a national or religious occasion]", "Congratulatory message issued to a partner city, institution or international body on the occasion indicated by the department."],
    ["Condolence", "[Message of condolence to a partner city]", "Expression of sympathy issued by the municipality on behalf of the citizens of Qom."],
    ["Municipal Statement", "[Statement of the municipality on an international matter]", "Formal position of Qom Municipality on a matter of international municipal cooperation."],
    ["Announcement", "[Formal announcement of the municipality]", "Announcement concerning an international programme, appointment or procedure of the municipality."],
    ["Official Position", "[Official position on an international question]", "Position adopted by the municipality and published through the International Relations Department."],
  ];
  const out: NewsItem[] = [];
  const months = buildMonths();
  let n = 0;
  months.forEach((ym, mi) => {
    const per = mi % 4 === 0 ? 2 : 1;
    for (let k = 0; k < per; k++) {
      const r = K[(mi + k * 2) % K.length];
      const d = 21 - k * 11;
      out.push({
        id: "s" + n, kind: "msg", cat: r[0], title: r[1], excerpt: r[2],
        y: ym[0], m: ym[1], d, stamp: ym[0] * 10000 + ym[1] * 100 + d,
      });
      n++;
    }
  });
  _msgCache = out;
  return out;
}

export function findItem(id: string | null | undefined): NewsItem | null {
  if (!id) return null;
  const all = [...NEWS(), ...MSGS()];
  return all.find((x) => x.id === id) || null;
}

export function articleParas(it: NewsItem): string[] {
  return it.kind === "msg"
    ? [
        it.excerpt,
        "[Full text of the message or statement, first paragraph — supplied by the issuing office.]",
        "[Second paragraph of the official text.]",
        "[Closing formula, signature and office of issue.]",
      ]
    : [
        it.excerpt,
        "[Opening paragraph of the report: what took place, where, and who took part.]",
        "[Second paragraph: the substance of the meeting, agreement or programme, as recorded by the department.]",
        "[Third paragraph: quotation from the participating official.]",
        "[Closing paragraph: the next steps and the municipal department responsible for them.]",
      ];
}

export function relatedFor(it: NewsItem, count = 3): NewsItem[] {
  const pool = it.kind === "msg" ? MSGS() : NEWS();
  const same = pool.filter((x) => x.id !== it.id && x.cat === it.cat).sort((a, b) => b.stamp - a.stamp);
  const rest = pool.filter((x) => x.id !== it.id && x.cat !== it.cat).sort((a, b) => b.stamp - a.stamp);
  return same.concat(rest).slice(0, count);
}

export function fmtDate(it: { d: number; m: number; y: number }, t: (s: string) => string = (s) => s): string {
  return `${it.d} ${t(ARCH_MONTHS[it.m - 1])} ${it.y}`;
}

export interface ListFilters {
  query?: string;
  category?: string;
  year?: string;
  month?: string;
  sort?: "new" | "old";
}

export function filterList(data: NewsItem[], f: ListFilters): NewsItem[] {
  const q = String(f.query || "").trim().toLowerCase();
  const cat = f.category || "all";
  const yr = f.year || "all";
  const mo = f.month || "all";
  const sort = f.sort || "new";
  const out = data.filter(
    (it) =>
      (cat === "all" || it.cat === cat) &&
      (yr === "all" || it.y === parseInt(yr, 10)) &&
      (mo === "all" || it.m === parseInt(mo, 10)) &&
      (!q || (it.title + " " + it.cat + " " + it.excerpt).toLowerCase().indexOf(q) > -1)
  );
  out.sort((a, b) => (sort === "old" ? a.stamp - b.stamp : b.stamp - a.stamp));
  return out;
}

// ── Investment opportunities ──────────────────────────────────────────
export type InvestmentItem = {
  id: string;
  ref: string;
  cat: string;
  base: string;
  district: string;
  title: string;
  summary: string;
  status: string;
  type: string;
  start: { d: number; m: number; y: number };
  end: { d: number; m: number; y: number };
  lat: string;
  lng: string;
  order: number;
};

let _investCache: InvestmentItem[] | null = null;
export function INVEST(): InvestmentItem[] {
  if (_investCache) return _investCache;
  const C: [string, string, string][] = [
    ["Urban Development", "Urban regeneration site", "Mixed-use regeneration of a municipal parcel, offered to a partner on a long lease."],
    ["Smart City Projects", "Smart city systems programme", "Municipal digital infrastructure and service platforms open to a technology partner."],
    ["Transportation", "Transport and access project", "Passenger, parking and access infrastructure serving pilgrim movement through the city."],
    ["Tourism Infrastructure", "Pilgrim accommodation project", "Accommodation, catering and visitor services within reach of the shrine precinct."],
    ["Cultural Projects", "Cultural venue project", "A cultural building and its public programme, delivered with an international partner."],
    ["Technology & Innovation", "Innovation district project", "Workspace and shared services for technology enterprises established in Qom."],
  ];
  const D = ["Central District", "Shrine Precinct", "Northern District", "Eastern District", "Pardisan", "Jamkaran Corridor"];
  const S = ["Open for participation", "In preparation", "Under review"];
  const T = ["Build–operate–transfer", "Joint venture", "Long lease", "Participation agreement"];
  const out: InvestmentItem[] = [];
  for (let i = 0; i < 18; i++) {
    const c = C[i % C.length];
    const d = D[(i * 5 + Math.floor(i / 6)) % D.length];
    out.push({
      id: "i" + (i + 1),
      ref: "QOM-INV-" + (2026 - (i % 3)) + "-" + (101 + i),
      cat: c[0], base: c[1], district: d,
      title: "[" + c[1] + " — " + d + "]",
      summary: c[2],
      status: S[i % S.length],
      type: T[(i * 3) % T.length],
      start: { d: 1 + ((i * 7) % 27), m: (i % 12) + 1, y: 2026 },
      end: { d: 5 + ((i * 5) % 24), m: ((i + 7) % 12) + 1, y: 2028 + (i % 2) },
      lat: (34.6416 + ((i * 13) % 37) / 1000).toFixed(4),
      lng: (50.8746 + ((i * 17) % 37) / 1000).toFixed(4),
      order: 1000 - i,
    });
  }
  _investCache = out;
  return out;
}

export function findInv(id: string | null | undefined): InvestmentItem | null {
  if (!id) return null;
  return INVEST().find((x) => x.id === id) || null;
}

export interface InvestFilters {
  query?: string;
  category?: string;
  district?: string;
  status?: string;
  sort?: "new" | "az" | "cat" | "district";
}

export function invFilter(f: InvestFilters): InvestmentItem[] {
  const q = String(f.query || "").trim().toLowerCase();
  const out = INVEST().filter(
    (it) =>
      (f.category || "all") === "all" || it.cat === f.category
  ).filter(
    (it) => (f.district || "all") === "all" || it.district === f.district
  ).filter(
    (it) => (f.status || "all") === "all" || it.status === f.status
  ).filter(
    (it) =>
      !q ||
      (it.title + " " + it.cat + " " + it.district + " " + it.summary + " " + it.ref).toLowerCase().indexOf(q) > -1
  );
  const sort = f.sort || "new";
  out.sort((a, b) =>
    sort === "az"
      ? a.title.localeCompare(b.title)
      : sort === "cat"
      ? a.cat === b.cat ? b.order - a.order : a.cat.localeCompare(b.cat)
      : sort === "district"
      ? a.district === b.district ? b.order - a.order : a.district.localeCompare(b.district)
      : b.order - a.order
  );
  return out;
}

// ── Deputy departments ────────────────────────────────────────────────
export type Dept = {
  id: string;
  no: string;
  title: string;
  hero: string;
  ink: string;
  mission: string;
  /** The longer paragraph the listing page uses; the detail page uses `mission`. */
  listing: string;
  interests: string[];
  newsCat: string;
  motif: string;
};

let _deptsCache: Dept[] | null = null;
export function DEPTS(): Dept[] {
  if (_deptsCache) return _deptsCache;
  _deptsCache = [
    {
      id: "planning", no: "01", title: "Planning & Human Resources Development", hero: "#C8A75D", ink: "#8A6D24",
      mission: "The counterpart for capacity building, staff training exchanges and administrative cooperation with partner municipalities.",
      listing: "Responsible for municipal planning, staffing and organisational development. In international work it is the counterpart for capacity building, staff training exchanges and administrative cooperation with partner municipalities.",
      interests: ["Training exchange", "Municipal administration", "Organisational practice"], newsCat: "Urban Diplomacy",
      motif: '<circle cx="60" cy="52" r="15"/><circle cx="100" cy="40" r="11" opacity=".6"/><circle cx="140" cy="52" r="15" opacity=".8"/><path d="M30 118c0-19 13-32 30-32s30 13 30 32M110 118c0-19 13-32 30-32s30 13 30 32"/><path d="M100 58v34" opacity=".5"/>',
    },
    {
      id: "technical", no: "02", title: "Technical & Civil Affairs", hero: "#00A8A8", ink: "#0B6E6E",
      mission: "The counterpart for infrastructure standards, technical review practice and engineering knowledge exchange.",
      listing: "Responsible for municipal engineering and construction. Internationally it is the counterpart for infrastructure standards, technical review practice and engineering knowledge exchange.",
      interests: ["Infrastructure standards", "Construction practice", "Technical review"], newsCat: "Agreements & Cooperation",
      motif: '<path d="M20 120h160"/><path d="M40 120V56l60-30 60 30v64"/><path d="M40 84h120M100 26v94" opacity=".55"/><circle cx="100" cy="60" r="9"/>',
    },
    {
      id: "environment", no: "03", title: "Environment & Urban Services", hero: "#7FBE8E", ink: "#3D7A52",
      mission: "The counterpart for environmental cooperation and municipal service benchmarking.",
      listing: "Responsible for environmental management, waste, green space and day-to-day urban services. Internationally it is the counterpart for environmental cooperation and municipal service benchmarking.",
      interests: ["Waste management", "Green space", "Service delivery"], newsCat: "Events & Conferences",
      motif: '<path d="M100 118V54"/><path d="M100 62c0-22 18-40 44-40 0 22-18 40-44 40zM100 82c0-19-16-34-38-34 0 19 16 34 38 34" opacity=".85"/><path d="M24 112c14-10 28-10 42 0s28 10 42 0 28-10 42 0" opacity=".45"/>',
    },
    {
      id: "transport", no: "04", title: "Transportation & Traffic", hero: "#E2946A", ink: "#9A4E24",
      mission: "The counterpart for visitor-flow planning — a shared concern among cities that receive large seasonal arrivals.",
      listing: "Responsible for mobility, public transport and traffic management. Internationally it is the counterpart for visitor-flow planning — a shared concern among cities that receive large seasonal arrivals.",
      interests: ["Public transport", "Visitor flow", "Traffic systems"], newsCat: "Pilgrimage Cities",
      motif: '<rect x="44" y="34" width="112" height="62" rx="8"/><path d="M44 66h112" opacity=".55"/><circle cx="70" cy="110" r="10"/><circle cx="130" cy="110" r="10"/><path d="M24 122h152" opacity=".4"/><path d="M62 48h24M114 48h24" opacity=".7"/>',
    },
    {
      id: "finance", no: "05", title: "Financial & Economic Affairs", hero: "#7FA8D8", ink: "#2F5D91",
      mission: "The counterpart for investment discussions and municipal finance cooperation.",
      listing: "Responsible for municipal finance and the city's economic portfolio. Internationally it is the counterpart for investment discussions and municipal finance cooperation.",
      interests: ["Investment facilitation", "Municipal finance", "Economic partnerships"], newsCat: "Investment",
      motif: '<path d="M24 120h152"/><rect x="38" y="80" width="26" height="40"/><rect x="80" y="56" width="26" height="64"/><rect x="122" y="34" width="26" height="86" opacity=".8"/><path d="M38 66l42-24 42-22" opacity=".5"/>',
    },
    {
      id: "architecture", no: "06", title: "Architecture & Urban Development", hero: "#C79BB8", ink: "#7E4A6D",
      mission: "The counterpart for heritage conservation and urban design cooperation, including the shrine precinct.",
      listing: "Responsible for urban design, planning permission and development of the city fabric, including the shrine precinct area. Internationally it is the counterpart for heritage conservation and urban design cooperation.",
      interests: ["Heritage conservation", "Urban design", "Precinct planning"], newsCat: "International Delegations",
      motif: '<path d="M24 120h152"/><path d="M64 120V70a36 36 0 0 1 72 0v50"/><path d="M100 34V16M86 120V84a14 14 0 0 1 28 0v36" opacity=".7"/><path d="M40 120V88M160 120V88" opacity=".45"/>',
    },
  ];
  return _deptsCache;
}

export function findDept(id: string | null | undefined): Dept {
  const l = DEPTS();
  return l.find((d) => d.id === id) || l[0];
}

// ── Search index ──────────────────────────────────────────────────────
export function searchIndex(): { title: string; kind: string; page: string }[] {
  const rows: [string, string, string][] = [
    ["Home", "Page", ""],
    ["News", "Page", "news"],
    ["About Us", "Page", "about"],
    ["About Qom", "Page", "about-qom"],
    ["Messages & Statements", "Page", "news"],
    ["International Cooperation", "Page", "cooperation"],
    ["Municipal Deputy Departments", "Page", "departments"],
    ["Pilgrimage Cities Working Group", "Page", "pcwg"],
    ["Memberships & Networks", "Page", "memberships"],
    ["International Events & Participation", "Page", "events"],
    ["International Meetings in Qom", "Page", "meetings"],
    ["Cultural Weeks & Festivals", "Page", "culture"],
    ["Investment Opportunities", "Page", "investment"],
    ["Urban Development", "Opportunity", "investment"],
    ["Smart City Projects", "Opportunity", "investment"],
    ["Transportation", "Opportunity", "investment"],
    ["Tourism Infrastructure", "Opportunity", "investment"],
    ["Cultural Projects", "Opportunity", "investment"],
    ["Technology & Innovation", "Opportunity", "investment"],
    ["Visitor Feedback", "Page", "feedback"],
    ["Media & Publications", "Page", "media"],
    ["Contact", "Page", "contact"],
    ["International Meetings", "News", "news"],
    ["International Delegations", "News", "news"],
    ["Agreements & Cooperation", "News", "news"],
    ["Urban Diplomacy", "News", "news"],
    ["Pilgrimage Cities", "News", "news"],
    ["Conferences", "Event", "events"],
    ["Cultural Weeks", "Event", "culture"],
    ["Meetings & Activities", "Event", "pcwg"],
    ["Meetings in Qom", "Meeting", "meetings"],
    ["Hosted in Qom", "Meeting", "meetings"],
    ["Online from Qom", "Meeting", "meetings"],
    ["Photo Gallery", "Publication", "media"],
    ["Video Gallery", "Publication", "media"],
    ["Publications & Reports", "Publication", "media"],
    ["Press Kit", "Publication", "media"],
    ["Documents", "Document", "pcwg"],
    ["[Statute of the Working Group]", "Document", "pcwg"],
    ["[Minutes of the latest plenary]", "Document", "pcwg"],
    ["[Application guidance for cities]", "Document", "pcwg"],
    ["Memberships", "Page", "memberships"],
    ["Investment", "Page", "investment"],
    ["Frequently asked questions", "Page", "contact"],
    ["Qom at a Glance", "Page", "about-qom"],
    ["Holy Shrine of Hazrat Fatima Masumeh (SA)", "City", "about-qom"],
    ["Jamkaran Mosque", "City", "about-qom"],
    ["Religious Authorities & the Hawza", "City", "about-qom"],
    ["Historical & Tourist Attractions", "City", "about-qom"],
    ["Handicrafts & Local Culture", "City", "about-qom"],
    ["Qom, Negine Iran Zamin", "Publication", "about-qom"],
    ["Visiting Qom", "Page", "about-qom"],
    ["Official Message", "Statement", "news"],
    ["Municipal Statement", "Statement", "news"],
    ["Congratulations", "Statement", "news"],
    ["Condolence", "Statement", "news"],
    ["Announcement", "Statement", "news"],
    ["Official Position", "Statement", "news"],
  ];
  const cities = ["Qom", "Mashhad", "Shiraz", "Karbala", "Najaf", "Mecca", "Medina", "Damascus", "Hebron", "Samarra", "Samarkand", "Bukhara", "Konya", "Sanliurfa", "Varanasi", "Lahore", "Turkistan"];
  cities.forEach((c) => rows.push([c, "City", "pcwg"]));
  return rows.map((r) => ({ title: r[0], kind: r[1], page: r[2] }));
}

export function pageList(page: number, pages: number): (number | "gap")[] {
  const keep: Record<number, boolean> = {};
  [1, pages, page, page - 1, page + 1].forEach((p) => { keep[p] = true; });
  if (page <= 3) [2, 3, 4].forEach((p) => { keep[p] = true; });
  if (page >= pages - 2) [pages - 1, pages - 2, pages - 3].forEach((p) => { keep[p] = true; });
  const nums = Object.keys(keep).map(Number).filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  nums.forEach((p, i) => {
    if (i && p - nums[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}
