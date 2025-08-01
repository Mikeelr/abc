import Body from "./body";
import { getRequest } from "@/app/components/js/api_client";
import { currencysUrl } from "@/app/components/js/config";
const fetchData = async (token?: string, number?: string) => {
  if (!token && !number) return null;
  const { data } = await getRequest(
    `${currencysUrl}?number=${number}&token=${token}`
  );

  return data;
};

export default async function Page(
  props: {
    searchParams: Promise<{ number: string; token: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const currency = await fetchData(searchParams.token, searchParams.number);
  return <Body coin={currency} />;
}
