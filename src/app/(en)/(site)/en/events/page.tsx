import { EventsPage, eventsMetadata } from "@/views/EventsPage";

export const metadata = eventsMetadata("en");

export default function Page() {
  return <EventsPage locale="en" />;
}
