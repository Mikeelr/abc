import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { getRequest } from "@/app/components/js/api_client";
import { kycsUrl } from "@/app/components/js/config";
const fetchData = async (token: string) => {
  const { data } = await getRequest(`${kycsUrl}?all=true`, token);
  if (data) {
    return { kycs: data.data, pages: data.pages };
  } else {
    return { kycs: [], pages: 0 };
  }
};
export default async function Page() {
  const token = await handleProtected(false);
  const kycs = await fetchData(token);
  return (
    <div>
      <Body kycs={kycs.kycs} pages={kycs.pages} />
    </div>
  );
}
