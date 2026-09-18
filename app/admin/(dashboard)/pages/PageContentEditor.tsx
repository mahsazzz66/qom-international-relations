"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { emptyListItem, withDefaults, type FieldDef, type PageSchema, type BilingualText } from "@/lib/pageContent/schema";

function TextField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: BilingualText;
  onChange: (v: BilingualText) => void;
  multiline?: boolean;
}) {
  const Comp = multiline ? "textarea" : "input";
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-[12.5px] font-medium text-navy">{label} (عربی)</label>
        <Comp
          rows={multiline ? 3 : undefined}
          value={value.ar}
          onChange={(e) => onChange({ ...value, ar: e.target.value })}
          className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm outline-none focus:border-gold"
        />
      </div>
      <div>
        <label dir="ltr" className="mb-1.5 block text-[12.5px] font-medium text-navy">{label} (English)</label>
        <Comp
          dir="ltr"
          rows={multiline ? 3 : undefined}
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm outline-none focus:border-gold"
        />
      </div>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  page,
  fieldKey,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  page: string;
  fieldKey: string;
}) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  async function handleFile(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `pages/${page}/${fieldKey}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("site-media").upload(path, file, { upsert: false });
    setUploading(false);
    if (!error) {
      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      onChange(data.publicUrl);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-medium text-navy">{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-14 w-24 rounded-lg object-cover" />
        )}
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
          className="text-[12.5px]"
        />
        {uploading && <span className="text-[12px] text-gray">در حال آپلود...</span>}
        {value && (
          <button type="button" onClick={() => onChange(null)} className="text-[12px] text-red underline">
            حذف تصویر
          </button>
        )}
      </div>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
  page,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  page: string;
}) {
  if (field.type === "text") return <TextField label={field.label} value={value as BilingualText} onChange={onChange} />;
  if (field.type === "textarea") return <TextField label={field.label} value={value as BilingualText} onChange={onChange} multiline />;
  if (field.type === "image") return <ImageField label={field.label} value={value as string | null} onChange={onChange} page={page} fieldKey={field.key} />;

  // list
  const items = (value as Record<string, unknown>[]) ?? [];
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-[13px] font-semibold text-navy">{field.label}</label>
        <button
          type="button"
          onClick={() => onChange([...items, emptyListItem(field.fields)])}
          className="rounded-lg border border-navy/20 px-3 py-1 text-[12px] text-navy hover:bg-navy/5"
        >
          + افزودن {field.itemLabel}
        </button>
      </div>
      <div className="grid gap-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-navy/12 bg-bg/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[12px] font-medium text-gray">
                {field.itemLabel} #{i + 1}
              </span>
              <div className="flex gap-1.5">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...items];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      onChange(next);
                    }}
                    className="rounded border border-navy/15 px-2 py-1 text-[11px] text-navy"
                  >
                    ▲
                  </button>
                )}
                {i < items.length - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...items];
                      [next[i + 1], next[i]] = [next[i], next[i + 1]];
                      onChange(next);
                    }}
                    className="rounded border border-navy/15 px-2 py-1 text-[11px] text-navy"
                  >
                    ▼
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                  className="rounded border border-red/30 px-2 py-1 text-[11px] text-red"
                >
                  حذف
                </button>
              </div>
            </div>
            <div className="grid gap-3">
              {field.fields.map((sub) => (
                <FieldEditor
                  key={sub.key}
                  field={sub}
                  value={item[sub.key]}
                  onChange={(v) => {
                    const next = [...items];
                    next[i] = { ...next[i], [sub.key]: v };
                    onChange(next);
                  }}
                  page={page}
                />
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-[12.5px] text-gray">هنوز موردی اضافه نشده.</p>}
      </div>
    </div>
  );
}

export default function PageContentEditor({ schema }: { schema: PageSchema }) {
  const supabase = createClient();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    supabase
      .from("page_content")
      .select("data")
      .eq("page", schema.page)
      .maybeSingle()
      .then(({ data: row }) => {
        setData(withDefaults(schema, (row?.data as Record<string, unknown>) ?? {}));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema.page]);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    await supabase.from("page_content").upsert({ page: schema.page, data }, { onConflict: "page" });
    setSaving(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 4000);
  }

  if (!data) return <div className="py-16 text-center text-sm text-gray">در حال بارگذاری...</div>;

  return (
    <div dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-medium text-navy">{schema.title}</h1>
          {schema.description && <p className="mt-1 text-sm text-gray">{schema.description}</p>}
          {schema.url && (
            <Link
              href={schema.url}
              target="_blank"
              className="mt-1.5 inline-block text-[12.5px] font-semibold text-navy/70 hover:text-navy hover:underline"
            >
              مشاهده این صفحه در سایت ↗
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          {justSaved && <span className="text-[12.5px] text-teal">ذخیره شد ✓</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-gold px-5 py-2.5 text-[13px] font-semibold text-navy disabled:opacity-50"
          >
            {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {schema.fields.map((field) => (
          <div key={field.key} className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
            <FieldEditor field={field} value={data[field.key]} onChange={(v) => setData({ ...data, [field.key]: v })} page={schema.page} />
          </div>
        ))}
      </div>
    </div>
  );
}
