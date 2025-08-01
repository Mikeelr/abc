import handleProtected from "@/app/components/js/reuseables";

import Posts from "./DashboardBlog";
import { getRequest } from "@/app/components/js/api_client";
import { blogUrl } from "@/app/components/js/config";
const fetchData = async (token: string) => {
  const { data } = await getRequest(`${blogUrl}`, token);

  return data
    ? { posts: data.data, pages: data.pages }
    : { posts: [], pages: 0 };
};

export default async function Page() {
  const token = await handleProtected(true);
  const { pages, posts } = await fetchData(token);
  return <Posts data={posts} pages={pages} />;
}
