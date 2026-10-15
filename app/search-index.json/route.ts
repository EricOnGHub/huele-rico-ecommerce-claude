import { getAllSummaries } from "@/lib/commerce";

// Compact catalog for search suggestions and bag recommendations, generated at build time.
export const dynamic = "force-static";

export async function GET() {
  const products = await getAllSummaries("en");
  return Response.json(products);
}
