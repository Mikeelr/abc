import { getRequest } from "@/app/components/js/api_client";
import { p2pPairsUrl, p2pTransactionsUrl } from "@/app/components/js/config";
import handleProtected from "@/app/components/js/reuseables";
import { redirect } from "next/navigation";
import { UpdatePair } from "../Pair";
const fetchData = async (token: string, id: string) => {
  const { data } = await getRequest(`${p2pPairsUrl}${id}`, token);
  const { data: ba } = await getRequest(`${p2pPairsUrl}?baseCoin=true`, token);
  if (!data || !ba) redirect("/dashboard/p2p/pairs");
  return { pair: data, baseCoins: ba.data };
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const token = await handleProtected(true);
  const data = await fetchData(token, params.id);
  return <UpdatePair baseCoins={data.baseCoins} pair={data.pair} />;
}
