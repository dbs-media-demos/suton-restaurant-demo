import { MenuPage, menuMetadata } from "@/views/MenuPage";

export const metadata = menuMetadata("sr");

export default function Page() {
  return <MenuPage locale="sr" />;
}
