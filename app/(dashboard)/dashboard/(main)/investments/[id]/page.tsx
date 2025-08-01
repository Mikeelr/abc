import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { investmentsUrl, plansUrl } from "@/app/components/js/config";
import { redirect } from "next/navigation";
import { ViewInvestment } from "../Investments";
const fetchData = async (token: string, id: string) => {
  const { data: investment } = await getRequest(
    `${investmentsUrl}${id}`,
    token
  );
  const { data: plan } = await getRequest(
    `${plansUrl}${investment.planId}`,
    token
  );
  if (!investment || !plan) {
    redirect("/dashboard/investments/history");
  }

  return { plan, investment };
};

export default async function Page({ params }: { params: { id: string } }) {
  const token = await handleProtected(false);
  const { plan, investment } = await fetchData(token, params.id);
  return <ViewInvestment investment={investment} plan={plan} />;
}
