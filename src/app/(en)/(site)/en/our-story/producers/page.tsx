import { ProducersPage, producersMetadata } from "@/views/ProducersPage";

export const metadata = producersMetadata("en");

export default function Page() {
  return <ProducersPage locale="en" />;
}
