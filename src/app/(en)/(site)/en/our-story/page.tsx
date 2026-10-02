import { StoryPage, storyMetadata } from "@/views/StoryPage";

export const metadata = storyMetadata("en");

export default function Page() {
  return <StoryPage locale="en" />;
}
