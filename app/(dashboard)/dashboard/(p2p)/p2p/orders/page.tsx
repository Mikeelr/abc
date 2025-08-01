import handleProtected from "@/app/components/js/reuseables";
import { AllOrders } from "./Order";

export default async function Dashboard() {
  await handleProtected(false);
  return <AllOrders />;
}
