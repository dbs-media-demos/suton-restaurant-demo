import { ContactPage, contactMetadata } from "@/views/ContactPage";

export const metadata = contactMetadata("sr");

export default function Page() {
  return <ContactPage locale="sr" />;
}
