import { getRequest } from "@/app/components/js/api_client";
import { p2pTransactionsUrl } from "@/app/components/js/config";
import handleProtected from "@/app/components/js/reuseables";
import { redirect } from "next/navigation";
import { UpdateOrder } from "../Order";
const fetchData = async (token: string, id: string) => {
  const { data } = await getRequest(`${p2pTransactionsUrl}${id}`, token);
  if (!data) redirect("/dashboard/p2p/orders");
  return data;
};

export default async function Page({ params }: { params: { id: string } }) {
  const token = await handleProtected(false);
  const data = await fetchData(token, params.id);
  return <UpdateOrder order={data} />;
}
