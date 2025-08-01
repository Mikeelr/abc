import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { plansUrl, walletsUrl } from "@/app/components/js/config";

import { Invest } from "../Investments";
import { redirect } from "next/navigation";

const fetchData = async (token: string, id: string) => {
  const { data: plan } = await getRequest(`${plansUrl}${id}`, token);

  const { data: wallet } = await getRequest(
    `${walletsUrl}?coinName=${plan.coinName}`,
    token
  );
  if (!wallet) redirect("/dashboard/investments");
  return { plan, wallet };
};

export default async function Page(
  props: {
    searchParams: Promise<{ id: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const token = await handleProtected(false);
  const { plan, wallet } = await fetchData(token, searchParams.id);
  return <Invest plan={plan} wallet={wallet} />;
}
