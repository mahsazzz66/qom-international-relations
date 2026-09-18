"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContentItem, ContentType } from "@/lib/supabase/types";

type FieldConfig = {
  showBody?: boolean;
  showEventDate?: boolean;
  showLocation?: boolean;
  showImage?: boolean;
  showMediaUrl?: boolean;
  mediaUrlLabel?: string;
  mediaAccept?: string;
  mediaUrlMode?: "upload" | "link";
};

const emptyDraft = (type: ContentType, categories: string[]): Partial<ContentItem> => ({
  type,
  category: categories[0] ?? "",
  title_en: "",
  title_ar: "",
  excerpt_en: "",
  excerpt_ar: "",
  body_en: "",
  body_ar: "",
  image_url: null,
  media_url: null,
  event_date: null,
  location: "",
  published: true,
});

export default function ContentManager({
  type,
  title,
  categories,
  fields = {},
}: {
  type: ContentType;
  title: string;
  categories: string[];
  fields?: FieldConfig;
}) {
  const supabase = createClient();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<ContentItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .eq("type", type)
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as ContentItem[]);
    setLoading(false);
  }, [supabase, type]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    const ext = file.name.split(".").pop();
    const path = `${type}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    if (uploadError) {
      setError("آپلود فایل ناموفق بود: " + uploadError.message);
      return null;
    }
    const { data } = supabase.storage.from("site-media").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = { ...editing };
    delete (payload as { created_at?: string }).created_at;
    delete (payload as { updated_at?: string }).updated_at;

    let result;
    if (payload.id) {
      result = await supabase.from("content_items").update(payload).eq("id", payload.id);
    } else {
      result = await supabase.from("content_items").insert({ ...payload, created_by: user?.id });
    }

    setSaving(false);
    if (result.error) {
      setError("ذخیره ناموفق بود: " + result.error.message);
      return;
    }
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("این مورد حذف شود؟")) return;
    await supabase.from("content_items").delete().eq("id", id);
    load();
  }

  async function togglePublished(item: ContentItem) {
    await supabase.from("content_items").update({ published: !item.published }).eq("id", item.id);
    load();
  }

  return (
    <div dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-medium text-navy">{title}</h1>
          <p className="mt-1 text-sm text-gray">{items.length} مورد</p>
        </div>
        <button
          onClick={() => setEditing(emptyDraft(type, categories))}
          className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
        >
          + افزودن مورد جدید
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-gray">در حال بارگذاری...</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy/20 bg-white py-16 text-center">
          <p className="text-sm text-gray">هنوز موردی اضافه نشده است.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-navy/10 bg-white p-4 shadow-sm"
            >
              {fields.showImage && item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="grid h-16 w-24 shrink-0 place-items-center rounded-lg bg-navy/5 text-[10px] text-gray">
                  بدون تصویر
                </div>
              )}
              <div className="min-w-[200px] flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-medium text-teal">
                    {item.category}
                  </span>
                  {!item.published && (
                    <span className="rounded-full bg-gray/10 px-2 py-0.5 text-[11px] font-medium text-gray">پیش‌نویس</span>
                  )}
                </div>
                <div className="truncate font-medium text-navy">{item.title_ar || item.title_en || "(بدون عنوان)"}</div>
                {item.title_en && item.title_ar && (
                  <div dir="ltr" className="truncate text-[12px] text-gray">{item.title_en}</div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => togglePublished(item)}
                  className="rounded-lg border border-navy/15 px-3 py-1.5 text-[12px] text-navy hover:bg-navy/5"
                >
                  {item.published ? "پنهان کردن" : "انتشار"}
                </button>
                <button
                  onClick={() => setEditing(item)}
                  className="rounded-lg border border-gold/50 px-3 py-1.5 text-[12px] font-medium text-navy hover:bg-gold/10"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg border border-red/30 px-3 py-1.5 text-[12px] text-red hover:bg-red/10"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4" onClick={() => !saving && setEditing(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-white p-7 shadow-2xl"
          >
            <h2 className="mb-5 font-serif text-xl font-medium text-navy">
              {editing.id ? "ویرایش مورد" : "افزودن مورد جدید"}
            </h2>

            {error && (
              <div className="mb-4 rounded-lg border border-red/30 bg-red/10 px-3.5 py-2.5 text-[13px] text-red">
                {error}
              </div>
            )}

            <div className="grid gap-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-navy">دسته‌بندی</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-navy">عنوان (عربی)</label>
                  <input
                    value={editing.title_ar ?? ""}
                    onChange={(e) => setEditing({ ...editing, title_ar: e.target.value })}
                    className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label dir="ltr" className="mb-1.5 block text-[13px] font-medium text-navy">Title (English)</label>
                  <input
                    dir="ltr"
                    value={editing.title_en ?? ""}
                    onChange={(e) => setEditing({ ...editing, title_en: e.target.value })}
                    className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-navy">خلاصه (عربی)</label>
                  <textarea
                    rows={2}
                    value={editing.excerpt_ar ?? ""}
                    onChange={(e) => setEditing({ ...editing, excerpt_ar: e.target.value })}
                    className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label dir="ltr" className="mb-1.5 block text-[13px] font-medium text-navy">Excerpt (English)</label>
                  <textarea
                    dir="ltr"
                    rows={2}
                    value={editing.excerpt_en ?? ""}
                    onChange={(e) => setEditing({ ...editing, excerpt_en: e.target.value })}
                    className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
                  />
                </div>
              </div>

              {fields.showBody && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-navy">متن کامل (عربی)</label>
                    <textarea
                      rows={5}
                      value={editing.body_ar ?? ""}
                      onChange={(e) => setEditing({ ...editing, body_ar: e.target.value })}
                      className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label dir="ltr" className="mb-1.5 block text-[13px] font-medium text-navy">Full text (English)</label>
                    <textarea
                      dir="ltr"
                      rows={5}
                      value={editing.body_en ?? ""}
                      onChange={(e) => setEditing({ ...editing, body_en: e.target.value })}
                      className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
                    />
                  </div>
                </div>
              )}

              {(fields.showEventDate || fields.showLocation) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.showEventDate && (
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-navy">تاریخ</label>
                      <input
                        type="date"
                        value={editing.event_date ?? ""}
                        onChange={(e) => setEditing({ ...editing, event_date: e.target.value })}
                        className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
                      />
                    </div>
                  )}
                  {fields.showLocation && (
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-navy">مکان</label>
                      <input
                        value={editing.location ?? ""}
                        onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                        className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
                      />
                    </div>
                  )}
                </div>
              )}

              {fields.showImage && (
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-navy">تصویر</label>
                  <div className="flex items-center gap-3">
                    {editing.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={editing.image_url} alt="" className="h-16 w-24 rounded-lg object-cover" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await handleUpload(file);
                        if (url) setEditing((prev) => (prev ? { ...prev, image_url: url } : prev));
                      }}
                      className="text-[13px]"
                    />
                    {uploading && <span className="text-[12px] text-gray">در حال آپلود...</span>}
                  </div>
                </div>
              )}

              {fields.showMediaUrl && fields.mediaUrlMode === "link" && (
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-navy">
                    {fields.mediaUrlLabel ?? "لینک"}
                  </label>
                  <input
                    dir="ltr"
                    value={editing.media_url ?? ""}
                    onChange={(e) => setEditing({ ...editing, media_url: e.target.value })}
                    placeholder="https://www.aparat.com/v/... یا https://youtu.be/..."
                    className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
                  />
                </div>
              )}

              {fields.showMediaUrl && fields.mediaUrlMode !== "link" && (
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-navy">
                    {fields.mediaUrlLabel ?? "فایل"}
                  </label>
                  <div className="flex items-center gap-3">
                    {editing.media_url && (
                      <a href={editing.media_url} target="_blank" className="truncate text-[12px] text-teal underline">
                        فایل فعلی
                      </a>
                    )}
                    <input
                      type="file"
                      accept={fields.mediaAccept}
                      disabled={uploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await handleUpload(file);
                        if (url) setEditing((prev) => (prev ? { ...prev, media_url: url } : prev));
                      }}
                      className="text-[13px]"
                    />
                    {uploading && <span className="text-[12px] text-gray">در حال آپلود...</span>}
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 text-[13px] text-navy">
                <input
                  type="checkbox"
                  checked={editing.published ?? true}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                />
                منتشر شود (روی سایت نمایش داده شود)
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                disabled={saving}
                className="rounded-lg border border-navy/15 px-4 py-2.5 text-[13px] text-navy"
              >
                انصراف
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="rounded-lg bg-gold px-5 py-2.5 text-[13px] font-semibold text-navy disabled:opacity-50"
              >
                {saving ? "در حال ذخیره..." : "ذخیره"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
