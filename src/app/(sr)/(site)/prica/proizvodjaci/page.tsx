import { ProducersPage, producersMetadata } from "@/views/ProducersPage";

export const metadata = producersMetadata("sr");

export default function Page() {
  return <ProducersPage locale="sr" />;
}
