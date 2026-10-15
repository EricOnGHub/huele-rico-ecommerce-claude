import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { CATALOG_TAG } from "@/lib/shopify/client";

// Point Shopify webhooks (products/create, products/update, products/delete,
// collections/update, inventory_levels/update) at:
//   https://YOUR-SITE/api/revalidate?secret=SHOPIFY_REVALIDATION_SECRET
// and the storefront refreshes immediately instead of waiting for the 5-minute cache.

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function POST(req: NextRequest) {
  const expected = process.env.SHOPIFY_REVALIDATION_SECRET;
  const secret = req.nextUrl.searchParams.get("secret") || "";
  if (!expected || !safeEqual(secret, expected)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag(CATALOG_TAG, "max");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: true, now: Date.now() });
}
