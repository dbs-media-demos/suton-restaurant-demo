import { FaqPage, faqMetadata } from "@/views/FaqPage";

export const metadata = faqMetadata("sr");

export default function Page() {
  return <FaqPage locale="sr" />;
}
