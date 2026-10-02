import { ReservationsPage, reservationsMetadata } from "@/views/ReservationsPage";

export const metadata = reservationsMetadata("en");

export default function Page() {
  return <ReservationsPage locale="en" />;
}
