import handleProtected from "@/app/components/js/reuseables";

import { CreateOrder } from "../Order";

export default async function Dashboard() {
  await handleProtected(false);
  return <CreateOrder />;
}
