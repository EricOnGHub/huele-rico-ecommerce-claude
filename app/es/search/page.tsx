import { searchMetadata, SearchPageView } from "@/views/small";

export const metadata = searchMetadata("es");

export default function Page() {
  return <SearchPageView lang={"es"} />;
}
