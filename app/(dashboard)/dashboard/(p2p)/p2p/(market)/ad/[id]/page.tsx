import { getRequest } from "@/app/components/js/api_client";
import { p2pMarketsUrl } from "@/app/components/js/config";
import handleProtected from "@/app/components/js/reuseables";
import { redirect } from "next/navigation";
import { UpdateMarket } from "../../Market";
const fetchData = async (token: string, id: string) => {
  const { data } = await getRequest(`${p2pMarketsUrl}${id}`, token);
  if (!data) redirect("/dashboard/p2p/ad");
  return data;
};

export default async function Page({ params }: { params: { id: string } }) {
  const token = await handleProtected(false);
  const data = await fetchData(token, params.id);
  return <UpdateMarket market={data} />;
}
