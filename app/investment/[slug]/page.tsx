import { notFound } from "next/navigation";
import { INVEST, findInv } from "@/lib/data";
import InvestmentDetailView from "@/components/InvestmentDetailView";

export function generateStaticParams() {
  return INVEST().map((it) => ({ slug: it.id }));
}

export default async function InvestmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findInv(slug);
  if (!item) notFound();
  return <InvestmentDetailView item={item} />;
}
