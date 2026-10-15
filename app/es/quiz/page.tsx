import { quizMetadata, QuizPageView } from "@/views/small";

export const metadata = quizMetadata("es");

export default function Page() {
  return <QuizPageView lang={"es"} />;
}
