import { WinePage, wineMetadata } from "@/views/WinePage";

export const metadata = wineMetadata("sr");

export default function Page() {
  return <WinePage locale="sr" />;
}
