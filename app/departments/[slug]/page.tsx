import { notFound } from "next/navigation";
import { DEPTS } from "@/lib/data";
import DeptDetailView from "@/components/DeptDetailView";

export function generateStaticParams() {
  return DEPTS().map((d) => ({ slug: d.id }));
}

export default async function DeptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dept = DEPTS().find((d) => d.id === slug);
  if (!dept) notFound();
  return <DeptDetailView dept={dept} />;
}
