import { GiftsPage, giftsMetadata } from "@/views/GiftsPage";

export const metadata = giftsMetadata("en");

export default function Page() {
  return <GiftsPage locale="en" />;
}
