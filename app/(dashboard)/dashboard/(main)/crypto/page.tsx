import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { getRequest } from "@/app/components/js/api_client";
import { cryptosUrl, usersUrl } from "@/app/components/js/config";
const fetchData = async (token: string) => {
  const { data } = await getRequest(`${usersUrl}?others=true`, token);
  const { data: dt } = await getRequest(`${cryptosUrl}?custom=true`, token);

  return { users: data?.data || [], cryptos: dt?.data || [] };
};

export default async function Page() {
  const token = await handleProtected(true);
  const { users, cryptos } = await fetchData(token);
  return <Body cryptos={cryptos} users={users} />;
}
