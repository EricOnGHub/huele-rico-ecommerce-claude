import { cartMetadata, CartPageView } from "@/views/small";

export const metadata = cartMetadata("en");

export default function Page() {
  return <CartPageView lang={"en"} />;
}
