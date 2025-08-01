import handleProtected from "@/app/components/js/reuseables";
import { UpdatePlan } from "../Plans";
import { getRequest } from "@/app/components/js/api_client";
import { plansUrl, walletsUrl } from "@/app/components/js/config";
import { redirect } from "next/navigation";

const fetchData = async (token: string, id: string) => {
  const { data: wallets } = await getRequest(`${walletsUrl}?admin=true`, token);
  const { data: plan } = await getRequest(`${plansUrl}${id}`, token);
  if (!wallets || !plan) redirect("/dashboard/investments/plans");
  return { plan, wallets };
};

export default async function Page({ params }: { params: { id: string } }) {
  const token = await handleProtected(true);
  const { plan, wallets } = await fetchData(token, params.id);
  return <UpdatePlan plan={plan} wallets={wallets} />;
}
