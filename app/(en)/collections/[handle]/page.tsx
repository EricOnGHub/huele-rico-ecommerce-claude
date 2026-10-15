import { collectionMetadata, collectionParams, CollectionPageView } from "@/views/collection";

type Props = { params: Promise<{ handle: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => collectionParams("en");
export const generateMetadata = async ({ params }: Props) => collectionMetadata("en", (await params).handle);

export default async function Page({ params }: Props) {
  return <CollectionPageView lang={"en"} handle={(await params).handle} />;
}
