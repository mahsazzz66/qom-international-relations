import { notFound } from "next/navigation";
import { findItem, NEWS, MSGS } from "@/lib/data";
import ArticleView from "@/components/ArticleView";

export function generateStaticParams() {
  return [...NEWS(), ...MSGS()].map((it) => ({ slug: it.id }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) notFound();
  return <ArticleView item={item} />;
}
