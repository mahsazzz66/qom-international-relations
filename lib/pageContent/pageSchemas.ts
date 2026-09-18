import type { PageSchema } from "./schema";

// Every editable page lives here as one schema. To make a new page editable,
// add an entry to this array (and read it the same way an existing page
// does) — no new admin UI is needed, PageContentEditor renders any schema.

export const PAGE_SCHEMAS: PageSchema[] = [
  {
    page: "home",
    title: "صفحه اصلی — اسلایدشو هیرو",
    description: "اسلایدهای بالای صفحه اول سایت (عنوان، توضیح و تصویر پس‌زمینه هر اسلاید).",
    fields: [
      {
        key: "slides",
        label: "اسلایدها",
        type: "list",
        itemLabel: "اسلاید",
        fields: [
          { key: "title", label: "عنوان", type: "text" },
          { key: "description", label: "توضیح", type: "textarea" },
          { key: "image", label: "تصویر پس‌زمینه", type: "image" },
        ],
      },
    ],
  },
  {
    page: "about",
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
    ],
  },
  {
    page: "departments",
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
          { key: "listing", label: "توضیح", type: "textarea" },
          { key: "interests", label: "حوزه‌های همکاری (هر مورد در یک خط جدید)", type: "textarea" },
        ],
      },
    ],
  },
  {
    page: "memberships",
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
    title: "اطلاعات تماس",
    description: "آدرس، ایمیل و شماره تماس دفتر روابط بین‌الملل.",
    fields: [
      { key: "address", label: "آدرس", type: "textarea" },
      { key: "email", label: "ایمیل رسمی", type: "text" },
      { key: "phone", label: "شماره تماس", type: "text" },
    ],
  },
];

export function getPageSchema(page: string): PageSchema | undefined {
  return PAGE_SCHEMAS.find((s) => s.page === page);
}
