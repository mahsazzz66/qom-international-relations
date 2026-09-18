import { notFound } from "next/navigation";
import { findItem, NEWS, MSGS } from "@/lib/data";
import ArticleView from "@/components/ArticleView";
import LiveArticleView from "@/components/LiveArticleView";
import { createPublicClient } from "@/lib/supabase/public";
import type { ContentItem } from "@/lib/supabase/types";

export function generateStaticParams() {
  return [...NEWS(), ...MSGS()].map((it) => ({ slug: it.id }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const item = findItem(slug);
  if (item) return <ArticleView item={item} />;

  const supabase = createPublicClient();
  const { data } = await supabase
    .from("content_items")
    .select("*")
    .eq("id", slug)
    .eq("published", true)
    .in("type", ["news", "statement"])
    .maybeSingle();

  if (!data) notFound();
  return <LiveArticleView item={data as ContentItem} />;
}
