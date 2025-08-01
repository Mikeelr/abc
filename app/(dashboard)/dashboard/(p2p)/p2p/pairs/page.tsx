import handleProtected from "@/app/components/js/reuseables";
import { PairsBody } from "./Pair";

export default async function Page() {
  await handleProtected(true);
  return <PairsBody />;
}
