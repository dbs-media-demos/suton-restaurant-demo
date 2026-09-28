import { notFound } from "next/navigation";
import { EventDetailPage, eventMetadata } from "@/views/EventDetailPage";
import { events, getEvent } from "@/content/events";

export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug.sr }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEvent("sr", slug);
  return e ? eventMetadata("sr", e) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEvent("sr", slug);
  if (!e) notFound();
  return <EventDetailPage locale="sr" e={e} />;
}
