import { WinePage, wineMetadata } from "@/views/WinePage";

export const metadata = wineMetadata("en");

export default function Page() {
  return <WinePage locale="en" />;
}
