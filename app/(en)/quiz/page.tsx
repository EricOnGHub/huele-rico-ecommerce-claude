import { quizMetadata, QuizPageView } from "@/views/small";

export const metadata = quizMetadata("en");

export default function Page() {
  return <QuizPageView lang={"en"} />;
}
