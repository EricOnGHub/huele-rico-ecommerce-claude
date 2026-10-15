import { productMetadata, productParams, ProductPageView } from "@/views/product";

type Props = { params: Promise<{ handle: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => productParams("es");
export const generateMetadata = async ({ params }: Props) => productMetadata("es", (await params).handle);

export default async function Page({ params }: Props) {
  return <ProductPageView lang={"es"} handle={(await params).handle} />;
}
