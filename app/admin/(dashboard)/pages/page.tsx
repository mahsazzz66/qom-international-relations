import Link from "next/link";
import { PAGE_SCHEMAS } from "@/lib/pageContent/pageSchemas";

export default function AdminPagesListPage() {
  return (
    <div dir="rtl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-medium text-navy">صفحات سایت</h1>
        <p className="mt-1 text-sm text-gray">
          از این‌جا می‌تونی متن‌ها، تصاویر و لیست‌های هر صفحه از سایت رو ویرایش کنی.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PAGE_SCHEMAS.map((schema) => (
          <Link
            key={schema.page}
            href={`/admin/pages/${schema.page}`}
            className="group rounded-2xl border border-navy/10 bg-white p-5 shadow-sm transition hover:border-gold/50 hover:shadow-md"
          >
            <h2 className="font-serif text-lg font-medium text-navy group-hover:text-gold">
              {schema.title}
            </h2>
            {schema.description && (
              <p className="mt-1.5 text-[13px] leading-6 text-gray">{schema.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
