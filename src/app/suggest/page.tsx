import type { Metadata } from "next";
import SubmitForm from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: "Suggest a Resource",
  description:
    "Know a free program for Memphis families we're missing? Suggest it for the guide.",
};

export default function SuggestPage() {
  return <SubmitForm />;
}
