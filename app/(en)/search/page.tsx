import { searchMetadata, SearchPageView } from "@/views/small";

export const metadata = searchMetadata("en");

export default function Page() {
  return <SearchPageView lang={"en"} />;
}
