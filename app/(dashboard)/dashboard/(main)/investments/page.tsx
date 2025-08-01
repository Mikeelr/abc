import handleProtected from "@/app/components/js/reuseables";

import { PlanList } from "./Investments";
import { plansUrl } from "@/app/components/js/config";
import { getRequest } from "@/app/components/js/api_client";
const fetchData = async (token: string) => {
  const { data } = await getRequest(plansUrl, token);
  return {
    plans: data?.data || [],
    pages: data?.pages || 0,
  };
};
export default async function Page() {
  const token = await handleProtected(false);
  const { pages, plans } = await fetchData(token);
  return <PlanList pages={pages} plans={plans} />;
}
