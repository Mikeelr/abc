import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { banksUrl, walletsUrl } from "@/app/components/js/config";
import { getRequest } from "@/app/components/js/api_client";
const fetchData = async (token: string) => {
  const { data, success } = await getRequest(`${banksUrl}`, token);

  const { data: walz } = await getRequest(`${walletsUrl}?admin=true`, token);

  return { accounts: data.data || [], wallets: walz || [] };
};

export default async function Page() {
  const token = await handleProtected(false);
  const { wallets, accounts } = await fetchData(token);
  return (
    <div>
      <Body wallets={wallets} accounts={accounts} />
    </div>
  );
}
