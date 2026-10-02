import { EventsPage, eventsMetadata } from "@/views/EventsPage";

export const metadata = eventsMetadata("sr");

export default function Page() {
  return <EventsPage locale="sr" />;
}
