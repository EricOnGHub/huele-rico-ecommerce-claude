import { collectionMetadata, collectionParams, CollectionPageView } from "@/views/collection";

type Props = { params: Promise<{ handle: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => collectionParams("es");
export const generateMetadata = async ({ params }: Props) => collectionMetadata("es", (await params).handle);

export default async function Page({ params }: Props) {
  return <CollectionPageView lang={"es"} handle={(await params).handle} />;
}
