import type { PageSchema } from "./schema";

// Every editable page lives here as one schema. To make a new page editable,
// add an entry to this array (and read it the same way an existing page
// does) — no new admin UI is needed, PageContentEditor renders any schema.

export const PAGE_SCHEMAS: PageSchema[] = [
  {
    page: "home",
    url: "/",
    title: "صفحه اصلی",
    description: "اسلایدشو، نوار میانبرها، بخش درباره ما، حوزه‌های همکاری و بخش کارگروه شهرهای زیارتی در صفحه اول.",
    fields: [
      {
        key: "slides",
        label: "اسلایدهای هیرو",
        type: "list",
        itemLabel: "اسلاید",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "description", label: "توضیح", type: "textarea" },
          { key: "image", label: "تصویر پس‌زمینه", type: "image" },
        ],
      },
      {
        key: "ribbon",
        label: "نوار میانبرها (زیر هیرو)",
        type: "list",
        itemLabel: "میانبر",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "sub", label: "زیرعنوان", type: "text" },
        ],
      },
      { key: "about_heading", label: "عنوان بخش «درباره ما»", type: "text" },
      { key: "about_body", label: "متن بخش «درباره ما»", type: "textarea" },
      {
        key: "mission_vision",
        label: "مأموریت و چشم‌انداز",
        type: "list",
        itemLabel: "مورد",
        fields: [
          { key: "title", label: "عنوان (مثلاً Mission)", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
        ],
      },
      { key: "objectives", label: "اهداف (هر مورد در یک خط جدید)", type: "textarea" },
      {
        key: "cooperation_areas",
        label: "حوزه‌های همکاری بین‌المللی",
        type: "list",
        itemLabel: "حوزه",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "desc", label: "توضیح", type: "textarea" },
        ],
      },
      { key: "pcwg_heading", label: "عنوان بخش کارگروه شهرهای زیارتی", type: "text" },
      { key: "pcwg_mandate", label: "توضیح مأموریت کارگروه", type: "textarea" },
      {
        key: "pcwg_current_members",
        label: "شهرهای عضو فعلی (نمای کوچک صفحه اصلی)",
        type: "list",
        itemLabel: "گروه کشور",
        fields: [
          { key: "label", label: "کشور(ها)", type: "text" },
          { key: "cities", label: "شهرها", type: "text" },
        ],
      },
      {
        key: "pcwg_proposed_members",
        label: "شهرهای پیشنهادی/آینده (نمای کوچک صفحه اصلی)",
        type: "list",
        itemLabel: "گروه کشور",
        fields: [
          { key: "label", label: "کشور(ها)", type: "text" },
          { key: "cities", label: "شهرها", type: "text" },
        ],
      },
    ],
  },
  {
    page: "about",
    url: "/about",
    title: "درباره ما",
    description: "متن معرفی، اهداف، ساختار سازمانی و ارکان استراتژی.",
    fields: [
      { key: "hero_title", label: "عنوان اصلی صفحه", type: "text" },
      { key: "hero_description", label: "توضیح زیر عنوان", type: "textarea" },
      {
        key: "objectives",
        label: "اهداف",
        type: "list",
        itemLabel: "هدف",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
        ],
      },
      {
        key: "structure",
        label: "ساختار سازمانی",
        type: "list",
        itemLabel: "واحد",
        fields: [
          { key: "title", label: "عنوان واحد", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
        ],
      },
      {
        key: "pillars",
        label: "ارکان استراتژی بین‌الملل",
        type: "list",
        itemLabel: "رکن",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
        ],
      },
    ],
  },
  {
    page: "about-qom",
    url: "/about-qom",
    title: "درباره قم",
    description: "آمار شهر، جاذبه‌های گردشگری و اطلاعات بازدید.",
    fields: [
      { key: "hero_title", label: "عنوان اصلی صفحه", type: "text" },
      { key: "hero_description", label: "توضیح زیر عنوان", type: "textarea" },
      {
        key: "glance",
        label: "قم در یک نگاه (آمار)",
        type: "list",
        itemLabel: "آیتم آماری",
        fields: [
          { key: "label", label: "عنوان آمار", type: "text" },
          { key: "value", label: "مقدار", type: "text" },
          { key: "body", label: "توضیح کوتاه", type: "textarea" },
        ],
      },
      {
        key: "attractions",
        label: "جاذبه‌های گردشگری",
        type: "list",
        itemLabel: "جاذبه",
        fields: [
          { key: "category", label: "دسته‌بندی", type: "text" },
          { key: "title", label: "عنوان", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
          { key: "image", label: "تصویر", type: "image" },
        ],
      },
      {
        key: "visitCards",
        label: "چرا قم رو ببینید",
        type: "list",
        itemLabel: "کارت",
        fields: [
          { key: "eyebrow", label: "برچسب بالای عنوان", type: "text" },
          { key: "title", label: "عنوان", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
        ],
      },
      {
        key: "visitInfo",
        label: "اطلاعات بازدید",
        type: "list",
        itemLabel: "مورد",
        fields: [
          { key: "label", label: "عنوان", type: "text" },
          { key: "value", label: "مقدار", type: "text" },
        ],
      },
    ],
  },
  {
    page: "pcwg",
    url: "/pcwg",
    title: "کارگروه شهرهای زیارتی (PCWG)",
    description: "شهرهای عضو، شهرهای پیشنهادی، حوزه‌های همکاری و انواع فعالیت.",
    fields: [
      { key: "hero_title", label: "عنوان اصلی صفحه", type: "text" },
      { key: "hero_description", label: "توضیح زیر عنوان", type: "textarea" },
      {
        key: "currentMembers",
        label: "شهرهای عضو فعلی",
        type: "list",
        itemLabel: "شهر",
        fields: [
          { key: "country", label: "کشور", type: "text" },
          { key: "city", label: "شهر", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
        ],
      },
      {
        key: "proposedMembers",
        label: "شهرهای پیشنهادی",
        type: "list",
        itemLabel: "شهر",
        fields: [
          { key: "country", label: "کشور", type: "text" },
          { key: "city", label: "شهر", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
        ],
      },
      {
        key: "areas",
        label: "حوزه‌های همکاری",
        type: "list",
        itemLabel: "حوزه",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
        ],
      },
      {
        key: "activityTypes",
        label: "انواع فعالیت",
        type: "list",
        itemLabel: "نوع فعالیت",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
        ],
      },
      {
        key: "sessions",
        label: "نشست‌ها",
        type: "list",
        itemLabel: "نشست",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "format", label: "فرمت (مثلاً Hosted in Qom)", type: "text" },
        ],
      },
      {
        key: "docs",
        label: "اسناد",
        type: "list",
        itemLabel: "سند",
        fields: [
          { key: "category", label: "دسته‌بندی", type: "text" },
          { key: "title", label: "عنوان", type: "text" },
        ],
      },
    ],
  },
  {
    page: "meetings",
    url: "/meetings",
    title: "جلسات بین‌المللی در قم",
    description: "نشست‌های میزبانی‌شده در قم، آنلاین و ترکیبی.",
    fields: [
      { key: "hero_title", label: "عنوان اصلی صفحه", type: "text" },
      { key: "hero_description", label: "توضیح زیر عنوان", type: "textarea" },
      {
        key: "hosted",
        label: "میزبانی‌شده در قم",
        type: "list",
        itemLabel: "نشست",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
          { key: "format", label: "فرمت", type: "text" },
          { key: "location", label: "مکان", type: "text" },
          { key: "participants", label: "شرکت‌کنندگان", type: "text" },
        ],
      },
      {
        key: "online",
        label: "آنلاین از قم",
        type: "list",
        itemLabel: "نشست",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
          { key: "format", label: "فرمت", type: "text" },
          { key: "location", label: "مکان", type: "text" },
          { key: "participants", label: "شرکت‌کنندگان", type: "text" },
        ],
      },
      {
        key: "hybrid",
        label: "ترکیبی",
        type: "list",
        itemLabel: "نشست",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
          { key: "format", label: "فرمت", type: "text" },
          { key: "location", label: "مکان", type: "text" },
          { key: "participants", label: "شرکت‌کنندگان", type: "text" },
        ],
      },
    ],
  },
  {
    page: "feedback",
    url: "/feedback",
    title: "بازخورد بازدیدکنندگان",
    description: "متن معرفی صفحه و نظرات منتشرشده.",
    fields: [
      { key: "hero_title", label: "عنوان اصلی صفحه", type: "text" },
      { key: "hero_description", label: "توضیح زیر عنوان", type: "textarea" },
      {
        key: "testimonials",
        label: "نظرات بازدیدکنندگان",
        type: "list",
        itemLabel: "نظر",
        fields: [
          { key: "quote", label: "متن نظر", type: "textarea" },
          { key: "meta", label: "نوع بازدیدکننده", type: "text" },
        ],
      },
      { key: "visitor_types", label: "گزینه‌های «نوع بازدیدکننده» (هر مورد در یک خط جدید)", type: "textarea" },
      { key: "experience_types", label: "گزینه‌های «تجربه بازدید شامل چه بود» (هر مورد در یک خط جدید)", type: "textarea" },
    ],
  },
  {
    page: "departments",
    url: "/departments",
    title: "دپارتمان‌های شهرداری",
    description: "توضیح هر دپارتمان و حوزه‌های همکاری بین‌المللی آن.",
    fields: [
      {
        key: "departments",
        label: "دپارتمان‌ها",
        type: "list",
        itemLabel: "دپارتمان",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "listing", label: "توضیح (در فهرست دپارتمان‌ها)", type: "textarea" },
          { key: "mission", label: "توضیح (در صفحه اختصاصی دپارتمان)", type: "textarea" },
          { key: "interests", label: "حوزه‌های همکاری (هر مورد در یک خط جدید)", type: "textarea" },
          { key: "overview", label: "نمای کلی دپارتمان (هر پاراگراف در یک خط جدید)", type: "textarea" },
          { key: "projects", label: "پروژه‌های بین‌المللی (هر مورد در یک خط جدید)", type: "textarea" },
          { key: "partners", label: "شرکای بین‌المللی (هر مورد در یک خط جدید)", type: "textarea" },
          { key: "meetings", label: "جلسات و هیئت‌ها (هر مورد در یک خط جدید)", type: "textarea" },
        ],
      },
    ],
  },
  {
    page: "memberships",
    url: "/memberships",
    title: "عضویت‌ها و شبکه‌های بین‌المللی",
    description: "سازمان‌ها و شبکه‌هایی که شهرداری قم در آن‌ها عضو است.",
    fields: [
      { key: "hero_title", label: "عنوان اصلی صفحه", type: "text" },
      { key: "hero_description", label: "توضیح زیر عنوان", type: "textarea" },
      {
        key: "orgs",
        label: "سازمان‌های عضو",
        type: "list",
        itemLabel: "سازمان",
        fields: [
          { key: "name", label: "نام سازمان", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
        ],
      },
    ],
  },
  {
    page: "culture",
    url: "/culture",
    title: "هفته‌های فرهنگی و جشنواره‌ها",
    description: "رویداد فرهنگی اصلی و فهرست جشنواره‌ها.",
    fields: [
      { key: "hero_title", label: "عنوان اصلی صفحه", type: "text" },
      { key: "hero_description", label: "توضیح زیر عنوان", type: "textarea" },
      {
        key: "festivals",
        label: "جشنواره‌ها",
        type: "list",
        itemLabel: "جشنواره",
        fields: [
          { key: "status", label: "وضعیت (مثلاً Upcoming / Ongoing / Completed)", type: "text" },
          { key: "title", label: "عنوان", type: "text" },
          { key: "theme", label: "موضوع", type: "text" },
          { key: "location", label: "مکان", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
        ],
      },
    ],
  },
  {
    page: "cooperation",
    url: "/cooperation",
    title: "همکاری‌های بین‌المللی",
    description: "حوزه‌های همکاری، توافق‌نامه‌ها و مراحل همکاری با شهرداری قم.",
    fields: [
      { key: "hero_title", label: "عنوان اصلی صفحه", type: "text" },
      { key: "hero_description", label: "توضیح زیر عنوان", type: "textarea" },
      {
        key: "areas",
        label: "حوزه‌های همکاری",
        type: "list",
        itemLabel: "حوزه",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "body", label: "توضیح", type: "textarea" },
        ],
      },
      {
        key: "agreements",
        label: "توافق‌نامه‌ها",
        type: "list",
        itemLabel: "توافق‌نامه",
        fields: [
          { key: "counterpart", label: "طرف مقابل", type: "text" },
          { key: "instrument", label: "نوع سند", type: "text" },
          { key: "date", label: "تاریخ", type: "text" },
        ],
      },
    ],
  },
  {
    page: "contact",
    url: "/contact",
    title: "اطلاعات تماس",
    description: "آدرس، ایمیل، شماره تماس و سوالات متداول دفتر روابط بین‌الملل.",
    fields: [
      { key: "address", label: "آدرس", type: "textarea" },
      { key: "email", label: "ایمیل رسمی", type: "text" },
      { key: "phone", label: "شماره تماس", type: "text" },
      {
        key: "faqs",
        label: "سوالات متداول",
        type: "list",
        itemLabel: "سوال",
        fields: [
          { key: "q", label: "سوال", type: "text" },
          { key: "a", label: "پاسخ", type: "textarea" },
        ],
      },
    ],
  },
  {
    page: "investment",
    url: "/investment",
    title: "منابع سرمایه‌گذاری",
    description: "فهرست «منابع سرمایه‌گذار» پایین صفحه فرصت‌های سرمایه‌گذاری (بروشورها و راهنماها). خودِ فرصت‌های سرمایه‌گذاری را از «فرصت‌های سرمایه‌گذاری» در پنل ویرایش کن.",
    fields: [
      {
        key: "resources",
        label: "منابع سرمایه‌گذار",
        type: "list",
        itemLabel: "منبع",
        fields: [
          { key: "category", label: "دسته", type: "text" },
          { key: "title", label: "عنوان", type: "text" },
          { key: "href", label: "لینک (اختیاری، پیش‌فرض صفحه رسانه‌ها)", type: "text" },
        ],
      },
    ],
  },
];

export function getPageSchema(page: string): PageSchema | undefined {
  return PAGE_SCHEMAS.find((s) => s.page === page);
}
