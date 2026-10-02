import { MenuPage, menuMetadata } from "@/views/MenuPage";

export const metadata = menuMetadata("en");

export default function Page() {
  return <MenuPage locale="en" />;
}
