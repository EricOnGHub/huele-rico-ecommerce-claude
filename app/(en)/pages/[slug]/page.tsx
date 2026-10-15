import { infoMetadata, infoParams, InfoPageView } from "@/views/info-page";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => infoParams("en");
export const generateMetadata = async ({ params }: Props) => infoMetadata("en", (await params).slug);

export default async function Page({ params }: Props) {
  return <InfoPageView lang={"en"} slug={(await params).slug} />;
}
