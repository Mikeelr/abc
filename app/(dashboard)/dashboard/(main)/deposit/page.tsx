import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { getRequest } from "@/app/components/js/api_client";
import { walletsUrl } from "@/app/components/js/config";
const fetchData = async (token: string) => {
  const { data } = await getRequest(
    `${walletsUrl}?admin=true`,

    token
  );
  return data || [];
};

export default async function Page() {
  const token = await handleProtected(false);
  const adminWallets = await fetchData(token);
  return <Body adminWallets={adminWallets} />;
}
