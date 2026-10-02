import { ReservationsPage, reservationsMetadata } from "@/views/ReservationsPage";

export const metadata = reservationsMetadata("sr");

export default function Page() {
  return <ReservationsPage locale="sr" />;
}
