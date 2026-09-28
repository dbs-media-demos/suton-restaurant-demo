import { GiftsPage, giftsMetadata } from "@/views/GiftsPage";

export const metadata = giftsMetadata("sr");

export default function Page() {
  return <GiftsPage locale="sr" />;
}
