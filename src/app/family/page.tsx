import type { Metadata } from "next";
import FamilyForm from "@/components/family/FamilyForm";
import { fetchGroups } from "@/lib/data";
import { flattenGroups } from "@/lib/eligibility";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Family Sign-Up",
  description:
    "Build a personalized plan of every free Memphis program your children qualify for.",
};

export default async function FamilyPage() {
  const { groups } = await fetchGroups();
  return <FamilyForm flatResources={flattenGroups(groups)} />;
}
