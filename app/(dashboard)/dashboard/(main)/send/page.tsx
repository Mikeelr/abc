import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { getRequest } from "@/app/components/js/api_client";
import { walletsUrl } from "@/app/components/js/config";
import { WalletResponseType } from "@/app/components/js/dataTypes";
const fetchData = async (token: string) => {
  const { data, success } = await getRequest(
    walletsUrl,

    token
  );

  if (success) {
    data.data.sort(
      (a: WalletResponseType, b: WalletResponseType) => b.balance - a.balance
    );
  }
  return data.data || [];
};

export default async function Page() {
  const token = await handleProtected(false);
  const wallets = await fetchData(token);
  return (
    <div>
      <Body wallets={wallets} />
    </div>
  );
}
