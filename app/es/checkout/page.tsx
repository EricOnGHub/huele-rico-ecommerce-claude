import { checkoutMetadata, CheckoutPageView } from "@/views/small";

export const metadata = checkoutMetadata("es");

export default function Page() {
  return <CheckoutPageView lang={"es"} />;
}
