import { notFound } from "next/navigation";
import { INVEST, findInv } from "@/lib/data";
import InvestmentDetailView from "@/components/InvestmentDetailView";
import { createPublicClient } from "@/lib/supabase/public";
import { contentItemToInvestmentItem } from "@/lib/supabase/adapters";
import type { ContentItem } from "@/lib/supabase/types";

export function generateStaticParams() {
  return INVEST().map((it) => ({ slug: it.id }));
}

export default async function InvestmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const item = findInv(slug);
  if (item) return <InvestmentDetailView item={item} />;

  const supabase = createPublicClient();
  const { data } = await supabase
    .from("content_items")
    .select("*")
    .eq("id", slug)
    .eq("type", "investment")
    .eq("published", true)
    .maybeSingle();

  if (!data) notFound();
  return <InvestmentDetailView item={contentItemToInvestmentItem(data as ContentItem, "en")} />;
}
