import type { Metadata } from "next";
import AboutView from "@/components/AboutView";

export const metadata: Metadata = {
  title: "About this guide",
  description:
    "Who makes the Memphis Family Resource Guide, how the program list is checked, how to suggest a program, and what the guide does not do.",
};

export default function AboutPage() {
  return <AboutView />;
}
