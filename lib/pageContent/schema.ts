// A small schema language for the generic, per-page content editor.
// Each page (home, about, about-qom, pcwg, ...) gets a PageSchema describing
// its editable fields; the admin editor (ContentManager's page-content
// cousin, PageContentEditor) renders a form purely from this description, so
// adding a new editable page means writing a schema here, not new UI code.

export type FieldDef =
  | { key: string; label: string; type: "text" }
  | { key: string; label: string; type: "textarea" }
  | { key: string; label: string; type: "image" }
  | { key: string; label: string; type: "list"; itemLabel: string; fields: FieldDef[] };

export type PageSchema = {
  page: string;
  title: string;
  description?: string;
  // Path of the live public page this schema edits, e.g. "/about-qom". Lets
  // the admin open the real page next to the editor to see the result.
  url?: string;
  fields: FieldDef[];
};

export type BilingualText = { en: string; ar: string };

// Builds an empty default value for a field, used to fill in gaps when a
// page has never been edited yet (or a field was added to the schema later).
export function emptyValueFor(field: FieldDef): unknown {
  switch (field.type) {
    case "text":
    case "textarea":
      return { en: "", ar: "" } as BilingualText;
    case "image":
      return null;
    case "list":
      return [] as Record<string, unknown>[];
  }
}

export function emptyListItem(fields: FieldDef[]): Record<string, unknown> {
  const item: Record<string, unknown> = {};
  for (const f of fields) item[f.key] = emptyValueFor(f);
  return item;
}

// Fills in any fields missing from previously-saved data (e.g. schema grew
// since the row was last saved) without discarding existing values.
export function withDefaults(schema: PageSchema, data: Record<string, unknown> | null | undefined) {
  const result: Record<string, unknown> = { ...(data ?? {}) };
  for (const field of schema.fields) {
    if (!(field.key in result) || result[field.key] == null) {
      result[field.key] = emptyValueFor(field);
    }
    if (field.type === "list" && Array.isArray(result[field.key])) {
      result[field.key] = (result[field.key] as Record<string, unknown>[]).map((item) => {
        const filled = { ...item };
        for (const sub of field.fields) {
          if (!(sub.key in filled) || filled[sub.key] == null) {
            filled[sub.key] = emptyValueFor(sub);
          }
        }
        return filled;
      });
    }
  }
  return result;
}
