import { notFound } from "next/navigation";
import { getPageSchema } from "@/lib/pageContent/pageSchemas";
import PageContentEditor from "../PageContentEditor";

export default async function AdminPageContentPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const schema = getPageSchema(page);
  if (!schema) notFound();

  return <PageContentEditor schema={schema} />;
}
