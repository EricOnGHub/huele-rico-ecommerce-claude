import { cartMetadata, CartPageView } from "@/views/small";

export const metadata = cartMetadata("es");

export default function Page() {
  return <CartPageView lang={"es"} />;
}
