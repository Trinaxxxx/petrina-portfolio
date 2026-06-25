import { getCaseStudy, getAllSlugs } from "@/lib/case-studies";
import { notFound } from "next/navigation";
import CaseStudyPage from "@/components/CaseStudyPage";
import PipelinePage from "@/components/PipelinePage";
import { pipelinex } from "@/lib/pipelinex";
import type { Metadata } from "next";

const PIPELINE_SLUG = "blender-automation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === PIPELINE_SLUG) {
    return {
      title: `${pipelinex.title} — ${pipelinex.subtitle} | Petrina Kinzel`,
      description: pipelinex.problem.body[0],
    };
  }
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.title} — ${study.subtitle} | Petrina Kinzel`,
    description: study.summary,
  };
}

export function generateStaticParams() {
  return [...getAllSlugs(), PIPELINE_SLUG].map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === PIPELINE_SLUG) return <PipelinePage />;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return <CaseStudyPage study={study} />;
}
