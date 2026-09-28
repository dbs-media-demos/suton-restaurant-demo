import { HomePage, homeMetadata } from "@/views/HomePage";

export const metadata = homeMetadata("sr");

export default function Page() {
  return <HomePage locale="sr" />;
}
