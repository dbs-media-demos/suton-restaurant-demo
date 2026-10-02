import { ReviewsPage, reviewsMetadata } from "@/views/ReviewsPage";

export const metadata = reviewsMetadata("sr");

export default function Page() {
  return <ReviewsPage locale="sr" />;
}
