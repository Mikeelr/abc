import { getRequest } from "@/app/components/js/api_client";

import { blogUrl } from "@/app/components/js/config";
import Body from "./body";

const fetchData = async (page: number, author: string) => {
  const { data, success } = await getRequest(
    `${blogUrl}?page=${page}&author=${author}`
  );

  if (success) return data;
  else return { data: [], pages: 1 };
};

export default async function Page(
  props: {
    params: Promise<{}>;
    searchParams: Promise<{ page: string; author: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(`${searchParams.page}`) : 1;
  const author = searchParams.author || "";
  const data = await fetchData(page, author);

  return <Body data={data} />;
}
