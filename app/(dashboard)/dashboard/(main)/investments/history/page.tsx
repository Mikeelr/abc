import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { investmentsUrl } from "@/app/components/js/config";

import AllInvestments from "../Investments";

const fetchData = async (token: string) => {
  const { data } = await getRequest(investmentsUrl, token);
  return {
    investments: data?.data || [],
    pages: data?.pages || 0,
  };
};

export default async function Page() {
  const token = await handleProtected(false);
  const { investments, pages } = await fetchData(token);
  return <AllInvestments investments={investments} pages={pages} />;
}
