import { productMetadata, productParams, ProductPageView } from "@/views/product";

type Props = { params: Promise<{ handle: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => productParams("en");
export const generateMetadata = async ({ params }: Props) => productMetadata("en", (await params).handle);

export default async function Page({ params }: Props) {
  return <ProductPageView lang={"en"} handle={(await params).handle} />;
}
