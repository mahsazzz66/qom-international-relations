"use client";

import { useState } from "react";
import ContentManager from "../ContentManager";

const TABS = [
  { key: "photo" as const, label: "عکس‌ها" },
  { key: "video" as const, label: "ویدیوها" },
  { key: "document" as const, label: "اسناد و بروشورها" },
];

export default function AdminMediaPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("photo");

  return (
    <div dir="rtl">
      <div className="mb-6 flex gap-2 border-b border-navy/10">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key ? "border-gold text-navy" : "border-transparent text-gray hover:text-navy"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "photo" && (
        <ContentManager
          key="photo"
          type="photo"
          title="گالری عکس"
          categories={["Delegation Visit", "Signing Ceremony", "Working Group", "Cultural Programme", "Conference", "City & Landmarks"]}
          fields={{ showImage: true }}
        />
      )}
      {tab === "video" && (
        <ContentManager
          key="video"
          type="video"
          title="گالری ویدیو"
          categories={["City Film", "Working Group Session", "Cultural Week", "Other"]}
          fields={{ showImage: true, showMediaUrl: true, mediaUrlMode: "link", mediaUrlLabel: "لینک ویدیو (آپارات، یوتیوب و...)" }}
        />
      )}
      {tab === "document" && (
        <ContentManager
          key="document"
          type="document"
          title="اسناد و انتشارات"
          categories={["Official Publication", "International Report", "Annual Report", "Brochure", "Press Kit"]}
          fields={{ showMediaUrl: true, mediaUrlLabel: "فایل PDF", mediaAccept: "application/pdf" }}
        />
      )}
    </div>
  );
}
