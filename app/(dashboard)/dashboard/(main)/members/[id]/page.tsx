import handleProtected from "@/app/components/js/reuseables";
import { UpdateMember } from "../body";
import { usersUrl, walletsUrl } from "@/app/components/js/config";
import { getRequest } from "@/app/components/js/api_client";
import { redirect } from "next/navigation";
const fetchData = async (token: string, id: string) => {
  const { data: uzer } = await getRequest(`${usersUrl}${id}`, token);
  const { data } = await getRequest(
    `${walletsUrl}?username=${uzer?.username}`,
    token
  );
  if (!uzer || !data) redirect("/dashboard/members");
  return { uzer, wallets: data };
};
export default async function Page({ params }: { params: { id: string } }) {
  const token = await handleProtected(true);
  const { uzer, wallets } = await fetchData(token, params.id);
  return <UpdateMember foundUser={uzer} wallets={wallets} />;
}
