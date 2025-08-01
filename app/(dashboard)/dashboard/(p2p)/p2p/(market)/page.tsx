import handleProtected from "@/app/components/js/reuseables";
import { AllMarkets } from "./Market";

export default async function Dashboard() {
  await handleProtected(false);
  return <AllMarkets />;
}
