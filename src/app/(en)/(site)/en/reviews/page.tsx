import { ReviewsPage, reviewsMetadata } from "@/views/ReviewsPage";

export const metadata = reviewsMetadata("en");

export default function Page() {
  return <ReviewsPage locale="en" />;
}
