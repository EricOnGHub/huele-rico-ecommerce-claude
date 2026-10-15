import { checkoutMetadata, CheckoutPageView } from "@/views/small";

export const metadata = checkoutMetadata("en");

export default function Page() {
  return <CheckoutPageView lang={"en"} />;
}
