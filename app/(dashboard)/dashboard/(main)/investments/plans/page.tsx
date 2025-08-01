import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { plansUrl, walletsUrl } from "@/app/components/js/config";

import Plans from "./Plans";

const fetchData = async (token: string) => {
  const { data: wallets } = await getRequest(`${walletsUrl}?admin=true`, token);
  const { data: plans } = await getRequest(`${plansUrl}?all=true`, token);

  return {
    plans: plans?.data || [],
    pages: plans?.pages || 0,
    wallets: wallets || [],
  };
};

export default async function Page() {
  const token = await handleProtected(true);
  const { plans, wallets, pages } = await fetchData(token);
  return <Plans pages={pages} investmentPlans={plans} wallets={wallets} />;
}
