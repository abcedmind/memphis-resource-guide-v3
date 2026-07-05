import BrowseView from "@/components/browse/BrowseView";
import { fetchGroups } from "@/lib/data";

export const revalidate = 60;

export default async function BrowsePage() {
  const { groups, fromDb } = await fetchGroups();
  return <BrowseView initialGroups={groups} fromDb={fromDb} />;
}
