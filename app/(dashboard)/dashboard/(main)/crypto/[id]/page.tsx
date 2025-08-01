import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { cryptosUrl, usersUrl } from "@/app/components/js/config";
import { UpdateCrypto } from "../Cryptos";
import { redirect } from "next/navigation";
const fetchData = async (token: string, id: string) => {
  const { data } = await getRequest(`${usersUrl}?others=true`, token);
  const { data: dt } = await getRequest(
    `${cryptosUrl}${id}?single=true`,
    token
  );
  if (!dt) {
    redirect("/dashboard/crypto");
  }

  return { users: data?.data || [], crypto: dt };
};

export default async function Page({ params }: { params: { id: string } }) {
  const token = await handleProtected(true);
  const { users, crypto } = await fetchData(token, params.id);
  return <UpdateCrypto foundCrypto={crypto} users={users} />;
}
