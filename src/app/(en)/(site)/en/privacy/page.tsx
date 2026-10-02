import { PrivacyPage, privacyMetadata } from "@/views/PrivacyPage";

export const metadata = privacyMetadata("en");

export default function Page() {
  return <PrivacyPage locale="en" />;
}
