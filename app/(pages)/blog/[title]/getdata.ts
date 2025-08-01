import { getRequest } from "@/app/components/js/api_client";

import { blogUrl } from "@/app/components/js/config";
import { redirect } from "next/navigation";
export const revalidate = 3600;
const fetchData = async (title: string) => {
  const { data, success } = await getRequest(`${blogUrl}?title=${title}`);

  if (success) return data;
  else redirect("/blog");
};

export default fetchData;
