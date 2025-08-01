import handleProtected from "@/app/components/js/reuseables";

import { UpdatePost } from "../DashboardBlog";
import { getRequest } from "@/app/components/js/api_client";
import { blogUrl } from "@/app/components/js/config";
import { redirect } from "next/navigation";
const fetchData = async (token: string, id: string) => {
  const { data, success } = await getRequest(`${blogUrl}${id}`, token);
  if (!success) redirect("/dashboard/blog");
  return data;
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const token = await handleProtected(true);
  const post = await fetchData(token, params.id);
  return <UpdatePost data={post} />;
}
