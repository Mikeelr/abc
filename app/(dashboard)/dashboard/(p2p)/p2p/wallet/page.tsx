import handleProtected from "@/app/components/js/reuseables";

import { Wallets } from "./Wallet";
import { getRequest } from "@/app/components/js/api_client";
import { p2pWalletsUrl } from "@/app/components/js/config";

const fetchData = async (token: string) => {
  const { data } = await getRequest(p2pWalletsUrl, token);
  return data?.data || [];
};

export default async function Page() {
  const token = await handleProtected(false);
  const wallets = await fetchData(token);
  return <Wallets wallets={wallets} />;
}
