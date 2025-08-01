import handleProtected from "@/app/components/js/reuseables";
import { Members } from "./body";
import { getRequest } from "@/app/components/js/api_client";
import { usersUrl } from "@/app/components/js/config";
const fetchData = async (token: string) => {
  const { data } = await getRequest(usersUrl, token);
  return data?.data || [];
};

export default async function Page() {
  const token = await handleProtected(true);
  const users = await fetchData(token);
  return <Members users={users} />;
}
