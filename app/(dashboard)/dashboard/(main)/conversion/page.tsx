import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { getRequest } from "@/app/components/js/api_client";
import { conversionsUrl, walletsUrl } from "@/app/components/js/config";
import { WalletResponseType } from "@/app/components/js/dataTypes";
const fetchData = async (token: string) => {
  const { data } = await getRequest(conversionsUrl, token);

  const { data: wallets } = await getRequest(
    walletsUrl,

    token
  );

  wallets.data.sort(
    (a: WalletResponseType, b: WalletResponseType) => b.balance - a.balance
  );

  return {
    wallets: wallets.data || [],
    conversions: data.data || [],
    pages: data.pages || 0,
  };
};
export default async function Page() {
  const token = await handleProtected(false);
  const { wallets, conversions, pages } = await fetchData(token);
  return (
    <div>
      <Body wallets={wallets} conversions={conversions} convertPages={pages} />
    </div>
  );
}
