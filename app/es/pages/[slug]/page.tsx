import { infoMetadata, infoParams, InfoPageView } from "@/views/info-page";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => infoParams("es");
export const generateMetadata = async ({ params }: Props) => infoMetadata("es", (await params).slug);

export default async function Page({ params }: Props) {
  return <InfoPageView lang={"es"} slug={(await params).slug} />;
}
